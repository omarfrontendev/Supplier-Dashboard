import { api } from "@/core/api/client";
import { endpoints } from "@/api/endpoints";
import type { GetUsersPayload } from "@/types/users";
import { cleanAndTrim } from "@/utils/clean-data";
import { createAsyncThunk } from "@reduxjs/toolkit";

export const fetchUsers = createAsyncThunk(
    "users/fetchUsers",
    async (params: GetUsersPayload, { rejectWithValue }) => {
        const cleanedParams = cleanAndTrim(params);
        try {
            const response = await api.get(`${endpoints.users.getUsers}?${new URLSearchParams(cleanedParams).toString()}`);
            return response.data;
        } catch (error: any) {
            return rejectWithValue(error?.response?.data || { message: "Something went wrong." });
        }
    }
);