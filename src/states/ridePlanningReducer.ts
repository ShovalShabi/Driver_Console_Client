import { createAction, createReducer } from "@reduxjs/toolkit";
import { IStation } from "../utils/IStation";

// Action types (using createAction)
export const planRide = createAction<IStation[]>("PLAN_RIDE");
export const resetRide = createAction("RESET_RIDE");

// Initial state for the ride planning reducer
interface RidePlanningState {
  /** Array of stations involved in the ride planning process. */
  stationsResponseArr: IStation[] | null;
}

// Initial state
const initialState: RidePlanningState = {
  stationsResponseArr: [], // Initially an empty array
};

// Reducer to handle ride planning actions
const ridePlanningReducer = createReducer(initialState, (builder) => {
  builder
    /**
     * Handles the "PLAN_RIDE" action, which updates the stations involved in ride planning.
     * @param {RidePlanningState} state - The current state of ride planning.
     * @param {Action<IStation[]>} action - The action containing the array of stations.
     */
    .addCase(planRide, (state, action) => {
      state.stationsResponseArr = action.payload; // Set ride planning response
    })
    /**
     * Handles the "RESET_RIDE" action, which clears the ride planning stations.
     * @param {RidePlanningState} state - The current state of ride planning.
     */
    .addCase(resetRide, (state) => {
      state.stationsResponseArr = null; // Clear ride planning on reset
    });
});

export default ridePlanningReducer;
