// store.ts
import userReducer from "./userReducer";
import ridePlanningReducer from "./ridePlanningReducer";
import { configureStore, combineReducers } from "@reduxjs/toolkit";

// Combine reducers
const rootReducer = combineReducers({
  user: userReducer,
  ridePlanning: ridePlanningReducer,
});

/**
 * Type representing the root state of the application.
 * It is inferred from the combined reducers, including `user` and `ridePlanning`.
 *
 * @typedef {ReturnType<typeof rootReducer>} RootState
 */
export type RootState = ReturnType<typeof rootReducer>;

// Create store with Redux Toolkit's configureStore
const store = configureStore({
  reducer: rootReducer, // Pass the rootReducer under the 'reducer' key
});

export default store;
