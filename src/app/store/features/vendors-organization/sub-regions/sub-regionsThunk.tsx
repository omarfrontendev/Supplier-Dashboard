import { api } from "@/core/api/client";
import { endpoints } from "@/api/endpoints";
import type { GetSubregionsPayload } from "@/types/sub-regions";
import { cleanAndTrim } from "@/utils/clean-data";
import { createAsyncThunk } from "@reduxjs/toolkit";

export const fetchVendorSubRegions = createAsyncThunk(
    "vendorSubRegions/fetchVendorSubRegions",
    async (params: GetSubregionsPayload, { rejectWithValue }) => {
        const cleanedParams = cleanAndTrim(params);
        try {
            const response = await api.get(`${endpoints.childVendors.getSubRegions}?${new URLSearchParams(cleanedParams).toString()}`);
            return response.data;
        } catch (error: any) {
            return rejectWithValue(error?.response?.data || { message: "Something went wrong." });
        }
    }
);