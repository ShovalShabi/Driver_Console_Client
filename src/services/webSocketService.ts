import { WebSocketOptions } from "../utils/WebSocketOptions";
import getEnvVariables from "../etc/loadVariables";
import { ILocation } from "../utils/ILocation";
import DriverWSMessage from "../dto/DriverWSMessageDTO";
import { IStation } from "../utils/IStation";
import {
  showRideRequestAlert,
  showRideCancellationAlert,
} from "../components/Alert";
import store from "../states/store"; // Import the Redux store
import PassengerWSMessage from "../dto/PassengerWSMessageDTO";
import compareCoordinatesWithPrecision from "../utils/scripts/compareCoordinateWithPrecision";

const driverWebSocketService = {
  websocket: null as WebSocket | null,
  webSocketOrderBusServiceURL: getEnvVariables().webSocketOrderBusServiceURL,
  reconnectInterval: 5000,
  updateInterval: 1000,
  updateTimeoutId: null as NodeJS.Timeout | null,
  reconnectTimeoutId: null as NodeJS.Timeout | null,
  shouldReconnect: true,

  /**
   * Connects to the WebSocket server.
   * Reconnects if the connection fails or is closed.
   */
  connect() {
    if (
      this.websocket &&
      (this.websocket.readyState === WebSocket.OPEN ||
        this.websocket.readyState === WebSocket.CONNECTING)
    ) {
      console.log("skipped connection");
      return;
    }

    console.log(
      `Connecting to WebSocket -> ${this.webSocketOrderBusServiceURL}`
    );
    this.websocket = new WebSocket(this.webSocketOrderBusServiceURL);
    this.shouldReconnect = true;

    this.websocket.onopen = () => {
      console.log("WebSocket connected to server");
      this.startRouteStepUpdate();
    };

    this.websocket.onmessage = (event) => {
      const message: PassengerWSMessage = JSON.parse(event.data);

      if (message.option === WebSocketOptions.REQUEST_BUS) {
        this.showRideRequest(message.payload, message.startLocation);
      } else if (message.option === WebSocketOptions.CANCELING_RIDE) {
        const procedureCancelation = () => {
          this.handleRideEvent(
            message.startLocation,
            WebSocketOptions.CANCELING_RIDE
          );
          showRideCancellationAlert(message.payload);
        };
        procedureCancelation();
      }
    };

    this.websocket.onclose = (event) => {
      console.log(
        `WebSocket connection closed: ${event.code}, reason: ${event.reason}`
      );
      if (!event.wasClean && this.shouldReconnect) {
        this.scheduleReconnect();
      }
    };

    this.websocket.onerror = (error) => {
      console.error("WebSocket error occurred:", error);
    };
  },

  /**
   * Disconnects from the WebSocket server and stops any ongoing updates.
   */
  disconnect() {
    if (this.websocket) {
      this.shouldReconnect = false;
      if (
        this.websocket.readyState === WebSocket.CONNECTING ||
        this.websocket.readyState === WebSocket.OPEN
      )
        this.websocket.close();
      this.websocket = null;
      this.stopRouteStepUpdate();
      if (this.reconnectTimeoutId) {
        clearTimeout(this.reconnectTimeoutId);
      }
    }
  },

  /**
   * Sends a message to the WebSocket server.
   * @param {DriverWSMessage} message - The WebSocket message to send.
   */
  sendMessage(message: DriverWSMessage) {
    if (!this.websocket || this.websocket.readyState !== WebSocket.OPEN) {
      console.error("WebSocket is not open. Cannot send message");
      return;
    }
    this.websocket.send(JSON.stringify(message));
  },

  /**
   * Handles accepting a ride request and sends a message to the server.
   * @param {ILocation} targetStation - The target station for the ride.
   */
  acceptRide(targetStation: ILocation) {
    const { rideDetails } = store.getState().user;
    const { ridePlanning } = store.getState();

    if (!rideDetails || !ridePlanning) {
      console.error("No ride details or ride planning is available.");
      return;
    }

    const { stationsResponseArr } = ridePlanning;
    const { agency, lineNumber } = rideDetails;

    const message: DriverWSMessage = {
      agency,
      lineNumber,
      targetStation,
      listenersStations: stationsResponseArr as IStation[],
      option: WebSocketOptions.ACCEPTING_RIDE,
      payload: "Driver accepted the ride",
    };
    this.sendMessage(message);
  },

  /**
   * Handles canceling a ride request and sends a message to the server.
   * @param {ILocation} targetStation - The target station for the canceled ride.
   */
  cancelRide(targetStation: ILocation) {
    const { rideDetails } = store.getState().user;
    const { ridePlanning } = store.getState();

    if (!rideDetails || !ridePlanning) {
      console.error("No ride details or ride planning is available.");
      return;
    }

    const { stationsResponseArr } = ridePlanning;
    const { agency, lineNumber } = rideDetails;

    const message: DriverWSMessage = {
      agency,
      lineNumber,
      targetStation,
      listenersStations: stationsResponseArr as IStation[],
      option: WebSocketOptions.CANCELING_RIDE,
      payload: "Driver canceled the ride",
    };
    this.sendMessage(message);
  },

  /**
   * Updates the route step with the driver's current location.
   * @param {string} agency - The bus agency.
   * @param {string} lineNumber - The bus line number.
   * @param {ILocation | null} currentLocation - The driver's current location.
   * @param {IStation[]} listenersStations - The stations being tracked for updates.
   */
  updateRouteStep(
    agency: string,
    lineNumber: string,
    currentLocation: ILocation | null,
    listenersStations: IStation[]
  ) {
    const message: DriverWSMessage = {
      agency,
      lineNumber,
      targetStation: currentLocation ? currentLocation : null,
      listenersStations,
      option: WebSocketOptions.UPDATE_ROUTE_STEP,
      payload: "Driver updated their current location",
    };
    this.sendMessage(message);
  },

  /**
   * Handles ride event updates (accept or cancel).
   * @param {ILocation} targetStation - The target station for the ride.
   * @param {WebSocketOptions} option - The WebSocket option for the event (e.g., accept or cancel).
   */
  handleRideEvent(targetStation: ILocation, option: WebSocketOptions) {
    const { stationsResponseArr } = store.getState().ridePlanning;
    const stationIndex = stationsResponseArr?.findIndex((station) =>
      compareCoordinatesWithPrecision(
        station.data?.location.latLng as ILocation,
        targetStation
      )
    );

    if (stationIndex !== undefined && stationIndex >= 0) {
      store.dispatch({
        type: "PLAN_RIDE",
        payload: stationsResponseArr?.map((station, index) =>
          index === stationIndex
            ? {
                ...station,
                active: option === WebSocketOptions.ACCEPTING_RIDE,
              }
            : station
        ),
      });
    }

    if (option === WebSocketOptions.ACCEPTING_RIDE) {
      this.acceptRide(targetStation);
    } else {
      this.cancelRide(targetStation);
    }
  },

  /**
   * Shows a ride request alert to the driver.
   * @param {string} payload - The message payload from the backend.
   * @param {ILocation} targetStation - The target station for the ride.
   */
  showRideRequest(payload: string, targetStation: ILocation) {
    showRideRequestAlert(
      payload,
      (targetStation) =>
        this.handleRideEvent(targetStation, WebSocketOptions.ACCEPTING_RIDE),
      (targetStation) =>
        this.handleRideEvent(targetStation, WebSocketOptions.CANCELING_RIDE),
      targetStation
    );
  },

  /**
   * Schedules a WebSocket reconnection attempt.
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
   * Starts sending route step updates at regular intervals.
   */
  startRouteStepUpdate() {
    console.log("sending route step status");
    this.updateTimeoutId = setInterval(() => {
      const { rideDetails } = store.getState().user;
      const currentLocation = null; // Assuming you track current location in the store
      const listenersStations =
        store.getState().ridePlanning.stationsResponseArr || [];

      if (rideDetails) {
        this.updateRouteStep(
          rideDetails.agency,
          rideDetails.lineNumber,
          currentLocation,
          listenersStations
        );
      }
    }, this.updateInterval);
  },

  /**
   * Stops sending route step updates.
   */
  stopRouteStepUpdate() {
    if (this.updateTimeoutId) {
      clearInterval(this.updateTimeoutId);
      this.updateTimeoutId = null;
    }
  },

  onRideAccepted() {
    console.log("Ride was accepted.");
  },

  onRideCanceled() {
    console.log("Ride was canceled.");
  },

  onRouteStepUpdated() {
    console.log("Route step updated.");
  },
};

export default driverWebSocketService;
