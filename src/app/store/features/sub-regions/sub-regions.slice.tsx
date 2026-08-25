import { createSlice } from "@reduxjs/toolkit";
import type { RegionBody } from "@/types/regions";
import { fetchSubRegions } from "./sub-regionsThunk";

interface SubRegionsState {
    subRegions: RegionBody[];
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

export const subRegionsSlice = createSlice({
    name: "sub-regions",
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchSubRegions.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchSubRegions.fulfilled, (state, action) => {
                state.loading = false;
                state.error = null;
                state.subRegions = action.payload?.data?.SubRegion as RegionBody[];
                state.total = action.payload?.data?.meta?.total || 0;
            })
            .addCase(fetchSubRegions.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            })
    }
});
export default subRegionsSlice.reducer;
