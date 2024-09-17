import { ILocation } from "../ILocation";

const getDistanceBetweenPoints = (loc1: ILocation, loc2: ILocation) => {
  const toRad = (value: number) => (value * Math.PI) / 180;

  const lat1 = loc1.latitude;
  const lon1 = loc1.longitude;
  const lat2 = loc2.latitude;
  const lon2 = loc2.longitude;

  const R = 6378137; // Earth’s mean radius in meter
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
