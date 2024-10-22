import axios from "axios";
import StationsRequestDTO from "../dto/StationsRequestDTO";
import StationResponseDTO from "../dto/StationResponseDTO";
import getEnvVariables from "../etc/loadVariables";

const { orderBusServiceURL } = getEnvVariables();

const orderBusService = {
  /**
   * Fetch bus stations based on the provided line and agency (company).
   *
   * Sends a request to retrieve the list of stations for a specific bus line and agency.
   * It also supports optional pagination and can filter by start and stop stations.
   *
   * @async
   * @param {StationsRequestDTO} stationsRequestDTO - The request object containing `lineNumber` and `agency`.
   * @param {string} startStation - The starting station for the bus.
   * @param {string} [stopStation=""] - The destination station (optional, defaults to an empty string).
   * @param {number} [page=1] - The page number for pagination (optional, defaults to 1).
   * @param {number} [size=10] - The number of results per page (optional, defaults to 10).
   * @returns {Promise<StationResponseDTO[]>} The list of stations for the specified line.
   * @throws {Error} Throws an error if the request fails.
   */
  async getBusStations(
    stationsRequestDTO: StationsRequestDTO,
    startStation: string,
    stopStation: string = "",
    page: number = 1,
    size: number = 10
  ): Promise<StationResponseDTO[]> {
    try {
      const response = await axios.post<StationResponseDTO[]>(
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
