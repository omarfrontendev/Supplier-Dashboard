import { api } from "@/core/api/client";
import { endpoints } from "@/api/endpoints";
import type { ApiError } from "@/types/api";
import type { FetchVendorRegionsResponse, GetRegionsPayload } from "@/types/regions";
import { cleanAndTrim } from "@/utils/clean-data";
import { createAsyncThunk } from "@reduxjs/toolkit";

export const fetchVendorRegions = createAsyncThunk<
    FetchVendorRegionsResponse,
    GetRegionsPayload,
    { rejectValue: ApiError }
>(
    "vendorsOfVendors/fetchVendorsOfVendors",
    async (params, { rejectWithValue }) => {
        try {
            const cleanedParams = cleanAndTrim(params);
            const query = new URLSearchParams(cleanedParams).toString();
            const response = await api.get(`${endpoints.childVendors.getRegions}?${query}`);
            return response.data as FetchVendorRegionsResponse;
        } catch (error: any) {
            return rejectWithValue(error?.response?.data ?? { message: "Something went wrong." });
        }
    }
);