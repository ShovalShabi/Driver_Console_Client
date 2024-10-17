import { ILocation } from "../utils/ILocation";
import { IStation } from "../utils/IStation";
import { WebSocketOptions } from "../utils/WebSocketOptions";

export default interface DriverWSMessage {
  agency: string;
  lineNumber: string;
  targetStation: ILocation | null; // Assuming ILocation is LatLng from the backend
  listenersStations: IStation[]; // Adjust this based on your station state type
  option: WebSocketOptions;
  payload: string;
}
