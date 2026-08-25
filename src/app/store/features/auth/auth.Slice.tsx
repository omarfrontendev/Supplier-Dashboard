import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import { loginUser } from "./authThunk";

interface User {
  id: string;
  name: string;
  role: string;
  clientId: number
}

interface AuthState {
  user: User | null;
  token: string | null;
  loading: boolean;
  error: string | null;
  clientId: number
}

const storedUser = localStorage.getItem("user");
const parsedUser = storedUser ? JSON.parse(storedUser) : null;

const initialState: AuthState = {
  user: parsedUser,
  token: localStorage.getItem("authToken"),
  loading: false,
  error: null,
  clientId: parsedUser?.clientId ?? null,
};

export const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      // ============= LOGIN ===========
      .addCase(loginUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action: PayloadAction<{
        data: any; user: User; token: string
      }>) => {
        state.loading = false;
        state.user = action.payload?.data?.user;
        state.clientId = action.payload?.data?.user?.clientId;
        state.token = action.payload?.data?.accessToken;
        state.error = null;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

  }
});

export default authSlice.reducer;
