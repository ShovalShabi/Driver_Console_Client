import { createAction, createReducer } from "@reduxjs/toolkit";
import UserDTO from "../dto/UserDTO";

// Action types (no need to define constants)
export const loginUser = createAction<UserDTO>("LOGIN_USER");
export const assignRideDetails = createAction<RideDetails>(
  "ASSIGN_RIDE_DETAILS"
);
export const logoutUser = createAction("LOGOUT_USER");
export const clearRideDetails = createAction("CLEAR_RIDE_DETAILS");

// Initial state
interface UserState {
  user: UserDTO | null;
  rideDetails: RideDetails | null;
}

export interface RideDetails {
  lineNumber: string;
  agency: string;
}

const initialState: UserState = {
  user: null,
  rideDetails: null,
};

// Reducer
const userReducer = createReducer(initialState, (builder) => {
  builder
    .addCase(loginUser, (state, action) => {
      state.user = action.payload; // Update user with payload
    })
    .addCase(logoutUser, (state) => {
      state.user = null; // Clear user on logout
    })
    .addCase(assignRideDetails, (state, action) => {
      state.rideDetails = action.payload;
    })
    .addCase(clearRideDetails, (state) => {
      state.rideDetails = null;
    });
});

export default userReducer;
