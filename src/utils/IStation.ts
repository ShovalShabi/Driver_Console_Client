import StationResponseTDO from "../dto/StationResponseDTO";

/**
 * Interface representing the structure of a station.
 *
 * @interface IStation
 * @property {boolean} visited - Indicates whether the station has been visited by the bus or not.
 * @property {boolean} active - Indicates whether the station is currently active for the route.
 * @property {StationResponseTDO | null} data - The station's data, represented by a StationResponseDTO, or null if no data is available.
 */
export interface IStation {
  /** Indicates whether the station has been visited by the bus or not. */
  visited: boolean;
  /** Indicates whether the station is currently active for the route. */
  active: boolean;
  /** The station's data, represented by a StationResponseDTO, or null if no data is available. */
  data: StationResponseTDO | null;
}
