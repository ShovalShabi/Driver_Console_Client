import React from "react";
import {
  configureFonts,
  DefaultTheme,
  Provider as PaperProvider,
} from "react-native-paper";
import NavigationScreen from "./src/screens/NavigationScreen";
import { Provider } from "react-redux";
import store from "./src/states/store";

const App: React.FC = () => {
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
    <Provider store={store}>
      <PaperProvider theme={theme}>
        <NavigationScreen />
      </PaperProvider>
    </Provider>
  );
};

export default App;
