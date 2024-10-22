import { createAction, createReducer } from "@reduxjs/toolkit";
import UserDTO from "../dto/UserDTO";

// Action types (no need to define constants)
export const loginUser = createAction<UserDTO>("LOGIN_USER");
export const assignRideDetails = createAction<RideDetails>(
  "ASSIGN_RIDE_DETAILS"
);
export const logoutUser = createAction("LOGOUT_USER");
export const clearRideDetails = createAction("CLEAR_RIDE_DETAILS");

// Initial state for the user reducer
interface UserState {
  /** The logged-in user's information. */
  user: UserDTO | null;
  /** Details of the assigned ride. */
  rideDetails: RideDetails | null;
}

/**
 * Interface representing ride details associated with a user.
 *
 * @interface RideDetails
 * @property {string} lineNumber - The number of the bus line assigned to the user.
 * @property {string} agency - The agency operating the bus line.
 */
export interface RideDetails {
  lineNumber: string;
  agency: string;
}

// Initial state
const initialState: UserState = {
  user: null,
  rideDetails: null,
};

// Reducer
const userReducer = createReducer(initialState, (builder) => {
  builder
    /**
     * Handles the "LOGIN_USER" action, which updates the logged-in user's information.
     * @param {UserState} state - The current state of the user.
     * @param {Action<UserDTO>} action - The action containing the logged-in user details.
     */
    .addCase(loginUser, (state, action) => {
      state.user = action.payload; // Update user with payload
    })
    /**
     * Handles the "LOGOUT_USER" action, which clears the user information.
     * @param {UserState} state - The current state of the user.
     */
    .addCase(logoutUser, (state) => {
      state.user = null; // Clear user on logout
    })
    /**
     * Handles the "ASSIGN_RIDE_DETAILS" action, which updates the ride details for the user.
     * @param {UserState} state - The current state of the user.
     * @param {Action<RideDetails>} action - The action containing ride details.
     */
    .addCase(assignRideDetails, (state, action) => {
      state.rideDetails = action.payload;
    })
    /**
     * Handles the "CLEAR_RIDE_DETAILS" action, which clears the ride details.
     * @param {UserState} state - The current state of the user.
     */
    .addCase(clearRideDetails, (state) => {
      state.rideDetails = null;
    });
});

export default userReducer;
