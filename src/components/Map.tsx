import React, { useState, useEffect, useRef } from "react";
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  TouchableOpacity,
} from "react-native";
import MapView, { Marker, Polyline } from "react-native-maps";
import MapViewDirections from "react-native-maps-directions";
import * as Location from "expo-location";
import axios from "axios";
import getEnvVariables from "../etc/loadVariables";
import { ILocation } from "../utils/ILocation";
import { debounce } from "lodash";
import Icons from "react-native-vector-icons/MaterialCommunityIcons";
import decodePolyline from "../utils/scripts/decodePoly";

const Map = () => {
  const [routeCoords, setRouteCoords] = useState<ILocation[]>([]);
  const [currentLocation, setCurrentLocation] = useState<ILocation | null>(
    null
  );
  const [originCoords, setOriginCoords] = useState<ILocation | null>(null);
  const [destinationCoords, setDestinationCoords] = useState<ILocation | null>(
    null
  );
  const [instructions, setInstructions] = useState<string | null>(null);
  const [speedLimit, setSpeedLimit] = useState<string | null>(null);
  const [distanceToTurn, setDistanceToTurn] = useState<number | null>(null);
  const [locationPermissionGranted, setLocationPermissionGranted] =
    useState(false);
  const [heading, setHeading] = useState(0);
  const [zoomLevel, setZoomLevel] = useState(17);
  const [isUserInteracting, setIsUserInteracting] = useState(false); // New state variable
  const mapRef = useRef<MapView | null>(null);
  const { apiGlobalKey } = getEnvVariables();

  const origin = "Shoham St 3-5, Be'er Ya'akov";
  const destination = "Ofer Kenyoter, Ha-Irusim St 53, Ness Ziona, 7406602";

  useEffect(() => {
    const requestPermission = async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status === "granted") {
        setLocationPermissionGranted(true);
        getInitialLocation();
      } else {
        console.error("Location permission denied");
      }
    };

    const getInitialLocation = async () => {
      const location = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.High,
      });
      setCurrentLocation({
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
      });
      setHeading(location.coords.heading || 0);
      startTracking();
    };

    const fetchCoordinates = async (address: string) => {
      try {
        const response = await axios.get(
          `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(
            address
          )}&key=${apiGlobalKey}`
        );
        const location = response.data.results[0]?.geometry.location;
        if (location) {
          return {
            latitude: location.lat,
            longitude: location.lng,
          };
        } else {
          console.error("No coordinates found for the address");
        }
      } catch (error) {
        console.error("Error fetching coordinates:", error);
      }
      return null;
    };

    const fetchDirections = async () => {
      try {
        if (originCoords && destinationCoords) {
          // Making a request for driving directions (regular car)
          const response = await axios.get(
            `https://maps.googleapis.com/maps/api/directions/json?origin=${originCoords.latitude},${originCoords.longitude}&destination=${destinationCoords.latitude},${destinationCoords.longitude}&mode=driving&key=${apiGlobalKey}`
          );

          if (response.data.routes.length > 0) {
            const route = response.data.routes[0];
            const points = decodePolyline(route.overview_polyline.points);
            setRouteCoords(points);

            const leg = route.legs[0];
            const steps = leg.steps;

            if (steps.length > 0) {
              const firstStep = steps[0]; // Taking the first step for instructions
              const newInstructions = firstStep.html_instructions.replace(
                /<[^>]+>/g,
                ""
              );
              setInstructions(newInstructions);
              setSpeedLimit(firstStep.speed_limit || null); // Speed limit might be unavailable
              setDistanceToTurn(firstStep.distance.value);
            }
          } else {
            console.error("No routes found");
          }
        }
      } catch (error) {
        console.error("Error fetching directions:", error);
      }
    };

    const startTracking = async () => {
      if (!locationPermissionGranted) return;

      const debouncedUpdate = debounce((location) => {
        setCurrentLocation({
          latitude: location.coords.latitude,
          longitude: location.coords.longitude,
        });
        setHeading(location.coords.heading || 0);

        const speed = location.coords.speed || 0;
        const newZoomLevel =
          speed < 1 ? 20 : speed < 5 ? 19 : speed > 20 ? 14 : 17; // Adjust zoom based on speed

        setZoomLevel(newZoomLevel);

        // Update the camera only if the user is not interacting with the map
        if (mapRef.current && !isUserInteracting) {
          mapRef.current.animateCamera({
            center: {
              latitude: location.coords.latitude,
              longitude: location.coords.longitude,
            },
            heading: location.coords.heading || 0,
            pitch: 60,
            zoom: newZoomLevel,
          });
        }
      }, 1000);

      Location.watchPositionAsync(
        {
          accuracy: Location.Accuracy.High,
          distanceInterval: 5,
        },
        (location) => {
          debouncedUpdate(location);
        }
      );
    };

    const initializeMap = async () => {
      const originGeo = await fetchCoordinates(origin);
      const destinationGeo = await fetchCoordinates(destination);

      if (originGeo) setOriginCoords(originGeo);
      if (destinationGeo) setDestinationCoords(destinationGeo);

      if (originGeo && destinationGeo) fetchDirections();
    };

    requestPermission();
    initializeMap();
  }, [origin, destination, locationPermissionGranted]);

  const goToMyLocation = () => {
    if (currentLocation && mapRef.current) {
      setIsUserInteracting(false); // Re-enable automatic camera updates
      mapRef.current.animateCamera({
        center: {
          latitude: currentLocation.latitude,
          longitude: currentLocation.longitude,
        },
        heading: heading,
        pitch: 60,
        zoom: zoomLevel,
      });
      console.log("The zoom level: ", zoomLevel);
    }
  };

  // Handler when user starts interacting with the map
  const onMapInteraction = () => {
    setIsUserInteracting(true);
  };

  return (
    <>
      <MapView
        ref={mapRef}
        style={styles.map}
        initialRegion={{
          latitude: originCoords?.latitude || 0,
          longitude: originCoords?.longitude || 0,
          latitudeDelta: 0.0922,
          longitudeDelta: 0.0421,
        }}
        showsCompass
        rotateEnabled
        onTouchStart={onMapInteraction}
        onPanDrag={onMapInteraction}
        onRegionChangeComplete={() => {}}
      >
        {currentLocation && (
          <Marker.Animated
            coordinate={currentLocation}
            title="Bus Location"
            identifier="busMarker"
          >
            <Icons name="navigation-outline" size={30} color="#000" />
          </Marker.Animated>
        )}
        {originCoords && <Marker coordinate={originCoords} title="Start" />}
        {destinationCoords && (
          <Marker coordinate={destinationCoords} title="End" />
        )}
        {routeCoords.length > 0 && (
          <Polyline
            coordinates={routeCoords}
            strokeWidth={5}
            strokeColor="blue"
          />
        )}
        {originCoords && destinationCoords && (
          <MapViewDirections
            origin={originCoords}
            destination={destinationCoords}
            apikey={apiGlobalKey}
            strokeWidth={5}
            strokeColor="blue"
            optimizeWaypoints
            onReady={(result) => {
              if (mapRef.current) {
                mapRef.current.fitToCoordinates(result.coordinates, {
                  edgePadding: { right: 50, bottom: 50, left: 50, top: 50 },
                });
              }
            }}
          />
        )}
      </MapView>

      {/* Instructions Overlay */}
      {instructions && (
        <View style={styles.instructionsContainer}>
          <Text style={styles.text}>Next turn: {instructions}</Text>
          {distanceToTurn && (
            <Text style={styles.text}>
              Distance to turn: {distanceToTurn} meters
            </Text>
          )}
          {speedLimit && (
            <Text style={styles.text}>Speed Limit: {speedLimit}</Text>
          )}
        </View>
      )}

      {/* Button to return to my location */}
      <TouchableOpacity style={styles.locationButton} onPress={goToMyLocation}>
        <Icons name="crosshairs-gps" size={30} color="#fff" />
      </TouchableOpacity>
    </>
  );
};

const styles = StyleSheet.create({
  map: {
    width: Dimensions.get("window").width,
    height: Dimensions.get("window").height,
  },
  instructionsContainer: {
    position: "absolute",
    top: 50,
    left: 10,
    backgroundColor: "rgba(255, 255, 255, 0.9)",
    padding: 10,
    borderRadius: 10,
    maxWidth: "30%", // Limits the width to 30% of the screen
    minWidth: 100, // Minimum width for readability
  },
  text: {
    fontSize: 14,
    fontWeight: "bold",
  },
  locationButton: {
    position: "absolute",
    bottom: 50,
    right: 20,
    backgroundColor: "#3FA2F6",
    borderRadius: 50,
    padding: 10,
    elevation: 5,
  },
});

export default Map;
