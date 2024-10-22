import { ILocation } from "../ILocation";

/**
 * Compares two geographical coordinates with a precision of three decimal places.
 *
 * This function checks if the latitude and longitude of two locations are equal when rounded to three decimal places.
 *
 * @param {ILocation} location1 - The first location to compare.
 * @param {ILocation} location2 - The second location to compare.
 * @returns {boolean} Returns `true` if the coordinates match with the specified precision, otherwise `false`.
 */
export default function compareCoordinatesWithPrecision(
  location1: ILocation,
  location2: ILocation
): boolean {
  const roundToThreeDecimals = (num: number) => Math.round(num * 1000) / 1000;

  return (
    roundToThreeDecimals(location1.latitude) ===
      roundToThreeDecimals(location2.latitude) &&
    roundToThreeDecimals(location1.longitude) ===
      roundToThreeDecimals(location2.longitude)
  );
}
