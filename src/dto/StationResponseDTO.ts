import { ILocation } from "../utils/ILocation";

/**
 * Interface representing the response for a station.
 *
 * This is typically used when retrieving station data from the backend.
 *
 * @interface StationResponseTDO
 * @property {string} stationName - The name of the station.
 * @property {Object} location - An object containing location data for the station.
 * @property {ILocation} location.latLng - The latitude and longitude coordinates of the station.
 * @property {number} stopOrder - The order in which this station appears in the route.
 */
export default interface StationResponseTDO {
  /** The name of the station. */
  stationName: string;
  /** An object containing location data for the station. */
  location: {
    /** The latitude and longitude coordinates of the station. */
    latLng: ILocation;
  };
  /** The order in which this station appears in the route. */
  stopOrder: number;
}
