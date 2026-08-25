import { createSlice } from "@reduxjs/toolkit";
import { fetchVendors } from "./vendorsThunk";
import type { VendorsState } from "@/types/vendors";

const initialState: VendorsState = {
    vendors: [],
    loading: false,
    error: null,
    total: 0,
};

export const vendorsSlice = createSlice({
    name: "vendors",
    initialState,
    reducers: {
        updateVendorStatus: (state, action: { payload: { id: number; isActive: boolean } }) => {
            const { id, isActive } = action.payload;
            const user = state.vendors.find(u => u.id === id);
            if (user) {
                user.status = isActive ? "active" : "inactive";
            }
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchVendors.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchVendors.fulfilled, (state, action) => {
                state.loading = false;
                state.error = null;
                state.vendors = action.payload?.data?.VendorDetails;
                state.total = action.payload?.data?.meta?.total || 0;
            })
            .addCase(fetchVendors.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload?.message;
            })
    }
});

export const { updateVendorStatus } = vendorsSlice.actions;
export default vendorsSlice.reducer;
