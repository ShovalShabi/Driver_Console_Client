// App.tsx
import React, { useState } from "react";
import {
  Provider as PaperProvider,
  configureFonts,
  DefaultTheme,
} from "react-native-paper";
import Login from "./src/components/Login"; // Adjust path if needed
import NavigationScreen from "./src/screens/NavigationScreen"; // Adjust path if needed
import { IStation } from "./src/utils/IStation";

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

  // Define initial stations (can be fetched from a server upon login) -- Remove later!!!
  const initialStations: IStation[] = [
    { address: "Shoham St 3-5, Be'er Ya'akov", visited: false },
    { address: "מרגולין/רמב''ם, Ness Ziona", visited: false },
    { address: "Margolin/Komarov, Ness Ziona", visited: false },
    {
      address: "Kenyoter/Weizmann, Ness Ziona",
      visited: false,
    },
  ];

  return (
    <PaperProvider theme={theme}>
      {isLoggedIn ? (
        <NavigationScreen initialStations={initialStations} />
      ) : (
        <Login onLoginSuccess={() => setIsLoggedIn(true)} />
      )}
    </PaperProvider>
  );
};

export default App;
