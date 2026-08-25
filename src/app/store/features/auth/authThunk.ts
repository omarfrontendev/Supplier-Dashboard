import { createAsyncThunk } from "@reduxjs/toolkit";
import { endpoints } from "@/api/endpoints";
import { api } from "@/core/api/client";
import i18n from "@/app/i18n";
import { setToken } from "@/core/auth/token";

interface LoginData {
  email: string;
  password: string;
}

export const checkEmailState = createAsyncThunk(
  "auth/checkEmailState",
  async ({ email }: any, { rejectWithValue }) => {
    try {
      const response = await api.post(endpoints.auth.checkEmailState, { email });
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || i18n.t("login.loginFailed"));
    }
  }
);

export const requestOTP = createAsyncThunk(
  "auth/requestOTP",
  async (email: string, { rejectWithValue }) => {
    try {
      const response = await api.post(endpoints.auth.requestOTp, { email });
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || i18n.t("login.loginFailed"));
    }
  }
);

export const verfiyOTP = createAsyncThunk(
  "auth/verfiyOTP",
  async ({ code, email }: any, { rejectWithValue }) => {
    try {
      const response = await api.post(endpoints.auth.verfiyOTp, { code, email });
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || i18n.t("login.loginFailed"));
    }
  }
);

export const loginUser = createAsyncThunk(
  "auth/loginUser",
  async ({ email, password }: LoginData, { rejectWithValue }) => {
    try {
      const response = await api.post(endpoints.auth.login, { email, password });
      setToken(response.data.data.accessToken);
      localStorage.setItem("user", JSON.stringify(response.data.data.user));
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || i18n.t("login.loginFailed"));
    }
  }
);