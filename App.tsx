import React, { useState } from "react";
import { View, StyleSheet, SafeAreaView, StatusBar } from "react-native";
import {
  Provider as PaperProvider,
  configureFonts,
  DefaultTheme,
} from "react-native-paper";
import Login from "./src/components/Login"; // Adjust path if needed
import StationsList from "./src/components/StationsList"; // Adjust path if needed
import Map from "./src/components/Map"; // Adjust path if needed

const App: React.FC = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const theme = {
    ...DefaultTheme,
    colors: {
      ...DefaultTheme.colors,
      primary: "#00D5FA", // Adjust colors as needed
    },
    fonts: configureFonts({
      /* Provide font configuration if needed */
    }),
  };

  return (
    <PaperProvider theme={theme}>
      <SafeAreaView style={styles.container}>
        <StatusBar barStyle="dark-content" />
        <View style={styles.contentContainer}>
          <View style={styles.stationsList}>
            {isLoggedIn ? (
              <StationsList stations={[]} />
            ) : (
              <Login onLoginSuccess={() => setIsLoggedIn(true)} />
            )}
          </View>
          <View style={styles.map}>
            <Map />
          </View>
        </View>
      </SafeAreaView>
    </PaperProvider>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  contentContainer: {
    flex: 1,
    flexDirection: "row",
  },
  stationsList: {
    flex: 1,
    marginRight: 8,
  },
  map: {
    flex: 2,
  },
});

export default App;
