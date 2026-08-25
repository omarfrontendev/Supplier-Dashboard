import { createSlice } from "@reduxjs/toolkit";
import { fetchVendorUsers } from "./usersThunk";
import type { User } from "@/types/users";

interface UsersState {
    users: User[];
    loading: boolean;
    error: string | null;
    total: number;
}

const initialState: UsersState = {
    users: [],
    loading: false,
    error: null,
    total: 0,
};

export const vendorUsersSlice = createSlice({
    name: "vendorusers",
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchVendorUsers.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchVendorUsers.fulfilled, (state, action) => {
                state.loading = false;
                state.error = null;
                state.users = action.payload?.data?.data as User[];
                state.total = action.payload?.data?.meta?.total || 0;
            })
            .addCase(fetchVendorUsers.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            })
    }
});

export default vendorUsersSlice.reducer;
