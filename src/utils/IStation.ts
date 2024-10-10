import { ILocation } from "./ILocation";
import StationResponseTDO from "../dto/StationResponseDTO";

export interface IStation {
  address: string;
  visited: boolean;
  coordinate?: ILocation | null;
  data: StationResponseTDO | null;
}
