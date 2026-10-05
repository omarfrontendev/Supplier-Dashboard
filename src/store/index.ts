import { configureStore } from "@reduxjs/toolkit";
import { teamsSlice } from "./features/team/team.slice";

export const store = configureStore({
  reducer: {
    team: teamsSlice.reducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch; 
