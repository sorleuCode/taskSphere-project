import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { API_ROOT } from "../../apis/index";

export const inviteBoardMember = createAsyncThunk("invitation/inviteBoardMember", async ({ boardId, inviteData }, { rejectWithValue }) => {
    try {
      const response = await API_ROOT.post(`/api/invitations/board/${boardId}`, inviteData, {withCredentials: true});
      console.log(response.data)
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const inviteAcceptance = createAsyncThunk( "invitation/inviteAcceptance", async ({ invitationId, actionData }, { rejectWithValue }) => {
    try {
      const response = await API_ROOT.post(`/api/invitations/respond/${invitationId}`, actionData, {withCredentials: true});
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

const inviteSlice = createSlice({
  name: "invitation",
  initialState: {
    boardIds: [],
    invitationDetails: {},
    boardId: "",
    cardIds: [],
    cardId: "",
    loading: false,
    inviteSuccess: "",
    inviteError: "",
    inviteAccepted: "",
  },
  extraReducers: (builder) => {
    builder
      // inviteBoardMember
      .addCase(inviteBoardMember.pending, (state) => {
        state.loading = true;
        state.inviteSuccess = "";
        state.inviteError = ""; // Reset inviteError when a new request is pending
      })
      .addCase(inviteBoardMember.fulfilled, (state, action) => {
        state.loading = false;
        state.invitationDetails = action.payload
        state.inviteSuccess = action.payload.message;
      })
      .addCase(inviteBoardMember.rejected, (state, action) => {
        state.loading = false;
        state.inviteError = action.payload.message;
        state.inviteSuccess = "";
      })
      // inviteAcceptance
      .addCase(inviteAcceptance.pending, (state) => {
        state.loading = true;
        state.inviteError = ""; // Reset inviteError when a new request is pending
      })
      .addCase(inviteAcceptance.fulfilled, (state, action) => {
        state.loading = false;
        state.inviteAccepted = action.payload.message;
        state.boardId = action.payload.boardId;
        state.boardIds.push(action.payload.boardId);
      })
      .addCase(inviteAcceptance.rejected, (state, action) => {
        state.loading = false;
        state.inviteError = action.payload.message;
      });
  },
});

export default inviteSlice.reducer;
