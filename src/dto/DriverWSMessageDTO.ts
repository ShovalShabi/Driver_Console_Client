import { ILocation } from "../utils/ILocation";
import { IStation } from "../utils/IStation";
import { WebSocketOptions } from "../utils/WebSocketOptions";

/**
 * Interface representing a WebSocket message for the driver.
 *
 * This message is used in WebSocket communication between the driver client and the server.
 *
 * @interface DriverWSMessage
 * @property {string} agency - The agency name associated with the bus line.
 * @property {string} lineNumber - The bus line number.
 * @property {ILocation | null} targetStation - The location of the target station, can be null if no specific station is targeted.
 * @property {IStation[]} listenersStations - Array of stations that are being tracked or listened to for updates.
 * @property {WebSocketOptions} option - The specific WebSocket option indicating the type of action (e.g., `CANCELING_RIDE`, `ACCEPTING_RIDE`).
 * @property {string} payload - Additional message payload data.
 */
export default interface DriverWSMessage {
  /** The agency name associated with the bus line. */
  agency: string;
  /** The bus line number. */
  lineNumber: string;
  /** The location of the target station, can be null if no specific station is targeted. */
  targetStation: ILocation | null; // Assuming ILocation is LatLng from the backend
  /** Array of stations that are being tracked or listened to for updates. */
  listenersStations: IStation[]; // Adjust this based on your station state type
  /** The specific WebSocket option indicating the type of action. */
  option: WebSocketOptions;
  /** Additional message payload data. */
  payload: string;
}
