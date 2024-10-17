import StationResponseTDO from "../dto/StationResponseDTO";

export interface IStation {
  visited: boolean;
  active: boolean;
  data: StationResponseTDO | null;
}
