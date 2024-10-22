import React from "react";
import {
  configureFonts,
  DefaultTheme,
  Provider as PaperProvider,
} from "react-native-paper";
import NavigationScreen from "./src/screens/NavigationScreen";
import { Provider } from "react-redux";
import store from "./src/states/store";

/**
 * The main entry point for the `driver_console_client` application.
 *
 * This component sets up the Redux store and applies theming using `react-native-paper`.
 *
 * @component
 * @returns {React.ReactElement} The main application component wrapped with Redux and Paper Providers.
 */
const App: React.FC = () => {
  // Custom theme configuration, extending the default react-native-paper theme
  const theme = {
    ...DefaultTheme,
    colors: {
      ...DefaultTheme.colors,
      primary: "#00D5FA", // Adjust primary color as needed
    },
    fonts: configureFonts({
      /* Provide font configuration if needed */
    }),
  };

  return (
    // Wrap the app with the Redux Provider for state management
    <Provider store={store}>
      {/* Wrap the app with the PaperProvider to apply theming */}
      <PaperProvider theme={theme}>
        {/* Render the NavigationScreen as the main screen */}
        <NavigationScreen />
      </PaperProvider>
    </Provider>
  );
};

export default App;
