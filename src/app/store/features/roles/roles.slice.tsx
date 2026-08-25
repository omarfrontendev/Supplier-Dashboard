import { createSlice } from "@reduxjs/toolkit";
import { fetchRoles } from "./rolesThunk";


interface RolesState {
    roles: any[];
    loading: boolean;
    error: string | null;
    total: number;
}

const initialState: RolesState = {
    roles: [],
    loading: false,
    error: null,
    total: 0,
};

export const rolesSlice = createSlice({
    name: "roles",
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchRoles.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchRoles.fulfilled, (state, action) => {
                state.loading = false;
                state.error = null;
                state.roles = action.payload?.data?.profiles as any[];
                state.total = action.payload?.data?.meta?.total || 0;
            })
            .addCase(fetchRoles.rejected, (state, action: any) => {
                state.loading = false;
                state.error = action.payload?.message as string;
            })
    }
});

// export const { updateUserStatus } = usersSlice.actions;
export default rolesSlice.reducer;
