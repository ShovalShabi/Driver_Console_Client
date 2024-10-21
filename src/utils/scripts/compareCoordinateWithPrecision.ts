import { ILocation } from "../ILocation";

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
