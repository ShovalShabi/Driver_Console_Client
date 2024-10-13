import axios from "axios";
import StationsRequestDTO from "../dto/StationsRequestDTO";
import StationResponeDTO from "../dto/StationResponseDTO";
import getEnvVariables from "../etc/loadVariables";

const { orderBusServiceURL } = getEnvVariables();

const orderBusService = {
  /**
   * Fetch bus stations based on the provided line and agency (company).
   * @param stationsRequestDTO - The request object containing lineNumber and agency.
   * @param startStation - The starting station for the bus.
   * @param stopStation - The destination station (optional).
   * @param page - The page number for pagination.
   * @param size - The number of results per page.
   * @returns The list of stations for the specified line.
   */
  async getBusStations(
    stationsRequestDTO: StationsRequestDTO,
    startStation: string,
    stopStation: string = "",
    page: number = 1,
    size: number = 10
  ): Promise<StationResponeDTO[]> {
    try {
      const response = await axios.post<StationResponeDTO[]>(
        `${orderBusServiceURL}/bus/stations?startStation=${startStation}&stopStation=${stopStation}&page=${page}&size=${size}`,
        stationsRequestDTO,
        {
          headers: {
            "Content-Type": "application/json", // Ensure you're sending JSON data
          },
          withCredentials: true, // Include credentials such as cookies in the request
        }
      );
      return response.data;
    } catch (error) {
      console.error("Error fetching bus stations:", error);
      throw error;
    }
  },
};

export default orderBusService;
