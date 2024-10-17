import { WebSocketOptions } from "../utils/WebSocketOptions";
import { ILocation } from "../utils/ILocation";
import getEnvVariables from "../etc/loadVariables";
import DriverWSMessageDTO from "../dto/DriverWSNessageDTO";

// WebSocket service object
const webSocketService = {
  websocket: null as WebSocket | null,
  webSocketOrderBusServiceURL: getEnvVariables().webSocketOrderBusServiceURL,
  reconnectInterval: 5000, // Time to wait before attempting to reconnect (in ms)
  pingInterval: 30000, // Send a ping every 30 seconds
  pingTimeoutId: null as NodeJS.Timeout | null,
  reconnectTimeoutId: null as NodeJS.Timeout | null,

  /**
   * Connect to the WebSocket server
   */
  connect() {
    console.log(
      `Connecting to WebSocket -> ${this.webSocketOrderBusServiceURL}`
    );
    this.websocket = new WebSocket(this.webSocketOrderBusServiceURL);

    this.websocket.onopen = () => {
      console.log("WebSocket connected to server");
      this.startPing(); // Start the ping-pong mechanism
    };

    this.websocket.onmessage = (event) => {
      console.log("Message received from server:", event.data);
    };

    this.websocket.onclose = (event) => {
      console.log(
        "WebSocket connection closed",
        event.reason || "Connection closed"
      );
      this.stopPing(); // Stop pinging when connection closes
      if (!event.wasClean) {
        // Reconnect if the closure was not clean
        this.scheduleReconnect();
      }
    };

    this.websocket.onerror = (error) => {
      console.error("WebSocket error:", error);
      this.websocket?.close(); // Close the socket on error and attempt to reconnect
    };
  },

  /**
   * Disconnect from the WebSocket server
   */
  disconnect() {
    if (this.websocket) {
      this.websocket.close();
      this.websocket = null;
      this.stopPing(); // Stop pinging when disconnected
      if (this.reconnectTimeoutId) {
        clearTimeout(this.reconnectTimeoutId);
      }
    }
  },

  /**
   * Send a WebSocket message to the server
   * @param message - The message to be sent
   */
  sendDriverMessage(message: DriverWSMessageDTO) {
    if (!this.websocket || this.websocket.readyState !== WebSocket.OPEN) {
      console.error("WebSocket is not open. Cannot send message");
      return;
    }

    this.websocket.send(JSON.stringify(message));
    console.log("Message sent:", message);
  },

  /**
   * Accept a ride and send the corresponding message
   * @param agency - The driver's agency
   * @param lineNumber - The line number
   * @param targetStation - The target station location
   */
  acceptRide(agency: string, lineNumber: string, targetStation: ILocation) {
    const message: DriverWSMessageDTO = {
      agency,
      lineNumber,
      targetStation,
      listenersStations: [],
      option: WebSocketOptions.ACCEPTING_RIDE,
      payload: "Driver accepted the ride",
    };
    this.sendDriverMessage(message);
  },

  /**
   * Cancel a ride and send the corresponding message
   * @param agency - The driver's agency
   * @param lineNumber - The line number
   * @param targetStation - The target station location
   */
  cancelRide(agency: string, lineNumber: string, targetStation: ILocation) {
    const message: DriverWSMessageDTO = {
      agency,
      lineNumber,
      targetStation,
      listenersStations: [],
      option: WebSocketOptions.CANCELING_RIDE,
      payload: "Driver canceled the ride",
    };
    this.sendDriverMessage(message);
  },

  /**
   * Update the driver's route step and send the corresponding message
   * @param agency - The driver's agency
   * @param lineNumber - The line number
   * @param currentLocation - The current location of the driver
   */
  updateRouteStep(
    agency: string,
    lineNumber: string,
    currentLocation: ILocation
  ) {
    const message: DriverWSMessageDTO = {
      agency,
      lineNumber,
      targetStation: currentLocation,
      listenersStations: [],
      option: WebSocketOptions.UPDATE_ROUTE_STEP,
      payload: "Driver updated their current location",
    };
    this.sendDriverMessage(message);
  },

  /**
   * Schedule a reconnection attempt
   */
  scheduleReconnect() {
    console.log(
      `Attempting to reconnect in ${this.reconnectInterval / 1000} seconds...`
    );
    this.reconnectTimeoutId = setTimeout(() => {
      this.connect();
    }, this.reconnectInterval);
  },

  /**
   * Start sending ping messages to keep the WebSocket alive
   */
  startPing() {
    this.pingTimeoutId = setInterval(() => {
      if (this.websocket?.readyState === WebSocket.OPEN) {
        this.websocket.send(
          JSON.stringify({ option: WebSocketOptions.UPDATE_ROUTE_STEP })
        );
        console.log("Ping sent to server");
      }
    }, this.pingInterval);
  },

  /**
   * Stop sending ping messages
   */
  stopPing() {
    if (this.pingTimeoutId) {
      clearInterval(this.pingTimeoutId);
      this.pingTimeoutId = null;
    }
  },
};

export default webSocketService;
