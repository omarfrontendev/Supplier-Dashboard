import { createSlice } from "@reduxjs/toolkit";
import { fetchVendorShifts } from "./shiftsThunk";
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

export const vendorShiftsSlice = createSlice({
    name: "vendorShifts",
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchVendorShifts.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchVendorShifts.fulfilled, (state, action) => {
                state.loading = false;
                state.error = null;
                state.shifts = action.payload?.data?.VendorShift as ShiftBody[];
                state.total = action.payload?.data?.meta?.total || 0;
            })
            .addCase(fetchVendorShifts.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            })
    }
});
export default vendorShiftsSlice.reducer;
