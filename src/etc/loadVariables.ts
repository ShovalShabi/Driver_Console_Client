import {
  EXPO_PORT,
  EXPO_ENV,
  EXPO_JAVASCRIPT_MAPS_API_KEY,
  EXPO_BCAKEND_SERVER_IP,
  EXPO_ORDER_BUS_SRVICE_WS_ENDPOINT,
  EXPO_ORDER_BUS_SRVICE_DEV_PORT,
  EXPO_ORDER_BUS_SRVICE_PROD_PORT,
  EXPO_AUTH_SRVICE_DEV_PORT,
  EXPO_AUTH_SRVICE_PROD_PORT,
} from "@env";

// Define a function to retrieve environment variables
const getEnvVariables = () => {
  // Validate required variables or provide default values
  let port = 0; // A default port for testing (OS assign the port)
  const env = EXPO_ENV || "dev"; // Default to 'dev' if EXPO_ENV is not defined

  const apiGlobalKey = EXPO_JAVASCRIPT_MAPS_API_KEY || "";

  let orderBusServiceURL, authServiceURL, webSocketOrderBusServiceURL;

  if (env === "dev") {
    port = parseInt(EXPO_PORT || "6002", 10); // Default to 6002 if EXPO_PORT is not defined
    orderBusServiceURL = `http://${EXPO_BCAKEND_SERVER_IP}:${EXPO_ORDER_BUS_SRVICE_DEV_PORT}`;
    authServiceURL = `http://${EXPO_BCAKEND_SERVER_IP}:${EXPO_AUTH_SRVICE_DEV_PORT}`;
    webSocketOrderBusServiceURL = `http://${EXPO_BCAKEND_SERVER_IP}:${EXPO_ORDER_BUS_SRVICE_DEV_PORT}/${EXPO_ORDER_BUS_SRVICE_WS_ENDPOINT}`;
  } else if (env == "prod") {
    port = parseInt(EXPO_PORT || "7002", 10); // Default to 6002 if EXPO_PORT is not defined
    orderBusServiceURL = `http://${EXPO_BCAKEND_SERVER_IP}:${EXPO_ORDER_BUS_SRVICE_PROD_PORT}`;
    authServiceURL = `http://${EXPO_BCAKEND_SERVER_IP}:${EXPO_AUTH_SRVICE_PROD_PORT}`;
    webSocketOrderBusServiceURL = `http://${EXPO_BCAKEND_SERVER_IP}:${EXPO_ORDER_BUS_SRVICE_PROD_PORT}/${EXPO_ORDER_BUS_SRVICE_WS_ENDPOINT}`;
  } else {
    // testing the application, using the services on dev mode
    orderBusServiceURL = `http://${EXPO_BCAKEND_SERVER_IP}:${EXPO_ORDER_BUS_SRVICE_DEV_PORT}`;
    authServiceURL = `http://${EXPO_BCAKEND_SERVER_IP}:${EXPO_AUTH_SRVICE_DEV_PORT}`;
    webSocketOrderBusServiceURL = `http://${EXPO_BCAKEND_SERVER_IP}:${EXPO_ORDER_BUS_SRVICE_DEV_PORT}/${EXPO_ORDER_BUS_SRVICE_WS_ENDPOINT}`;
  }

  console.log(
    `Auth Service ${authServiceURL}\nOrderBus Service ${orderBusServiceURL}\nWeb Socket Endpoint ${webSocketOrderBusServiceURL}`
  );
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
