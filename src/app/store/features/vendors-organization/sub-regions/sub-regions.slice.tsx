import { createSlice } from "@reduxjs/toolkit";
import { fetchVendorSubRegions } from "./sub-regionsThunk";
import type { SubRegionBody } from "@/types/sub-regions";

interface SubRegionsState {
    subRegions: SubRegionBody[];
    loading: boolean;
    error: string | null;
    total: number;
}

const initialState: SubRegionsState = {
    subRegions: [],
    loading: false,
    error: null,
    total: 0,
};

export const vendorSubRegionsSlice = createSlice({
    name: "vendorSubRegions",
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchVendorSubRegions.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchVendorSubRegions.fulfilled, (state, action) => {
                state.loading = false;
                state.error = null;
                state.subRegions = action.payload?.data?.VendorSubRegion as SubRegionBody[];
                state.total = action.payload?.data?.meta?.total || 0;
            })
            .addCase(fetchVendorSubRegions.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            })
    }
});
export default vendorSubRegionsSlice.reducer;
