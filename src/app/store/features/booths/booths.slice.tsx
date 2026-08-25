import { createSlice } from "@reduxjs/toolkit";
import type { CreateBoothDto } from "@/types/booths";
import { fetchBooths } from "./boothsThunk";

interface BoothState {
    booths: CreateBoothDto[];
    loading: boolean;
    error: string | null;
    total: number;
}

const initialState: BoothState = {
    booths: [],
    loading: false,
    error: null,
    total: 0,
};

export const boothsSlice = createSlice({
    name: "booths",
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchBooths.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchBooths.fulfilled, (state, action) => {
                state.loading = false;
                state.error = null;
                state.booths = action.payload?.data?.Booth as CreateBoothDto[];
                state.total = action.payload?.data?.meta?.total || 0;
            })
            .addCase(fetchBooths.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            })
    }
});
export default boothsSlice.reducer;
