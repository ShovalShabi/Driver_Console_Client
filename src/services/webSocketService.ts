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

const driverWebSocketService = {
  websocket: null as WebSocket | null,
  webSocketOrderBusServiceURL: getEnvVariables().webSocketOrderBusServiceURL,
  reconnectInterval: 5000,
  updateInterval: 1000,
  updateTimeoutId: null as NodeJS.Timeout | null,
  reconnectTimeoutId: null as NodeJS.Timeout | null,
  shouldReconnect: true,

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

      console.log(`Received message from server:`, message);

      if (message.option === WebSocketOptions.REQUEST_BUS) {
        // Show alert with payload when ride is requestet
        this.showRideRequest(message.payload, message.startLocation);

        // store.getState().ridePlanning.stationsResponseArr || []
      } else if (message.option === WebSocketOptions.CANCELING_RIDE) {
        // Handle ride cancellation
        this.handleCancelRide(message.startLocation, message.payload);
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

  sendMessage(message: DriverWSMessage) {
    if (!this.websocket || this.websocket.readyState !== WebSocket.OPEN) {
      console.error("WebSocket is not open. Cannot send message");
      return;
    }
    this.websocket.send(JSON.stringify(message));
  },

  acceptRide(
    targetStation: ILocation // the target station to approve the ride to
  ) {
    const { rideDetails } = store.getState().user;
    const { ridePlanning } = store.getState();

    // Check if rideDetails is null
    if (!rideDetails || !ridePlanning) {
      console.error("No ride details or ride planing is available.");
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

  cancelRide(targetStation: ILocation) {
    const { rideDetails } = store.getState().user;
    const { ridePlanning } = store.getState();

    // Check if rideDetails is null
    if (!rideDetails || !ridePlanning) {
      console.error("No ride details or ride planing is available.");
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

  //This function isrecieved from the passengers
  handleCancelRide(targetStation: ILocation, payload: string) {
    const { stationsResponseArr } = store.getState().ridePlanning;
    const stationIndex = stationsResponseArr?.findIndex(
      (station) =>
        station.data?.location.latLng.latitude === targetStation.latitude &&
        station.data?.location.latLng.longitude === targetStation.longitude
    );

    if (stationIndex !== undefined && stationIndex >= 0) {
      store.dispatch({
        type: "PLAN_RIDE", // Assuming PLAN_RIDE can handle the station update
        payload: stationsResponseArr?.map((station, index) =>
          index === stationIndex ? { ...station, active: false } : station
        ),
      });
    }

    // Show a cancellation alert with only the confirm option
    showRideCancellationAlert(payload);
  },

  handleRideEvent(targetStation: ILocation, option: WebSocketOptions) {
    const { stationsResponseArr } = store.getState().ridePlanning;
    const stationIndex = stationsResponseArr?.findIndex(
      (station) =>
        station.data?.location.latLng.latitude === targetStation.latitude &&
        station.data?.location.latLng.longitude === targetStation.longitude
    );

    if (stationIndex !== undefined && stationIndex >= 0) {
      store.dispatch({
        type: "PLAN_RIDE", // Assuming PLAN_RIDE can handle the station update
        payload: stationsResponseArr?.map((station, index) =>
          index === stationIndex
            ? {
                ...station,
                active: option === WebSocketOptions.ACCEPTING_RIDE, // true if option is to accept ride otherwise it is meant for cancellation
              }
            : station
        ),
      });
    }

    // Show a cancellation alert with only the confirm option
    if (option === WebSocketOptions.ACCEPTING_RIDE) {
      this.acceptRide(targetStation);
    } else {
      this.cancelRide(targetStation);
    }
  },

  showRideRequest(payload: string, targetStation: ILocation) {
    showRideRequestAlert(
      payload,
      (targetStation) =>
        this.handleRideEvent(targetStation, WebSocketOptions.ACCEPTING_RIDE), // Accepting ride
      (targetStation) =>
        this.handleRideEvent(targetStation, WebSocketOptions.CANCELING_RIDE), // Canceling ride
      targetStation
    );
  },

  scheduleReconnect() {
    console.log(
      `Attempting to reconnect in ${this.reconnectInterval / 1000} seconds...`
    );
    this.reconnectTimeoutId = setTimeout(() => {
      this.connect();
    }, this.reconnectInterval);
  },

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

  // Stop sending route steps
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
