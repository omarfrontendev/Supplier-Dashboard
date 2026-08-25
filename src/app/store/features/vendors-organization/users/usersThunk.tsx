import { api } from "@/core/api/client";
import { endpoints } from "@/api/endpoints";
import type { GetUsersPayload } from "@/types/users";
import { cleanAndTrim } from "@/utils/clean-data";
import { createAsyncThunk } from "@reduxjs/toolkit";

export const fetchVendorUsers = createAsyncThunk(
  "vendorUsers/fetchVendorUsers",
  async (params: GetUsersPayload, { rejectWithValue }) => {
    const cleanedParams = cleanAndTrim(params);

    try {
      const searchParams = new URLSearchParams();

      Object.entries(cleanedParams).forEach(([key, value]) => {
        if (Array.isArray(value)) {
          value.forEach((v) => searchParams.append(key, v));
        } else if (value !== null && value !== undefined) {
          searchParams.append(key, String(value));
        }
      });

      const response = await api.get(
        `${endpoints.childVendors.getUsers}?${searchParams.toString()}`
      );

      return response.data;
    } catch (error: any) {
      return rejectWithValue(
        error?.response?.data || { message: "Something went wrong." }
      );
    }
  }
);