import { createSlice } from "@reduxjs/toolkit";
import type { BoothBoody } from "@/types/booths";
import { fetchVendorBooths } from "./boothsThunk";

interface BoothState {
    booths: BoothBoody[];
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

export const vendorBoothsSlice = createSlice({
    name: "vendorBooths",
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchVendorBooths.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchVendorBooths.fulfilled, (state, action) => {
                state.loading = false;
                state.error = null;
                state.booths = action.payload?.data?.VendorBooth as BoothBoody[];
                state.total = action.payload?.data?.meta?.total || 0;
            })
            .addCase(fetchVendorBooths.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            })
    }
});

export default vendorBoothsSlice.reducer;
