import { ILocation } from "../utils/ILocation";

export default interface StationResponseTDO {
  stationName: string;
  location: {
    latLng: ILocation;
  };
  stopOrder: number;
}
