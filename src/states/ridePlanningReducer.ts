import { createAction, createReducer } from "@reduxjs/toolkit";
import StationsRequestDTO from "../dto/StationsRequestDTO";

// Action types (using createAction)
export const planRide = createAction<StationsRequestDTO>("PLAN_RIDE");
export const resetRide = createAction("RESET_RIDE");

// Initial state
interface RidePlanningState {
  stationsRequest: StationsRequestDTO | null;
}

const initialState: RidePlanningState = {
  stationsRequest: null,
};

// Reducer
const ridePlanningReducer = createReducer(initialState, (builder) => {
  builder
    .addCase(planRide, (state, action) => {
      state.stationsRequest = action.payload; // Set ride planning request
    })
    .addCase(resetRide, (state) => {
      state.stationsRequest = null; // Clear ride planning on reset
    });
});

export default ridePlanningReducer;
