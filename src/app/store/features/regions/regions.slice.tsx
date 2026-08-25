import { createSlice } from "@reduxjs/toolkit";
import { fetchRegions } from "./regionsThunk";
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

export const regionsSlice = createSlice({
    name: "regions",
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchRegions.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchRegions.fulfilled, (state, action) => {
                state.loading = false;
                state.error = null;
                state.regions = action.payload?.data?.Region as RegionBody[];
                state.total = action.payload?.data?.meta?.total || 0;
            })
            .addCase(fetchRegions.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            })
    }
});
export default regionsSlice.reducer;
