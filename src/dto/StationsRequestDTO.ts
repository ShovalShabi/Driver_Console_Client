/**
 * Interface representing the request data for fetching stations.
 *
 * This is typically used to request a list of stations for a specific bus line and agency.
 *
 * @interface StationsRequestDTO
 * @property {string} lineNumber - The number of the bus line.
 * @property {string} agency - The name of the bus agency.
 */
export default interface StationsRequestDTO {
  /** The number of the bus line. */
  lineNumber: string;
  /** The name of the bus agency. */
  agency: string;
}
