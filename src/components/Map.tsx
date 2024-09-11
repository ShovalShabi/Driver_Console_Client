import React, { useState, useEffect } from "react";
import { View, StyleSheet, Dimensions } from "react-native";
import MapView, { Polyline, Marker } from "react-native-maps";
import axios from "axios";
import getEnvVariables from "../etc/loadVariables";
import { ILocation } from "../utils/ILocation";

const Map = () => {
  const [routeCoords, setRouteCoords] = useState<ILocation[]>([]);
  const { apiGlobalKey } = getEnvVariables();

  // Set up coordinates for the start and end locations
  const origin = "37.7749,-122.4194"; // Replace with actual start point
  const destination = "37.7949,-122.4394"; // Replace with actual end point

  useEffect(() => {
    const fetchDirections = async () => {
      try {
        const response = await axios.get(
          `https://maps.googleapis.com/maps/api/directions/json?origin=${origin}&destination=${destination}&key=${apiGlobalKey}`
        );
        if (response.data.routes.length > 0) {
          const points = decodePolyline(
            response.data.routes[0].overview_polyline.points
          );
          setRouteCoords(points);
        } else {
          console.error("No routes found");
        }
      } catch (error) {
        console.error("Error fetching directions:", error);
      }
    };

    fetchDirections();
  }, [origin, destination]);

  const decodePolyline = (t: string) => {
    // Decode the Google polyline to lat/long points
    let points = [];
    let index = 0,
      len = t.length;
    let lat = 0,
      lng = 0;

    while (index < len) {
      let b,
        shift = 0,
        result = 0;
      do {
        b = t.charCodeAt(index++) - 63;
        result |= (b & 0x1f) << shift;
        shift += 5;
      } while (b >= 0x20);
      let dlat = result & 1 ? ~(result >> 1) : result >> 1;
      lat += dlat;

      shift = 0;
      result = 0;
      do {
        b = t.charCodeAt(index++) - 63;
        result |= (b & 0x1f) << shift;
        shift += 5;
      } while (b >= 0x20);
      let dlng = result & 1 ? ~(result >> 1) : result >> 1;
      lng += dlng;

      points.push({
        latitude: lat / 1e5,
        longitude: lng / 1e5,
      });
    }
    return points;
  };

  return (
    <MapView
      style={styles.map}
      initialRegion={{
        latitude: 37.7749, // Example: San Francisco
        longitude: -122.4194,
        latitudeDelta: 0.0922,
        longitudeDelta: 0.0421,
      }}
    >
      {/* Start Marker */}
      <Marker coordinate={{ latitude: 37.7749, longitude: -122.4194 }} />
      {/* End Marker */}
      <Marker coordinate={{ latitude: 37.7949, longitude: -122.4394 }} />
      {/* Polyline connecting the points */}
      {routeCoords.length > 0 && (
        <Polyline coordinates={routeCoords} strokeWidth={5} />
      )}
    </MapView>
  );
};

const styles = StyleSheet.create({
  map: {
    width: Dimensions.get("window").width,
    height: Dimensions.get("window").height,
  },
});

export default Map;
