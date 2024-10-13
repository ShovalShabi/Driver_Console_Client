// store.ts
import userReducer from "./userReducer";
import ridePlanningReducer from "./ridePlanningReducer";
import { configureStore, combineReducers } from "@reduxjs/toolkit";

// Combine reducers
const rootReducer = combineReducers({
  user: userReducer,
  ridePlanning: ridePlanningReducer,
});

// RootState type
export type RootState = ReturnType<typeof rootReducer>;

// Create store with Redux Toolkit's configureStore
const store = configureStore({
  reducer: rootReducer, // Pass the rootReducer under the 'reducer' key
});

export default store;
