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
import Icons from "react-native-vector-icons/MaterialCommunityIcons";
import getEnvVariables from "../etc/loadVariables";
import decodePolyline from "../utils/scripts/decodePoly";
import axios from "axios";
import getDistanceBetweenPoints from "../utils/scripts/distanceTwoPoints";
import { resetRide } from "../states/ridePlanningReducer";
import { useDispatch, useSelector } from "react-redux";
import webSocketService from "../services/webSocketService";
import { RootState } from "../states/store";

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
  const [zoomLevel, setZoomLevel] = useState(18);
  const [routeSteps, setRouteSteps] = useState<any[]>([]);
  const [, setDimensions] = useState({
    width: Dimensions.get("window").width,
    height: Dimensions.get("window").height,
  });

  const dispatch = useDispatch();

  const mapRef = useRef<MapView | null>(null);
  const { apiGlobalKey } = getEnvVariables();
  const userStore = useSelector((state: RootState) => state.user);
  const ridePlanningStore = useSelector(
    (state: RootState) => state.ridePlanning
  );

  // Connect to WebSocket when the component is mounted
  useEffect(() => {
    webSocketService.connect(); // Connect to WebSocket server when the component mounts
    return () => {
      webSocketService.disconnect(); // Disconnect WebSocket when the component unmounts
    };
  }, []); // Empty dependency array ensures this effect runs once when the component mounts and cleans up on unmount

  let watchLocationSubscription: any = null;

  useEffect(() => {
    console.log("tilt took place in Map");
    const handleDimensionChange = () => {
      setDimensions({
        width: Dimensions.get("window").width,
        height: Dimensions.get("window").height,
      });
    };

    const subscription = Dimensions.addEventListener(
      "change",
      handleDimensionChange
    );

    return () => {
      subscription?.remove();
    };
  }, [Dimensions.get("window")]);

  useEffect(() => {
    requestPermission();
    webSocketService.connect(); // Connect to WebSocket server when the component mounts
    return () => {
      webSocketService.disconnect(); // Disconnect WebSocket when the component unmounts
    };
  }, []);

  useEffect(() => {
    if (locationPermissionGranted) {
      getInitialLocation();
    }
  }, [locationPermissionGranted]);

  useEffect(() => {
    initializeMap();
    return () => {
      if (watchLocationSubscription) {
        watchLocationSubscription.remove();
      }
    };
  }, [stations]);

  const requestPermission = async () => {
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status === "granted") {
        setLocationPermissionGranted(true);
      } else {
        alert(
          "Location permission denied. Please enable location services in your settings."
        );
        console.error("Location permission denied");
      }
    } catch (error) {
      console.error("Error requesting location permission", error);
    }
  };

  const getInitialLocation = async () => {
    try {
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

      if (mapRef.current) {
        mapRef.current.animateCamera({
          center: initialLocation,
          heading: location.coords.heading || 0,
          zoom: zoomLevel, // Start with default zoom
          pitch: 60, // Driver perspective
        });
      }
    } catch (error) {
      console.error("Can't obtain location", error);
      alert(
        "Unable to fetch current location. Please check your location settings."
      );
    }
  };

  const startTracking = async () => {
    if (!locationPermissionGranted) return;

    if (watchLocationSubscription) {
      watchLocationSubscription.remove();
    }

    watchLocationSubscription = await Location.watchPositionAsync(
      {
        accuracy: Location.Accuracy.BestForNavigation,
        distanceInterval: 1,
        timeInterval: 1000, // Update every second
      },
      (location) => {
        const newCurrentLocation = {
          latitude: location.coords.latitude,
          longitude: location.coords.longitude,
        };

        const newHeading = location.coords.heading || 0;
        setHeading(newHeading);
        setCurrentLocation(newCurrentLocation);

        if (mapRef.current) {
          mapRef.current.animateCamera({
            center: newCurrentLocation,
            heading: newHeading,
            pitch: 60,
            zoom: zoomLevel, // Respect manually tracked zoom level
          });
        }

        checkIfStationVisited(newCurrentLocation);
        updateInstructions(newCurrentLocation);
      }
    );
  };

  const initializeMap = async () => {
    const stationCoords = stations
      .filter((station) => station.data && station.data.location.latLng)
      .map((station) => station.data!.location.latLng);

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

        const steps = route.legs[0].steps.map((step: any) => ({
          instructions: step.html_instructions.replace(/<[^>]+>/g, ""), // Clean HTML tags
          end_location: step.end_location,
        }));
        setRouteSteps(steps);
        setInstructions(steps[0].instructions);
      } else {
        console.error("No routes found");
        dispatch(resetRide());
      }
    } catch (error) {
      console.error("Error fetching directions:", error);
    }
  };

  const checkIfStationVisited = (currentLoc: ILocation) => {
    const VISIT_THRESHOLD = 50; // meters
    stations.forEach((station, index) => {
      if (!station.visited && station.data?.location.latLng) {
        const distance = getDistanceBetweenPoints(
          currentLoc,
          station.data.location.latLng
        );
        if (distance < VISIT_THRESHOLD) {
          onStationVisited(index);
          // Send update route step message via WebSocket
          const { agency, lineNumber } = userStore.rideDetails!;
          webSocketService.updateRouteStep(
            agency,
            lineNumber,
            currentLoc,
            stations
          );
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
      mapRef.current.animateCamera({
        center: {
          latitude: currentLocation.latitude,
          longitude: currentLocation.longitude,
        },
        heading: heading || 10,
        pitch: 60,
        zoom: zoomLevel,
      });
    }
  };

  return (
    <>
      <View style={{ width: "100%", height: "100%" }}>
        <MapView
          ref={mapRef}
          style={styles.map}
          initialRegion={{
            latitude: currentLocation?.latitude || 32.063066,
            longitude: currentLocation?.longitude || 34.83005,
            latitudeDelta: 0.01,
            longitudeDelta: 0.01,
          }}
          showsCompass
          rotateEnabled
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
            if (station.data?.location.latLng) {
              return (
                <Marker
                  key={index}
                  coordinate={station.data.location.latLng}
                  title={`${station.data.stationName}`}
                  description={`Station ${index}`}
                  pinColor={
                    station.visited ? "gray" : station.active ? "green" : "red"
                  }
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

        {instructions && (
          <View style={styles.directionsContainer}>
            <Text style={styles.text}>{instructions}</Text>
          </View>
        )}

        <TouchableOpacity
          style={[
            styles.locationButton,
            { bottom: 50, right: 20 }, // Use dynamic position relative to the window size
          ]}
          onPress={goToMyLocation}
        >
          <Icons name="crosshairs-gps" size={30} color="#fff" />
        </TouchableOpacity>
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  map: {
    width: Dimensions.get("window").width,
    height: Dimensions.get("window").height,
    flex: 1,
  },
  directionsContainer: {
    position: "absolute",
    top: 10,
    left: 10,
    backgroundColor: "rgba(255, 255, 255, 0.9)",
    padding: 10,
    borderRadius: 10,
    maxWidth: "40%",
    minWidth: 100,
  },
  text: {
    fontSize: 14,
    fontWeight: "bold",
  },
  locationButton: {
    position: "absolute",
    // bottom: Dimensions.get("window").height - 50,
    // right: Dimensions.get("window").width - 20,
    backgroundColor: "#3FA2F6",
    borderRadius: 50,
    padding: 10,
    elevation: 5,
  },
});

export default Map;
