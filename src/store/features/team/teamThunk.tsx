import { api } from "@/api/client";
import { endpoints } from "@/api/endpoints";
import { createAsyncThunk } from "@reduxjs/toolkit";
import { GetUsersPayload } from "./types";
import { cleanAndTrim } from "@/lib/clean-data";

export const fetchTeam = createAsyncThunk(
    "team/fetchTeam",
    async (params: GetUsersPayload, { rejectWithValue }) => {
        const cleanedParams = cleanAndTrim(params);
        try {
            const response = await api.get(`${endpoints.team.getMembers}?${new URLSearchParams(cleanedParams).toString()}`);
            return response.data;
        } catch (error: any) {
            return rejectWithValue(error?.response?.data || { message: "Something went wrong." });
        }
    }
);