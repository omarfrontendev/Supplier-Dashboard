import { createSlice } from "@reduxjs/toolkit";
import { fetchAreas } from "./areaThunk";
import type { AreaBody } from "@/types/area";

interface AreaState {
    areas: AreaBody[];
    loading: boolean;
    error: string | null;
    total: number;
}

const initialState: AreaState = {
    areas: [],
    loading: false,
    error: null,
    total: 0,
};

export const areaSlice = createSlice({
    name: "area",
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchAreas.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchAreas.fulfilled, (state, action) => {
                state.loading = false;
                state.error = null;
                // console.log("Fetched Areas:", action.payload);
                state.areas = action.payload?.data?.Area as AreaBody[];
                state.total = action.payload?.data?.meta?.total || 0;
            })
            .addCase(fetchAreas.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            })
    }
});
export default areaSlice.reducer;
