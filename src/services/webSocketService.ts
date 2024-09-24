import { useEffect, useRef } from "react";
import { WebSocketOptions } from "../utils/WebSocketOptions";
import { ILocation } from "../utils/ILocation";
import getEnvVariables from "../etc/loadVariables";

// Custom hook to handle WebSocket communication
const useWebSocketService = () => {
  const { webSocketOrderBusURL } = getEnvVariables();
  const websocketRef = useRef<WebSocket | null>(null);

  useEffect(() => {
    websocketRef.current = new WebSocket(webSocketOrderBusURL);
    console.log(`the web socket:${JSON.stringify(websocketRef.current)}`);

    websocketRef.current.onopen = () => {
      console.log("WebSocket connected to server");
    };

    websocketRef.current.onmessage = (event) => {
      console.log("Message received from server:", event.data);
    };

    websocketRef.current.onclose = () => {
      console.log("WebSocket connection closed");
    };

    websocketRef.current.onerror = (error) => {
      console.error("WebSocket error:", error);
    };

    return () => {
      if (websocketRef.current) {
        websocketRef.current.close();
      }
    };
  }, [webSocketOrderBusURL]);

  const sendLocationUpdate = (
    currentLocation: ILocation,
    targetLocation: ILocation
  ) => {
    if (
      !websocketRef.current ||
      websocketRef.current.readyState !== WebSocket.OPEN
    ) {
      console.error("WebSocket is not open. Cannot send message");
      return;
    }

    const message = {
      currentLocation,
      targetLocation,
      option: WebSocketOptions.LOCATION_POLLING,
      destination: "/app/orderbus", // Publish to the correct destination
    };

    websocketRef.current.send(JSON.stringify(message));
    console.log("Location update sent:", message);
  };

  const acceptRide = () => {
    if (
      !websocketRef.current ||
      websocketRef.current.readyState !== WebSocket.OPEN
    ) {
      console.error("WebSocket is not open. Cannot send message");
      return;
    }

    const message = {
      option: WebSocketOptions.ACCEPTING_RIDE,
      destination: "/app/orderbus",
    };

    websocketRef.current.send(JSON.stringify(message));
    console.log("Ride accepted:", message);
  };

  const cancelRide = () => {
    if (
      !websocketRef.current ||
      websocketRef.current.readyState !== WebSocket.OPEN
    ) {
      console.error("WebSocket is not open. Cannot send message");
      return;
    }

    const message = {
      option: WebSocketOptions.CANCELING_RIDE,
      destination: "/app/orderbus",
    };

    websocketRef.current.send(JSON.stringify(message));
    console.log("Ride canceled:", message);
  };

  return { sendLocationUpdate, acceptRide, cancelRide };
};

export default useWebSocketService;
