import { api } from "@/core/api/client";
import { endpoints } from "@/api/endpoints";
import type { ApiError } from "@/types/api";
import type { FetchVendorAreasResponse, GetAreasPayload } from "@/types/area";
import { cleanAndTrim } from "@/utils/clean-data";
import { createAsyncThunk } from "@reduxjs/toolkit";

export const fetchVendorAreas = createAsyncThunk<
    FetchVendorAreasResponse,
    GetAreasPayload,
    { rejectValue: ApiError }
>(
    "vendorAreaSlice/vendorAreaS",
    async (params, { rejectWithValue }) => {
        try {
            const cleanedParams = cleanAndTrim(params);
            const query = new URLSearchParams(cleanedParams).toString();
            const response = await api.get(`${endpoints.childVendors.getAreas}?${query}`);
            return response.data as FetchVendorAreasResponse;
        } catch (error: any) {
            return rejectWithValue(error?.response?.data ?? { message: "Something went wrong." });
        }
    }
);