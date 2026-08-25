import { api } from "@/core/api/client";
import { endpoints } from "@/api/endpoints";
import type { GetRegionsPayload } from "@/types/regions";
import { cleanAndTrim } from "@/utils/clean-data";
import { createAsyncThunk } from "@reduxjs/toolkit";

export const fetchRegions = createAsyncThunk(
    "regions/fetchRegions",
    async (params: GetRegionsPayload, { rejectWithValue }) => {
        const cleanedParams = cleanAndTrim(params);
        try {
            const response = await api.get(`${endpoints.regions.getRegions}?${new URLSearchParams(cleanedParams).toString()}`);
            return response.data;
        } catch (error: any) {
            return rejectWithValue(error?.response?.data || { message: "Something went wrong." });
        }
    }
);