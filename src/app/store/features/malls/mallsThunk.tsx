import { api } from "@/core/api/client";
import { endpoints } from "@/api/endpoints";
import type { GetMallsPayload } from "@/types/malls";
import { cleanAndTrim } from "@/utils/clean-data";
import { createAsyncThunk } from "@reduxjs/toolkit";

export const fetchMalls = createAsyncThunk(
    "malls/fetchMalls",
    async (params: GetMallsPayload, { rejectWithValue }) => {
        const cleanedParams = cleanAndTrim(params);
        try {
            const response = await api.get(`${endpoints.malls.getMalls}?${new URLSearchParams(cleanedParams).toString()}`);
            return response.data;
        } catch (error: any) {
            return rejectWithValue(error?.response?.data || { message: "Something went wrong." });
        }
    }
);