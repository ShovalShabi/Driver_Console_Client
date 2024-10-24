import {
  EXPO_PORT,
  EXPO_ENV,
  EXPO_JAVASCRIPT_MAPS_API_KEY,
  EXPO_BACKEND_SERVER_IP,
  EXPO_BACKEND_SERVER_PORT,
  EXPO_ORDER_BUS_SRVICE_ENDPOINT,
  EXPO_AUTH_SRVICE_ENDPOINT,
  EXPO_ORDER_BUS_SRVICE_WS_ENDPOINT,
} from "@env";

/**
 * Function to retrieve and validate environment variables used in the application.
 *
 * It handles default values for the development environment and constructs URLs for service endpoints.
 *
 * @function getEnvVariables
 * @returns {Object} An object containing the environment configurations:
 * - `port`: The assigned port for the environment (default for dev is 6002, prod is 7002).
 * - `env`: The environment mode ('dev', 'prod', or default 'dev').
 * - `apiGlobalKey`: The Google Maps API key.
 * - `orderBusServiceURL`: The URL for the Order Bus Service.
 * - `authServiceURL`: The URL for the Auth Service.
 * - `webSocketOrderBusServiceURL`: The WebSocket URL for the Order Bus Service.
 */
const getEnvVariables = () => {
  // Validate required variables or provide default values
  let port = 0; // A default port for testing (OS assigns the port)
  const env = EXPO_ENV || "dev"; // Default to 'dev' if EXPO_ENV is not defined

  const apiGlobalKey = EXPO_JAVASCRIPT_MAPS_API_KEY || "";

  let protocolHttp = "http";
  let backendPort = EXPO_BACKEND_SERVER_PORT;
  let webSocketProtocol = "ws";

  if (env === "dev") {
    port = parseInt(EXPO_PORT || "6002", 10); // Default to 6002 if EXPO_PORT is not defined
  } else if (env === "prod") {
    port = parseInt(EXPO_PORT || "7002", 10); // Default to 7002 if EXPO_PORT is not defined
    protocolHttp = "https";
    backendPort = "80";
    webSocketProtocol = "wss";
  } else {
    // Testing the application, using the services in dev mode, port will remain 0
  }

  const orderBusServiceURL = `${protocolHttp}://${EXPO_BACKEND_SERVER_IP}:${backendPort}/${EXPO_ORDER_BUS_SRVICE_ENDPOINT}`;
  const authServiceURL = `${protocolHttp}://${EXPO_BACKEND_SERVER_IP}:${backendPort}/${EXPO_AUTH_SRVICE_ENDPOINT}`;
  const webSocketOrderBusServiceURL = `${webSocketProtocol}://${EXPO_BACKEND_SERVER_IP}:${backendPort}/${EXPO_ORDER_BUS_SRVICE_WS_ENDPOINT}`;

  return {
    port,
    env,
    apiGlobalKey,
    orderBusServiceURL,
    authServiceURL,
    webSocketOrderBusServiceURL,
  };
};

export default getEnvVariables;
