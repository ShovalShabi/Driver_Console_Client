// src/screens/NavigationScreen.tsx
import React, { useState } from "react";
import {
  View,
  StyleSheet,
  SafeAreaView,
  StatusBar,
  Dimensions,
} from "react-native";
import StationsList from "../components/StationsList";
import Map from "../components/Map";
import { IStation } from "../utils/IStation";

interface NavigationScreenProps {
  initialStations: IStation[];
}

const NavigationScreen: React.FC<NavigationScreenProps> = ({
  initialStations,
}) => {
  const [stations, setStations] = useState<IStation[]>(initialStations);

  // Function to mark a station as visited
  const markStationAsVisited = (stationIndex: number) => {
    setStations((prevStations) => {
      const updatedStations = [...prevStations];
      updatedStations[stationIndex].visited = true;
      return updatedStations;
    });
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" />
      <View style={styles.contentContainer}>
        <View style={styles.stationsList}>
          <StationsList stations={stations} />
        </View>
        <View style={styles.map}>
          <Map stations={stations} onStationVisited={markStationAsVisited} />
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  contentContainer: {
    flex: 1,
    flexDirection: "row",
  },
  stationsList: {
    width: Dimensions.get("window").width * 0.33, // Adjust as needed
  },
  map: {
    width: Dimensions.get("window").width * 0.67, // Adjust as needed
  },
});

export default NavigationScreen;
