/**
 * Module declaration for environment variables loaded from `@env`.
 *
 * This file defines the types for environment variables that are accessed
 * within the application using the `@env` module. These variables are typically
 * provided by a `.env` file and loaded at runtime.
 */
declare module "@env" {
  /**
   * The port used by the Expo app.
   * @type {string}
   */
  export const EXPO_PORT: string;

  /**
   * The environment the app is running in (e.g., "dev", "prod").
   * @type {string}
   */
  export const EXPO_ENV: string;

  /**
   * The Google Maps API key for use in the app.
   * @type {string}
   */
  export const EXPO_JAVASCRIPT_MAPS_API_KEY: string;

  /**
   * The backend server IP address.
   * @type {string}
   */
  export const EXPO_BCAKEND_SERVER_IP: string;

  /**
   * The backend server port number.
   * @type {string}
   */
  export const EXPO_BCAKEND_SERVER_PORT: string;

  /**
   * The API endpoint for the Order Bus service.
   * @type {string}
   */
  export const EXPO_ORDER_BUS_SRVICE_ENDPOINT: string;

  /**
   * The API endpoint for the Auth service.
   * @type {string}
   */
  export const EXPO_AUTH_SRVICE_ENDPOINT: string;

  /**
   * The WebSocket endpoint for the Order Bus service.
   * @type {string}
   */
  export const EXPO_ORDER_BUS_SRVICE_WS_ENDPOINT: string;
}
