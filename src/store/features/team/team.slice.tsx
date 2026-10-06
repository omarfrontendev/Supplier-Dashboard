import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { TeamMember, TeamState } from "./types";
import { fetchTeam } from "./teamThunk";

const initialState: TeamState = {
  team: [],
  loading: false,
  error: null,
  total: 0,
};

export const teamsSlice = createSlice({
  name: "teams",
  initialState,
  reducers: {
    updateMemberStatus: (
      state,
      action: PayloadAction<{
        id: number;
        isActive: boolean;
      }>,
    ) => {
      const { id, isActive } = action.payload;

      const teamMember = state.team.find((member) => member.id === id);

      if (teamMember) {
        teamMember.isActive = isActive;
        teamMember.status = isActive ? "active" : "inactive";
      }
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchTeam.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchTeam.fulfilled, (state, action) => {
        state.loading = false;
        state.error = null;
        state.team = action.payload?.data?.users as TeamMember[];
        state.total = action.payload?.data?.meta?.total || 0;
      })
      .addCase(fetchTeam.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const { updateMemberStatus } = teamsSlice.actions;
export default teamsSlice.reducer;
