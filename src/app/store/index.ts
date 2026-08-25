import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./features/auth/auth.Slice";
import areaReducer from "./features/area/area.slice";
import { regionsSlice } from "./features/regions/regions.slice";
import { subRegionsSlice } from "./features/sub-regions/sub-regions.slice";
import { mallsSlice } from "./features/malls/malls.slice";
import { boothsSlice } from "./features/booths/booths.slice";
import { shiftsSlice } from "./features/shifts/shifts.slice";
import { usersSlice } from "./features/users/users.slice";
import { vendorsSlice } from "./features/vendors/vendors.slice";
import { rolesSlice } from "./features/roles/roles.slice";
import { vendorsOfVendorsSlice } from "./features/vendors-organization/vendors/vendors.slice";
import { vendorAreaSlice } from "./features/vendors-organization/area/area.slice";
import { vendorRegionsSlice } from "./features/vendors-organization/regions/regions.slice";
import { vendorSubRegionsSlice } from "./features/vendors-organization/sub-regions/sub-regions.slice";
import { vendorMallsSlice } from "./features/vendors-organization/malls/malls.slice";
import { vendorBoothsSlice } from "./features/vendors-organization/booths/booths.slice";
import { vendorShiftsSlice } from "./features/vendors-organization/shifts/shifts.slice";
import { vendorUsersSlice } from "./features/vendors-organization/users/users.slice";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    area: areaReducer,
    regions: regionsSlice.reducer,
    subRegions: subRegionsSlice.reducer,
    malls: mallsSlice.reducer,
    booths: boothsSlice.reducer,
    shifts: shiftsSlice.reducer,
    users: usersSlice.reducer,
    vendors: vendorsSlice.reducer,
    roles: rolesSlice.reducer,
    vendorsOfVendor: vendorsOfVendorsSlice.reducer,
    vendorAreas: vendorAreaSlice.reducer,
    vendorRegions: vendorRegionsSlice.reducer,
    vendorSubRegions: vendorSubRegionsSlice.reducer,
    vendorMalls: vendorMallsSlice.reducer,
    vendorBooths: vendorBoothsSlice.reducer,
    vendorShifts: vendorShiftsSlice.reducer,
    vendorUsers: vendorUsersSlice.reducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;