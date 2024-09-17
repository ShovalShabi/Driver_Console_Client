import { ILocation } from "./ILocation";

export interface IStation {
  address: string;
  visited: boolean;
  coordinate?: ILocation | null;
}
