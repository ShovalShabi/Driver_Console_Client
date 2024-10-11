import "dotenv/config";

export default {
  expo: {
    name: "driver_console_client",
    slug: "driver_console_client",
    version: "1.0.0",
    android: {
      config: {
        googleMaps: {
          apiKey: process.env.EXPO_JAVASCRIPT_MAPS_API_KEY,
        },
      },
      permissions: ["ACCESS_FINE_LOCATION", "ACCESS_COARSE_LOCATION"],
    },
    ios: {
      config: {
        googleMapsApiKey: process.env.EXPO_JAVASCRIPT_MAPS_API_KEY,
      },
      infoPlist: {
        NSLocationWhenInUseUsageDescription:
          "This app needs access to your location to show your current position on the map.",
      },
    },
  },
};
