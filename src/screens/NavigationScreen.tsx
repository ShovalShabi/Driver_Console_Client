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
import UserDTO from "../dto/UserDTO";
import { RootState } from "../states/store";
import { useSelector } from "react-redux";
import StationsRequestDTO from "../dto/StationsRequestDTO";

const NavigationScreen: React.FC = () => {
  const [stations, setStations] = useState<IStation[]>([]);

  // Access logged-in user from Redux store
  const user: UserDTO | null = useSelector(
    (state: RootState) => state.user.user
  );

  // Access logged-in user from Redux store
  const stationsRequest: StationsRequestDTO | null = useSelector(
    (state: RootState) => state.ridePlanning.stationsRequest
  );

  const handleStationsFetched = (fetchedStations: StationResponseDTO[]) => {
    const formattedStations: IStation[] = fetchedStations.map((station) => ({
      address: station.stationName, // Fallback in case the station name is null
      visited: false,
      data: station,
      coordinate: station.location.latLng,
    }));
    setStations(formattedStations);
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
        {user && stationsRequest ? (
          // Show the stations list and the map once user is logged in and stations are fetched
          <>
            <View style={styles.leftPane}>
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
            <View style={styles.leftPane}>
              <WelcomeScreen
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
  leftPane: {
    width: Dimensions.get("window").width * 0.33,
  },
  map: {
    width: Dimensions.get("window").width * 0.67,
  },
});

export default NavigationScreen;
