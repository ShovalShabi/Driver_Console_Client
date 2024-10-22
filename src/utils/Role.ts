/**
 * Enum representing the different roles within the system.
 *
 * @enum {string}
 * @property {string} ADMINSTRATOR - The administrator role, responsible for managing the system and overseeing operations.
 * @property {string} DRIVER - The driver role, responsible for navigating the bus and responding to passenger requests.
 */
export enum Role {
  /**Represents the administrator of the system. */
  ADMINSTRATOR = "ADMINSTRATOR",
  /**Represents the driver in the system. */
  DRIVER = "DRIVER",
}
