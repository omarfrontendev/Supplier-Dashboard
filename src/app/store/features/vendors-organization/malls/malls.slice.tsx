import { createSlice } from "@reduxjs/toolkit";
import { fetchVendorMalls } from "./mallsThunk";
import type { MallBody } from "@/types/malls";

interface MallState {
    malls: MallBody[];
    loading: boolean;
    error: string | null;
    total: number;
}

const initialState: MallState = {
    malls: [],
    loading: false,
    error: null,
    total: 0,
};

export const vendorMallsSlice = createSlice({
    name: "vendorMalls",
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchVendorMalls.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchVendorMalls.fulfilled, (state, action) => {
                state.loading = false;
                state.error = null;
                state.malls = action.payload?.data?.VendorMall as MallBody[];
                state.total = action.payload?.data?.meta?.total || 0;
            })
            .addCase(fetchVendorMalls.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload.message as string;
            })
    }
});
export default vendorMallsSlice.reducer;
