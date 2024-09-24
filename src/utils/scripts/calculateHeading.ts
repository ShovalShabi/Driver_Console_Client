import { ILocation } from "../ILocation";

const calculateHeading = (
  previousLocation: ILocation,
  currentLocation: ILocation
) => {
  const lat1 = previousLocation.latitude * (Math.PI / 180);
  const lon1 = previousLocation.longitude * (Math.PI / 180);
  const lat2 = currentLocation.latitude * (Math.PI / 180);
  const lon2 = currentLocation.longitude * (Math.PI / 180);

  const y = Math.sin(lon2 - lon1) * Math.cos(lat2);
  const x =
    Math.cos(lat1) * Math.sin(lat2) -
    Math.sin(lat1) * Math.cos(lat2) * Math.cos(lon2 - lon1);
  const bearing = (Math.atan2(y, x) * 180) / Math.PI;

  return (bearing + 360) % 360; // Normalize bearing to 0-360 degrees
};

export default calculateHeading;
