import React, { useState, useEffect, useRef } from "react";
import {
  View,
  StyleSheet,
  Dimensions,
  Text,
  TouchableOpacity,
} from "react-native";
import MapView, { Marker, Polyline, Camera } from "react-native-maps";
import * as Location from "expo-location";
import { ILocation } from "../utils/ILocation";
import { IStation } from "../utils/IStation";
import Icons from "react-native-vector-icons/MaterialCommunityIcons";
import getEnvVariables from "../etc/loadVariables";
import decodePolyline from "../utils/scripts/decodePoly";
import axios from "axios";
import getDistanceBetweenPoints from "../utils/scripts/distanceTwoPoints";
import webSocketService from "../services/webSocketService";
import { showRideRequestAlert } from "./Alert";

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
  const [heading, setHeading] = useState(0); // Track the device heading
  const [zoomLevel, setZoomLevel] = useState(18); // Lock zoom level to 18
  const [routeSteps, setRouteSteps] = useState<any[]>([]); // Store the route steps
  const mapRef = useRef<MapView | null>(null);
  const { apiGlobalKey } = getEnvVariables();
  let watchLocationSubscription: any = null;

  ///////////////////////*Alert options *///////////////////////////////
  const { acceptRide, cancelRide } = webSocketService(); // Get WebSocket functions

  useEffect(() => {
    // Simulate receiving a ride request and trigger the alert
    setTimeout(() => {
      showRideRequestAlert(acceptRide, cancelRide);
    }, 10000); // Show the alert after 10 seconds for demonstration purposes
  }, []);
  //////////////////////////////////////////////////////

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
    return () => {
      if (watchLocationSubscription) {
        watchLocationSubscription.remove();
      }
    };
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

    if (mapRef.current) {
      mapRef.current.animateCamera({
        center: initialLocation,
        heading: location.coords.heading || 0,
        zoom: zoomLevel, // Start with default zoom
        pitch: 60, // Driver perspective
      });
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

        const steps = route.legs[0].steps.map((step: any) => ({
          instructions: step.html_instructions.replace(/<[^>]+>/g, ""), // Clean HTML tags
          end_location: step.end_location,
        }));
        setRouteSteps(steps);
        setInstructions(steps[0].instructions);
      } else {
        console.error("No routes found");
      }
    } catch (error) {
      console.error("Error fetching directions:", error);
    }
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

  // Capture manual zoom level changes
  const handleRegionChangeComplete = (region: any) => {
    setZoomLevel(region.zoom); // Save the zoom level
  };

  const goToMyLocation = () => {
    if (currentLocation && mapRef.current) {
      console.log(
        `Current zoom level=${zoomLevel}, heading=${heading}, location=${JSON.stringify(
          currentLocation
        )}`
      );

      mapRef.current.animateCamera({
        center: {
          latitude: currentLocation.latitude,
          longitude: currentLocation.longitude,
        },
        heading: heading || 10,
        pitch: 60,
        zoom: zoomLevel, // Use manually tracked zoom level
      });
    }
  };

  return (
    <>
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
        onRegionChangeComplete={handleRegionChangeComplete} // Capture zoom level
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

      {instructions && (
        <View style={styles.directionsContainer}>
          <Text style={styles.text}>{instructions}</Text>
        </View>
      )}

      <TouchableOpacity style={styles.locationButton} onPress={goToMyLocation}>
        <Icons name="crosshairs-gps" size={30} color="#fff" />
      </TouchableOpacity>

      {/* Example button to trigger the alert manually -TO BE DELETED LATER !!!!!!!*/}
      <TouchableOpacity
        style={styles.locationButton}
        onPress={() => showRideRequestAlert(acceptRide, cancelRide)}
      >
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
    maxWidth: "40%",
    minWidth: 100,
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
