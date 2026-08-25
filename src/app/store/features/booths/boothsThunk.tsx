import { api } from "@/core/api/client";
import { endpoints } from "@/api/endpoints";
import type { GetBoothsPayload } from "@/types/booths";
import { cleanAndTrim } from "@/utils/clean-data";
import { createAsyncThunk } from "@reduxjs/toolkit";

export const fetchBooths = createAsyncThunk(
    "booths/fetchBooths",
    async (params: GetBoothsPayload, { rejectWithValue }) => {
        const cleanedParams = cleanAndTrim(params);
        try {
            const response = await api.get(`${endpoints.booths.getBooths}?${new URLSearchParams(cleanedParams).toString()}`);
            return response.data;
        } catch (error: any) {
            return rejectWithValue(error?.response?.data || { message: "Something went wrong." });
        }
    }
);