import { Role } from "../utils/Role";

export default interface UserDTO {
  firstName: string;
  surname: string;
  company: string;
  organizationEmail: string;
  password: string;
  role?: Role; // Optional, same as the backend
}
