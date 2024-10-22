/**
 * Enum representing the different WebSocket message options within the system.
 *
 * @enum {string}
 * @property {string} CANCELING_RIDE - Option for canceling a ride via WebSocket communication.
 * @property {string} ACCEPTING_RIDE - Option for accepting a ride request via WebSocket.
 * @property {string} REQUEST_BUS - Option for requesting a bus via WebSocket.
 * @property {string} UPDATE_ROUTE_STEP - Option for updating the current step of the route via WebSocket.
 */
export enum WebSocketOptions {
  /** Option for canceling a ride via WebSocket communication. */
  CANCELING_RIDE = "CANCELING_RIDE",
  /** Option for accepting a ride request via WebSocket. */
  ACCEPTING_RIDE = "ACCEPTING_RIDE",
  /** Option for requesting a bus via WebSocket. */
  REQUEST_BUS = "REQUEST_BUS",
  /** Option for updating the current step of the route via WebSocket. */
  UPDATE_ROUTE_STEP = "UPDATE_ROUTE_STEP",
}
