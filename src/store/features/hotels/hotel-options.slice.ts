import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

import { api } from "@/api/client";
import { endpoints } from "@/api/endpoints";
import { cleanAndTrim } from "@/lib/clean-data";

import {
  GetHotelOptionsParams,
  HotelOptionsResponse,
  HotelOptionsState,
} from "./types";

interface ApiErrorResponse {
  status?: string;
  message?: string;
  data?: {
    errors?: string[];
  };
}

const initialState: HotelOptionsState = {
  hotels: [],
  meta: null,
  loading: false,
  error: null,
};

export const fetchHotelsOptions = createAsyncThunk<
  HotelOptionsResponse,
  GetHotelOptionsParams | undefined,
  { rejectValue: ApiErrorResponse }
>(
  "hotelOptions/fetchHotelOptions",
  async (params, { rejectWithValue }) => {
    try {
      const cleanedParams = cleanAndTrim(params ?? {});

      const response = await api.get<HotelOptionsResponse>(
        endpoints.hotels.getHotelOptions,
        {
          params: cleanedParams,
        },
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

const hotelOptionsSlice = createSlice({
  name: "hotelOptions",

  initialState,

  reducers: {
    clearHotelOptions: (state) => {
      state.hotels = [];
      state.meta = null;
      state.error = null;
    },

    clearHotelOptionsError: (state) => {
      state.error = null;
    },
  },

  extraReducers: (builder) => {
    builder
      .addCase(fetchHotelsOptions.pending, (state) => {
        state.loading = true;
        state.error = null;
      })

      .addCase(fetchHotelsOptions.fulfilled, (state, action) => {
        state.loading = false;
        state.error = null;

        state.hotels = action.payload.data.hotels;
        state.meta = action.payload.data.meta;
      })

      .addCase(fetchHotelsOptions.rejected, (state, action) => {
        state.loading = false;

        state.error =
          action.payload?.message ??
          action.error.message ??
          "Something went wrong.";
      });
  },
});

export const {
  clearHotelOptions,
  clearHotelOptionsError,
} = hotelOptionsSlice.actions;

export default hotelOptionsSlice.reducer;