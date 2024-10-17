import React from "react";
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
import UserDTO from "../dto/UserDTO";
import { RootState } from "../states/store";
import { useDispatch, useSelector } from "react-redux";
import { planRide } from "../states/ridePlanningReducer";

const NavigationScreen: React.FC = () => {
  const dispatch = useDispatch();

  // Access logged-in user from Redux store
  const user: UserDTO | null = useSelector(
    (state: RootState) => state.user.user
  );

  // Access logged-in user from Redux store
  const stations: IStation[] | null = useSelector(
    (state: RootState) => state.ridePlanning.stationsResponseArr
  );

  // Function to mark a station as visited
  const markStationAsVisited = (stationIndex: number) => {
    const updatedStations = [
      ...stations!.slice(0, stationIndex), // Keep stations before the index
      {
        ...stations![stationIndex], // Create a new object for the updated station
        visited: true,
        active: false,
      },
      ...stations!.slice(stationIndex + 1), // Keep stations after the index
    ];

    // Dispatch the updated array to avoid mutating the original state
    dispatch(planRide(updatedStations));
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" />
      <View style={styles.contentContainer}>
        {user && stations!.length > 0 ? (
          // Show the stations list and the map once user is logged in and stations are fetched
          <>
            <View style={styles.leftPane}>
              <StationsList />
            </View>
            <View style={styles.map}>
              <Map
                stations={stations!}
                onStationVisited={markStationAsVisited}
              />
            </View>
          </>
        ) : (
          // Show WelcomeScreen until the user logs in and stations are fetched
          <>
            <View style={styles.leftPane}>
              <WelcomeScreen />
            </View>
            <View style={styles.map}>
              <Map
                stations={stations!}
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
