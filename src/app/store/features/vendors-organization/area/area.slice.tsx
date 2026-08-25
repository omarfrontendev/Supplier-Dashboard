import { createSlice } from "@reduxjs/toolkit";
import type { AreaBody } from "@/types/area";
import { fetchVendorAreas } from "./areaThunk";

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

export const vendorAreaSlice = createSlice({
    name: "vendorAreaS",
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchVendorAreas.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchVendorAreas.fulfilled, (state, action) => {
                state.loading = false;
                state.error = null;
                state.areas = action.payload?.data?.VendorArea as AreaBody[];
                state.total = action.payload?.data?.meta?.total || 0;
            })
            .addCase(fetchVendorAreas.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload.message as string;
            })
    }
});
export default vendorAreaSlice.reducer;
