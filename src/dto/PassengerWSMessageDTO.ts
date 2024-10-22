import { ILocation } from "../utils/ILocation";
import { WebSocketOptions } from "../utils/WebSocketOptions";

/**
 * Interface representing a WebSocket message for the passenger.
 *
 * This message is used in WebSocket communication between the passenger client and the server.
 *
 * @interface PassengerWSMessage
 * @property {ILocation} startLocation - The starting location of the passenger.
 * @property {ILocation} endLocation - The destination location of the passenger.
 * @property {WebSocketOptions} option - The specific WebSocket option indicating the type of action (e.g., `REQUEST_BUS`, `CANCELING_RIDE`).
 * @property {string} payload - Additional message payload data.
 */
export default interface PassengerWSMessage {
  /** The starting location of the passenger. */
  startLocation: ILocation;
  /** The destination location of the passenger. */
  endLocation: ILocation;
  /** The specific WebSocket option indicating the type of action. */
  option: WebSocketOptions;
  /** Additional message payload data. */
  payload: string;
}
