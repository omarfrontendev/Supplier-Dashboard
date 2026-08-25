import { createSlice } from "@reduxjs/toolkit";
import { fetchVendorsOfVendors } from "./vendorsThunk";
import type { VendorsState } from "@/types/vendors";

const initialState: VendorsState = {
    vendors: [],
    loading: false,
    error: null,
    total: 0,
};

export const vendorsOfVendorsSlice = createSlice({
    name: "vendorsOfVendors",
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchVendorsOfVendors.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchVendorsOfVendors.fulfilled, (state, action) => {
                state.loading = false;
                state.error = null;
                state.vendors = action.payload?.data?.VendorDetails;
                state.total = action.payload?.data?.meta?.total || 0;
            })
            .addCase(fetchVendorsOfVendors.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload?.message;

            })
    }
});

export default vendorsOfVendorsSlice.reducer;
