import { configureStore } from "@reduxjs/toolkit";
import { teamsSlice } from "./features/team/team.slice";
import hotelsSlice from "./features/hotels/hotels.slice";
import hotelOptionsSlice from "./features/hotels/hotel-options.slice";
import contractDraftSlice from "./features/contracts/contract-draft.slice";

export const store = configureStore({
  reducer: {
    team: teamsSlice.reducer,
    hotels: hotelsSlice,
    hotelsOption: hotelOptionsSlice,
    contractDraft: contractDraftSlice,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
