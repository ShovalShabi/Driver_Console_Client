import "dotenv/config";

/**
 * Expo configuration for the driver_console_client project.
 * This configuration sets up environment variables, permissions, and platform-specific settings for Android and iOS.
 *
 * @property {Object} expo - The main configuration object for Expo.
 * @property {string} expo.name - The name of the Expo project.
 * @property {string} expo.slug - The URL slug for the project.
 * @property {string} expo.version - The version of the project.
 * @property {Object} expo.android - Android-specific configuration.
 * @property {Object} expo.android.config - Configuration for Android services.
 * @property {Object} expo.android.config.googleMaps - Google Maps API configuration for Android.
 * @property {string} expo.android.config.googleMaps.apiKey - The Google Maps API key for Android (sourced from environment variables).
 * @property {Array<string>} expo.android.permissions - The list of permissions required for the Android app.
 * @property {Object} expo.ios - iOS-specific configuration.
 * @property {Object} expo.ios.config - Configuration for iOS services.
 * @property {string} expo.ios.config.googleMapsApiKey - The Google Maps API key for iOS (sourced from environment variables).
 * @property {Object} expo.ios.infoPlist - The iOS Info.plist configuration.
 * @property {string} expo.ios.infoPlist.NSLocationWhenInUseUsageDescription - The description for requesting location access from users on iOS.
 */
export default {
  expo: {
    name: "driver_console_client",
    slug: "driver_console_client",
    version: "1.0.0",
    android: {
      config: {
        googleMaps: {
          apiKey: process.env.EXPO_JAVASCRIPT_MAPS_API_KEY, // Google Maps API Key for Android
        },
      },
      permissions: ["ACCESS_FINE_LOCATION", "ACCESS_COARSE_LOCATION"], // Location permissions required for Android
    },
    ios: {
      config: {
        googleMapsApiKey: process.env.EXPO_JAVASCRIPT_MAPS_API_KEY, // Google Maps API Key for iOS
      },
      infoPlist: {
        NSLocationWhenInUseUsageDescription:
          "This app needs access to your location to show your current position on the map.", // iOS location access description
      },
    },
  },
};
