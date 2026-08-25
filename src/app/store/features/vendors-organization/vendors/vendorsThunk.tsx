import { api } from "@/core/api/client";
import { endpoints } from "@/api/endpoints";
import type { ApiError } from "@/types/api";
import type { FetchVendorsResponse, GetVendorPayload } from "@/types/vendors";
import { cleanAndTrim } from "@/utils/clean-data";
import { createAsyncThunk } from "@reduxjs/toolkit";

export const fetchVendorsOfVendors = createAsyncThunk<
  FetchVendorsResponse,
  GetVendorPayload,
  { rejectValue: ApiError }
>(
  "vendorsOfVendors/fetchVendorsOfVendors",
  async (params, { rejectWithValue }) => {
    try {
      const cleanedParams = cleanAndTrim(params);
      const query = new URLSearchParams(cleanedParams).toString();
      const response = await api.get(`${endpoints.childVendors.getVendors}?${query}`);
      return response.data as FetchVendorsResponse;
    } catch (error: any) {
      return rejectWithValue(error?.response?.data ?? { message: "Something went wrong." });
    }
  }
);