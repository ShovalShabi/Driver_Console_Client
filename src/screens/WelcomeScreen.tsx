import React, { useState } from "react";
import { View, StyleSheet } from "react-native";
import { Button, TextInput, Title } from "react-native-paper";
import orderBusService from "../services/orderBusService";
import Login from "../components/Login";
import Register from "../components/Register";
import UserDTO from "../dto/UserDTO";
import { useDispatch, useSelector } from "react-redux";
import { planRide, resetRide } from "../states/ridePlanningReducer";
import { RootState } from "../states/store";
import { IStation } from "../utils/IStation";
import StationResponseTDO from "../dto/StationResponseDTO";
import { assignRideDetails, RideDetails } from "../states/userReducer";

/**
 * WelcomeScreen component for displaying login/registration forms and ride details.
 *
 * It allows the user to log in or register and, upon login, input the line number and starting point to fetch bus stations.
 *
 * @component
 * @returns {React.ReactElement} The rendered WelcomeScreen component.
 */
const WelcomeScreen: React.FC = () => {
  const [isRegistered, setIsRegistered] = useState(true); // Toggle between login and registration
  const [lineNumber, setLineNumber] = useState("");
  const [startingPoint, setStartingPoint] = useState("");
  const dispatch = useDispatch();

  // Access logged-in user from Redux store
  const user: UserDTO | null = useSelector(
    (state: RootState) => state.user.user
  );

  /**
   * Handles the successful registration event and switches to login form.
   */
  const handleRegisterSuccess = () => {
    setIsRegistered(true);
  };

  /**
   * Fetches bus stations based on the line number and starting point provided by the user.
   * Dispatches the stations and ride details to the Redux store.
   */
  const handleGetBusStations = async () => {
    const stationsRequest: RideDetails = {
      lineNumber,
      agency: user!.company,
    };

    try {
      const stations: StationResponseTDO[] =
        await orderBusService.getBusStations(stationsRequest, startingPoint);

      const adjustedStations: IStation[] = stations.map((station) => {
        const iStation: IStation = {
          visited: false,
          active: false,
          data: station,
        };
        return iStation;
      });
      dispatch(assignRideDetails(stationsRequest));
      dispatch(planRide(adjustedStations)); // Dispatch the ride planning action to Redux store
    } catch (error) {
      console.error("Error fetching bus stations:", error);
      dispatch(resetRide());
    }
  };

  // Toggle between login and register forms based on state
  if (!user) {
    return (
      <View style={styles.container}>
        {isRegistered ? (
          <Login
            onSwitchToRegister={() => setIsRegistered(false)} // Switch to registration
          />
        ) : (
          <Register
            onRegisterSuccess={handleRegisterSuccess}
            onCancel={() => setIsRegistered(true)} // Switch back to login
          />
        )}
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Title>Ride Details</Title>
      <TextInput
        label="Line Number"
        value={lineNumber}
        onChangeText={setLineNumber}
        mode="outlined"
        style={styles.input}
      />
      <TextInput
        label="Starting Point"
        value={startingPoint}
        onChangeText={setStartingPoint}
        mode="outlined"
        style={styles.input}
      />
      <Button
        mode="contained"
        style={styles.button}
        onPress={handleGetBusStations}
      >
        Get Bus Stations
      </Button>
    </View>
  );
};

// Styles for the WelcomeScreen component
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    padding: 16,
  },
  input: {
    marginBottom: 16,
  },
  button: {
    marginTop: 16,
  },
});

export default WelcomeScreen;
