import axios from "axios";
import UserDTO from "../dto/UserDTO";
import getEnvVariables from "../etc/loadVariables";
import { Role } from "../utils/Role";

const { authServiceURL } = getEnvVariables();

const authService = {
  /**
   * Register a new user for the specified company.
   *
   * Sends a request to register a new user with the role of `DRIVER` to the authentication service.
   *
   * @async
   * @param {string} company - The company to register the user for.
   * @param {UserDTO} userDTO - The user registration details, including name, email, and password.
   * @returns {Promise<UserDTO>} The registered UserDTO object.
   * @throws {Error} Throws an error if the registration fails.
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
   *
   * Sends a login request to authenticate the user with the provided email and password.
   *
   * @async
   * @param {string} email - The user's email address.
   * @param {string} password - The user's password.
   * @returns {Promise<UserDTO>} The authenticated UserDTO object, possibly containing a JWT token.
   * @throws {Error} Throws an error if the login fails.
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
