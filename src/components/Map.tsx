// src/components/Map.tsx
import React, { useState, useEffect, useRef } from "react";
import {
  View,
  StyleSheet,
  Dimensions,
  Text,
  TouchableOpacity,
} from "react-native";
import MapView, { Marker, Polyline } from "react-native-maps";
import * as Location from "expo-location";
import { ILocation } from "../utils/ILocation";
import { IStation } from "../utils/IStation";
import { debounce } from "lodash";
import Icons from "react-native-vector-icons/MaterialCommunityIcons";
import getEnvVariables from "../etc/loadVariables";
import decodePolyline from "../utils/scripts/decodePoly";
import axios from "axios";
import getDistanceBetweenPoints from "../utils/scripts/distanceTwoPoints";

interface MapProps {
  stations: IStation[];
  onStationVisited: (stationIndex: number) => void;
}

const Map: React.FC<MapProps> = ({ stations, onStationVisited }) => {
  const [routeCoords, setRouteCoords] = useState<ILocation[]>([]);
  const [currentLocation, setCurrentLocation] = useState<ILocation | null>(
    null
  );
  const [instructions, setInstructions] = useState<string | null>(null);
  const [locationPermissionGranted, setLocationPermissionGranted] =
    useState(false);
  const [heading, setHeading] = useState(0);
  const [zoomLevel, setZoomLevel] = useState(17); // Default zoom level
  const [isUserInteracting, setIsUserInteracting] = useState(false);
  const [routeSteps, setRouteSteps] = useState<any[]>([]); // Store the route steps
  const mapRef = useRef<MapView | null>(null);
  const { apiGlobalKey } = getEnvVariables();

  useEffect(() => {
    requestPermission();
  }, []);

  useEffect(() => {
    if (locationPermissionGranted) {
      getInitialLocation();
    }
  }, [locationPermissionGranted]);

  useEffect(() => {
    initializeMap();
  }, [stations]);

  const requestPermission = async () => {
    let { status } = await Location.requestForegroundPermissionsAsync();
    if (status === "granted") {
      setLocationPermissionGranted(true);
    } else {
      console.error("Location permission denied");
    }
  };

  const getInitialLocation = async () => {
    const location = await Location.getCurrentPositionAsync({
      accuracy: Location.Accuracy.High,
    });
    const initialLocation = {
      latitude: location.coords.latitude,
      longitude: location.coords.longitude,
    };
    setCurrentLocation(initialLocation);
    setHeading(location.coords.heading || 0);
    startTracking();

    // Center the map on the user's current location without changing the zoom level
    if (mapRef.current) {
      mapRef.current.animateCamera({
        center: initialLocation,
        heading: location.coords.heading || 0,
        zoom: zoomLevel, // Use the retained zoom level
      });
    }
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
        } as ILocation;
      } else {
        console.error("No coordinates found for the address");
      }
    } catch (error) {
      console.error("Error fetching coordinates:", error);
    }
    return null;
  };

  const initializeMap = async () => {
    const stationCoordsPromises = stations.map(async (station) => {
      if (station.coordinate) {
        return station.coordinate;
      } else {
        const coord = await fetchCoordinates(station.address);
        station.coordinate = coord; // Update the station with the coordinate
        return coord;
      }
    });

    const stationCoords = (await Promise.all(
      stationCoordsPromises
    )) as ILocation[];

    if (stationCoords.length >= 2) {
      fetchDirections(stationCoords);
    }
  };

  const fetchDirections = async (stationCoords: ILocation[]) => {
    try {
      const originCoord = stationCoords[0];
      const destinationCoord = stationCoords[stationCoords.length - 1];
      const waypoints = stationCoords
        .slice(1, -1)
        .map((coord) => `${coord.latitude},${coord.longitude}`)
        .join("|");

      const response = await axios.get(
        `https://maps.googleapis.com/maps/api/directions/json?origin=${
          originCoord.latitude
        },${originCoord.longitude}&destination=${destinationCoord.latitude},${
          destinationCoord.longitude
        }&waypoints=${encodeURIComponent(waypoints)}&key=${apiGlobalKey}`
      );

      if (response.data.routes.length > 0) {
        const route = response.data.routes[0];
        const points = decodePolyline(route.overview_polyline.points);
        setRouteCoords(points);

        // Set route steps for dynamic instructions
        const steps = route.legs[0].steps.map((step: any) => ({
          instructions: step.html_instructions.replace(/<[^>]+>/g, ""), // Clean HTML tags
          end_location: step.end_location,
        }));
        setRouteSteps(steps);

        // Set the first instruction
        setInstructions(steps[0].instructions);
      } else {
        console.error("No routes found");
      }
    } catch (error) {
      console.error("Error fetching directions:", error);
    }
  };

  const startTracking = async () => {
    if (!locationPermissionGranted) return;

    const debouncedUpdate = debounce((location) => {
      const newCurrentLocation = {
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
      };
      setCurrentLocation(newCurrentLocation);
      setHeading(location.coords.heading || 0);

      const speed = location.coords.speed || 0;
      const newZoomLevel =
        speed < 1 ? 20 : speed < 5 ? 19 : speed > 20 ? 14 : 17;

      // Ensure zoom level only changes if the user is not interacting with the map
      if (!isUserInteracting) {
        setZoomLevel(newZoomLevel);
      }

      // Update the camera only if the user is not interacting with the map
      if (mapRef.current && !isUserInteracting) {
        mapRef.current.animateCamera({
          center: {
            latitude: location.coords.latitude,
            longitude: location.coords.longitude,
          },
          heading: location.coords.heading || 0,
          pitch: 60,
          zoom: zoomLevel, // Retain the current zoom level
        });
      }

      // Check if any station is visited
      checkIfStationVisited(newCurrentLocation);

      // Update instructions dynamically
      updateInstructions(newCurrentLocation);
    }, 1000);

    await Location.watchPositionAsync(
      {
        accuracy: Location.Accuracy.High,
        distanceInterval: 5,
      },
      (location) => {
        debouncedUpdate(location);
      }
    );
  };

  const checkIfStationVisited = (currentLoc: ILocation) => {
    const VISIT_THRESHOLD = 50; // meters
    stations.forEach((station, index) => {
      if (!station.visited && station.coordinate) {
        const distance = getDistanceBetweenPoints(
          currentLoc,
          station.coordinate
        );
        if (distance < VISIT_THRESHOLD) {
          onStationVisited(index);
        }
      }
    });
  };

  const updateInstructions = (currentLoc: ILocation) => {
    const VISIT_THRESHOLD = 50; // Meters to trigger next instruction
    for (let i = 0; i < routeSteps.length; i++) {
      const step = routeSteps[i];
      const stepLocation = step.end_location;

      const distance = getDistanceBetweenPoints(currentLoc, {
        latitude: stepLocation.lat,
        longitude: stepLocation.lng,
      });

      if (distance < VISIT_THRESHOLD) {
        setInstructions(step.instructions);
        break;
      }
    }
  };

  const goToMyLocation = () => {
    if (currentLocation && mapRef.current) {
      setIsUserInteracting(false); // Re-enable automatic camera updates
      mapRef.current.animateCamera({
        center: {
          latitude: currentLocation.latitude,
          longitude: currentLocation.longitude,
        },
        heading: heading,
        zoom: zoomLevel, // Retain the current zoom level without zooming out
      });
    }
  };

  const onMapInteraction = () => {
    setIsUserInteracting(true); // Disable auto zoom when the user interacts with the map
  };

  return (
    <>
      <MapView
        ref={mapRef}
        style={styles.map}
        initialRegion={{
          latitude: currentLocation?.latitude || 0,
          longitude: currentLocation?.longitude || 0,
          latitudeDelta: 0.0922,
          longitudeDelta: 0.0421,
        }}
        showsCompass
        rotateEnabled
        onTouchStart={onMapInteraction}
        onPanDrag={onMapInteraction}
      >
        {currentLocation && (
          <Marker.Animated
            coordinate={currentLocation}
            title="Current Location"
            identifier="currentLocationMarker"
          >
            <Icons name="navigation-outline" size={30} color="#000" />
          </Marker.Animated>
        )}
        {stations.map((station, index) => {
          if (station.coordinate) {
            return (
              <Marker
                key={index}
                coordinate={station.coordinate}
                title={`Station ${index + 1}`}
                description={station.address}
                pinColor={station.visited ? "gray" : "red"}
              />
            );
          }
          return null;
        })}
        {routeCoords.length > 0 && (
          <Polyline
            coordinates={routeCoords}
            strokeWidth={5}
            strokeColor="blue"
          />
        )}
      </MapView>

      {/* Directions Overlay on Upper Left */}
      {instructions && (
        <View style={styles.directionsContainer}>
          <Text style={styles.text}>{instructions}</Text>
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
  directionsContainer: {
    position: "absolute",
    top: 10,
    left: 10,
    backgroundColor: "rgba(255, 255, 255, 0.9)",
    padding: 10,
    borderRadius: 10,
    maxWidth: "40%", // Can use percentage
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
