/**
 * Interface representing a geographical location.
 *
 * @interface ILocation
 * @property {number} latitude - The latitude of the location.
 * @property {number} longitude - The longitude of the location.
 */
interface ILocation {
  /** The latitude of the location. */
  latitude: number;
  /** The longitude of the location. */
  longitude: number;
}

export type { ILocation };
