import axios from "axios";
import UserDTO from "../dto/UserDTO";
import getEnvVariables from "../etc/loadVariables";
import { Role } from "../utils/Role";

const { authServiceURL } = getEnvVariables();

const authService = {
  /**
   * Register a new user for the specified company.
   * @param company - The company to register the user for
   * @param userDTO - The user registration details
   * @returns The registered UserDTO
   */
  async registerUser(company: string, userDTO: UserDTO): Promise<UserDTO> {
    try {
      userDTO.role = Role.DRIVER;
      const response = await axios.post<UserDTO>(
        `${authServiceURL}/register/${company}`,
        userDTO,
        {
          headers: {
            "Content-Type": "application/json", // Ensure you're sending JSON data
          },
          withCredentials: true, // Include credentials such as cookies in the request
        }
      );
      return response.data;
    } catch (error) {
      console.error("Error registering user:", error);
      throw error;
    }
  },

  /**
   * Login a user for the specified company.
   * @param email - The user's email
   * @param password - The user's password
   * @returns The authenticated UserDTO with JWT token (if any)
   */
  async loginUser(email: string, password: string): Promise<UserDTO> {
    try {
      const response = await axios.post<UserDTO>(
        `${authServiceURL}/auth?email=${email}&password=${password}`,
        {
          headers: {
            "Content-Type": "application/json", // Ensure you're sending JSON data
          },
          withCredentials: true, // Include credentials such as cookies in the request
        }
      );
      return response.data;
    } catch (error) {
      console.error("Error logging in user:", error);
      throw error; // Re-throw the error after logging
    }
  },
};

export default authService;
