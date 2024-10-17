import { createAction, createReducer } from "@reduxjs/toolkit";
import { IStation } from "../utils/IStation";

// Action types (using createAction)
export const planRide = createAction<IStation[]>("PLAN_RIDE");
export const resetRide = createAction("RESET_RIDE");

// Initial state
interface RidePlanningState {
  stationsResponseArr: IStation[] | null;
}

const initialState: RidePlanningState = {
  stationsResponseArr: [],
};

// Reducer
const ridePlanningReducer = createReducer(initialState, (builder) => {
  builder
    .addCase(planRide, (state, action) => {
      state.stationsResponseArr = action.payload; // Set ride planning response
    })
    .addCase(resetRide, (state) => {
      state.stationsResponseArr = null; // Clear ride planning on reset
    });
});

export default ridePlanningReducer;
