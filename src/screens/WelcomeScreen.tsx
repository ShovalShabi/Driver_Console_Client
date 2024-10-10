import React, { useState } from "react";
import { View, StyleSheet } from "react-native";
import { Button, TextInput, Title } from "react-native-paper";
import orderBusService from "../services/orderBusService";
import StationResponseDTO from "../dto/StationResponseDTO";
import Login from "../components/Login";
import Register from "../components/Register";

interface WelcomeScreenProps {
  onStationsFetched: (stations: StationResponseDTO[]) => void;
  onLoginSuccess: (companyName: string) => void;
}

const WelcomeScreen: React.FC<WelcomeScreenProps> = ({
  onStationsFetched,
  onLoginSuccess,
}) => {
  const [isRegistered, setIsRegistered] = useState(true); // Toggle between login and registration
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [company, setCompany] = useState("");
  const [lineNumber, setLineNumber] = useState("");
  const [startingPoint, setStartingPoint] = useState("");

  const handleLoginSuccess = (companyName: string) => {
    setCompany(companyName);
    setIsLoggedIn(true);
    onLoginSuccess(companyName); // Notify parent component that login was successful
  };

  const handleRegisterSuccess = () => {
    setIsRegistered(true);
  };

  const handleGetBusStations = async () => {
    const stationsRequest = {
      lineNumber,
      agency: company,
    };

    try {
      const stations = await orderBusService.getBusStations(
        stationsRequest,
        startingPoint
      );
      onStationsFetched(stations); // Pass fetched stations to the parent component
    } catch (error) {
      console.error("Error fetching bus stations:", error);
    }
  };

  // Toggle between login and register forms based on state
  if (!isLoggedIn) {
    return (
      <View style={styles.container}>
        {isRegistered ? (
          <Login
            onLoginSuccess={handleLoginSuccess}
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
