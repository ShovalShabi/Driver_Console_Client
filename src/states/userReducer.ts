import { createAction, createReducer } from "@reduxjs/toolkit";
import UserDTO from "../dto/UserDTO";

// Action types (no need to define constants)
export const loginUser = createAction<UserDTO>("LOGIN_USER");
export const logoutUser = createAction("LOGOUT_USER");

// Initial state
interface UserState {
  user: UserDTO | null;
}

const initialState: UserState = {
  user: null,
};

// Reducer
const userReducer = createReducer(initialState, (builder) => {
  builder
    .addCase(loginUser, (state, action) => {
      state.user = action.payload; // Update user with payload
    })
    .addCase(logoutUser, (state) => {
      state.user = null; // Clear user on logout
    });
});

export default userReducer;
