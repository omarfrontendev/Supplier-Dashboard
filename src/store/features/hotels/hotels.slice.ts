import { api } from "@/api/client";
import { endpoints } from "@/api/endpoints";
import { cleanAndTrim } from "@/lib/clean-data";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

import {
  GetHotelsPayload,
  HotelsResponse,
  HotelsState,
} from "./types";

interface ApiErrorResponse {
  status?: string;
  message?: string;
  data?: {
    errors?: string[];
  };
}

const initialState: HotelsState = {
  hotels: [],
  meta: null,
  emptyState: null,
  loading: false,
  error: null,
};

export const fetchHotels = createAsyncThunk<
  HotelsResponse,
  GetHotelsPayload,
  { rejectValue: ApiErrorResponse }
>(
  "hotels/fetchHotels",
  async (params, { rejectWithValue }) => {
    try {
      const cleanedParams = cleanAndTrim(params);

      const queryString = new URLSearchParams(
        cleanedParams as Record<string, string>,
      ).toString();

      const response = await api.get<HotelsResponse>(
        `${endpoints.hotels.getHotels}?${queryString}`,
      );

      return response.data;
    } catch (error: unknown) {
      if (
        error &&
        typeof error === "object" &&
        "response" in error
      ) {
        const axiosError = error as {
          response?: {
            data?: ApiErrorResponse;
          };
        };

        return rejectWithValue(
          axiosError.response?.data ?? {
            message: "Something went wrong.",
          },
        );
      }

      return rejectWithValue({
        message: "Something went wrong.",
      });
    }
  },
);

const hotelsSlice = createSlice({
  name: "hotels",

  initialState,

  reducers: {
    clearHotels: (state) => {
      state.hotels = [];
      state.meta = null;
      state.emptyState = null;
      state.error = null;
    },

    clearHotelsError: (state) => {
      state.error = null;
    },
  },

  extraReducers: (builder) => {
    builder
      .addCase(fetchHotels.pending, (state) => {
        state.loading = true;
        state.error = null;
      })

      .addCase(fetchHotels.fulfilled, (state, action) => {
        state.loading = false;
        state.error = null;

        state.hotels = action.payload.data.hotels;
        state.meta = action.payload.data.meta;
        state.emptyState = action.payload.data.emptyState;
      })

      .addCase(fetchHotels.rejected, (state, action) => {
        state.loading = false;

        state.error =
          action.payload?.message ??
          action.error.message ??
          "Something went wrong.";
      });
  },
});

export const {
  clearHotels,
  clearHotelsError,
} = hotelsSlice.actions;

export default hotelsSlice.reducer;