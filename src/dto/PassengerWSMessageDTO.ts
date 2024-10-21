import { ILocation } from "../utils/ILocation";
import { WebSocketOptions } from "../utils/WebSocketOptions";

export default interface PassengerWSMessage {
  startLocation: ILocation;
  endLocation: ILocation;
  option: WebSocketOptions;
  payload: string;
}
