import { createSlice } from "@reduxjs/toolkit";
import { fetchVendorRegions } from "./regionsThunk";
import type { RegionBody } from "@/types/regions";

interface RegionsState {
    regions: RegionBody[];
    loading: boolean;
    error: string | null;
    total: number;
}

const initialState: RegionsState = {
    regions: [],
    loading: false,
    error: null,
    total: 0,
};

export const vendorRegionsSlice = createSlice({
    name: "vendorRegions",
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchVendorRegions.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchVendorRegions.fulfilled, (state, action) => {
                state.loading = false;
                state.error = null;
                state.regions = action.payload?.data?.VendorRegion as RegionBody[];
                state.total = action.payload?.data?.meta?.total || 0;
            })
            .addCase(fetchVendorRegions.rejected, (state, action) => {
                state.loading = false;
                console.log(action.payload)
                state.error = action.payload.message as string;
            })
    }
});
export default vendorRegionsSlice.reducer;
