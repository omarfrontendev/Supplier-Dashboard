import { createSlice } from "@reduxjs/toolkit";
import { fetchMalls } from "./mallsThunk";
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

export const mallsSlice = createSlice({
    name: "malls",
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchMalls.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchMalls.fulfilled, (state, action) => {
                state.loading = false;
                state.error = null;
                state.malls = action.payload?.data?.Mall as MallBody[];
                state.total = action.payload?.data?.meta?.total || 0;
            })
            .addCase(fetchMalls.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            })
    }
});
export default mallsSlice.reducer;
