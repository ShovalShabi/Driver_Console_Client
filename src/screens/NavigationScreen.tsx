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
import WelcomeScreen from "./WelcomeScreen";
import StationResponseDTO from "../dto/StationResponseDTO";

const NavigationScreen: React.FC = () => {
  const [stations, setStations] = useState<IStation[]>([]);
  const [isLoggedIn, setIsLoggedIn] = useState(false); // Track if the user is logged in
  const [showStationsList, setShowStationsList] = useState(false); // Track if stations are fetched

  const handleLoginSuccess = (companyName: string) => {
    setIsLoggedIn(true); // Set user as logged in when login is successful
  };

  const handleStationsFetched = (fetchedStations: StationResponseDTO[]) => {
    const formattedStations: IStation[] = fetchedStations.map((station) => ({
      address: station.stationName, // Fallback in case the station name is null
      visited: false,
      data: station,
      coordinate: station.location.latLng,
    }));
    setStations(formattedStations);
    setShowStationsList(true); // Show stations list once stations are fetched
  };

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
        {isLoggedIn && showStationsList ? (
          // Show the stations list and the map once user is logged in and stations are fetched
          <>
            <View style={styles.stationsList}>
              <StationsList stations={stations} />
            </View>
            <View style={styles.map}>
              <Map
                stations={stations}
                onStationVisited={markStationAsVisited}
              />
            </View>
          </>
        ) : (
          // Show WelcomeScreen until the user logs in and stations are fetched
          <>
            <View style={styles.stationsList}>
              <WelcomeScreen
                onLoginSuccess={handleLoginSuccess} // Handle login success
                onStationsFetched={handleStationsFetched} // Handle fetching stations after login
              />
            </View>
            <View style={styles.map}>
              <Map
                stations={stations}
                onStationVisited={markStationAsVisited}
              />
            </View>
          </>
        )}
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
    width: Dimensions.get("window").width * 0.33,
  },
  map: {
    width: Dimensions.get("window").width * 0.67,
  },
});

export default NavigationScreen;
