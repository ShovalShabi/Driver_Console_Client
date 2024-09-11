import "dotenv/config";

export default {
  expo: {
    name: "driver_console_client",
    slug: "driver_console_client",
    version: "1.0.0",
    android: {
      config: {
        googleMaps: {
          apiKey: process.env.EXPO_JAVASCRIPT_MAPS_API_KEY, // Dynamically load from .env
        },
      },
    },
    ios: {
      config: {
        googleMapsApiKey: process.env.EXPO_JAVASCRIPT_MAPS_API_KEY, // For iOS
      },
    },
  },
};
