import { ILocation } from "../ILocation";

/**
 * Calculates the distance between two geographical points using the Haversine formula.
 *
 * This function returns the distance in meters between two locations defined by latitude and longitude.
 *
 * @param {ILocation} loc1 - The first location (latitude and longitude).
 * @param {ILocation} loc2 - The second location (latitude and longitude).
 * @returns {number} The distance between the two locations in meters.
 */
const getDistanceBetweenPoints = (loc1: ILocation, loc2: ILocation): number => {
  const toRad = (value: number) => (value * Math.PI) / 180;

  const lat1 = loc1.latitude;
  const lon1 = loc1.longitude;
  const lat2 = loc2.latitude;
  const lon2 = loc2.longitude;

  const R = 6378137; // Earth’s mean radius in meters
  const dLat = toRad(lat2 - lat1);
  const dLong = toRad(lon2 - lon1);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRad(lat1)) *
      Math.cos(toRad(lat2)) *
      Math.sin(dLong / 2) *
      Math.sin(dLong / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const d = R * c;
  return d; // returns the distance in meters
};

export default getDistanceBetweenPoints;
