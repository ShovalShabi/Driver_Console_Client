import { Role } from "../utils/Role";

/**
 * Interface representing a user data transfer object (DTO).
 *
 * This is used for transferring user information between the client and backend.
 *
 * @interface UserDTO
 * @property {string} firstName - The first name of the user.
 * @property {string} surname - The surname of the user.
 * @property {string} company - The name of the company the user belongs to.
 * @property {string} organizationEmail - The user's organization email.
 * @property {string} password - The password for the user's account.
 * @property {Role} [role] - The user's role within the system (optional, default is handled by the backend).
 */
export default interface UserDTO {
  /** The first name of the user. */
  firstName: string;
  /** The surname of the user. */
  surname: string;
  /** The name of the company the user belongs to. */
  company: string;
  /** The user's organization email. */
  organizationEmail: string;
  /** The password for the user's account. */
  password: string;
  /** The user's role within the system (optional). */
  role?: Role; // Optional, same as the backend
}
