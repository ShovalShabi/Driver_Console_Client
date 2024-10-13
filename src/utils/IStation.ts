import StationResponseTDO from "../dto/StationResponseDTO";

export interface IStation {
  visited: boolean;
  data: StationResponseTDO | null;
}
