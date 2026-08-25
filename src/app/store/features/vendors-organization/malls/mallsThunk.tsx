import { api } from "@/core/api/client";
import { endpoints } from "@/api/endpoints";
import type { ApiError } from "@/types/api";
import type { FetchVendorMallsResponse, GetMallsPayload } from "@/types/malls";
import { cleanAndTrim } from "@/utils/clean-data";
import { createAsyncThunk } from "@reduxjs/toolkit";

export const fetchVendorMalls = createAsyncThunk<
    FetchVendorMallsResponse,
    GetMallsPayload,
    { rejectValue: ApiError }
>(
    "vendorMalls/fetchVendorMalls",
    async (params: GetMallsPayload, { rejectWithValue }) => {
        const cleanedParams = cleanAndTrim(params);
        try {
            const response = await api.get(`${endpoints.childVendors.getMalls}?${new URLSearchParams(cleanedParams).toString()}`);
            return response.data;
        } catch (error: any) {
            return rejectWithValue(error?.response?.data || { message: "Something went wrong." });
        }
    }
);