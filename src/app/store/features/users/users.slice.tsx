import { createSlice } from "@reduxjs/toolkit";
import { fetchUsers } from "./usersThunk";
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

export const usersSlice = createSlice({
    name: "users",
    initialState,
    reducers: {
        updateUserStatus: (state, action: { payload: { id: number; isActive: boolean } }) => {
            const { id, isActive } = action.payload;
            const user = state.users.find(u => u.id === id);
            if (user) {
                user.isActive = isActive;
            }
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchUsers.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchUsers.fulfilled, (state, action) => {
                state.loading = false;
                state.error = null;
                state.users = action.payload?.data?.users as User[];
                state.total = action.payload?.data?.meta?.total || 0;
            })
            .addCase(fetchUsers.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
                console.log("ERROR: ", action.payload)
            })
    }
});

export const { updateUserStatus } = usersSlice.actions;
export default usersSlice.reducer;
