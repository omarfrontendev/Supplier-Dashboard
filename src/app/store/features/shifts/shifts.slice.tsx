import { createSlice } from "@reduxjs/toolkit";
import { fetchShifts } from "./shiftsThunk";
import type { ShiftBody } from "@/types/shifts";

interface ShiftsState {
    shifts: ShiftBody[];
    loading: boolean;
    error: string | null;
    total: number;
}

const initialState: ShiftsState = {
    shifts: [],
    loading: false,
    error: null,
    total: 0,
};

export const shiftsSlice = createSlice({
    name: "shifts",
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchShifts.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchShifts.fulfilled, (state, action) => {
                state.loading = false;
                state.error = null;
                state.shifts = action.payload?.data?.Shift as ShiftBody[];
                state.total = action.payload?.data?.meta?.total || 0;
            })
            .addCase(fetchShifts.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            })
    }
});
export default shiftsSlice.reducer;
