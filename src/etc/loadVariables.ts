import {
  EXPO_PORT,
  EXPO_ENV,
  EXPO_HOST_TYPE,
  EXPO_JAVASCRIPT_MAPS_API_KEY,
  EXPO_ORDER_BUS_PORT,
  EXPO_WS_SERVER_ENDPOINT,
} from "@env";

// Define a function to retrieve environment variables
const getEnvVariables = () => {
  // Validate required variables or provide default values
  const port = parseInt(EXPO_PORT || "6002", 10); // Default to 3001 if EXPO_PORT is not defined
  const env = EXPO_ENV || "dev"; // Default to 'dev' if EXPO_ENV is not defined

  const apiGlobalKey = EXPO_JAVASCRIPT_MAPS_API_KEY || "";

  //TODO: Need to specify between two environments by EXPO_ENV
  const orderBusURL = `http://${EXPO_HOST_TYPE}:${EXPO_ORDER_BUS_PORT}`;

  const webSocketOrderBusURL = `ws:///192.168.1.186:10093/${EXPO_WS_SERVER_ENDPOINT}`; //Temporary!!! later on there wil be the container name of the backend microservice orderbus

  return {
    port,
    env,
    apiGlobalKey,
    orderBusURL,
    webSocketOrderBusURL,
  };
};

export default getEnvVariables;
