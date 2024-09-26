import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { API_ROOT } from "../../apis/index";

export const getClientToken = createAsyncThunk("clientToken/getClientToken", async (cardId, { rejectWithValue }) => {
    try {
      const response = await API_ROOT.get(`/api/video/getToken/${cardId}`, {withCredentials: true});
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);



const StreamClientTokenSlice = createSlice({
  name: "clientToken",
  initialState: {
    token: "",
    errorMessage: "",
    loading: false
  },
  extraReducers: (builder) => {
    builder
      // getClientToken
      .addCase(getClientToken.pending, (state) => {
        state.loading = true;
        state.errorMessage = "";
        state.token = ""; 
      })
      .addCase(getClientToken.fulfilled, (state, action) => {
        state.loading = false;
        state.token = action.payload.token
        state.errorMessage = "";
      })
      .addCase(getClientToken.rejected, (state, action) => {
        state.loading = false;
        state.errorMessage = action.payload.message;
      })
  },
});

export default StreamClientTokenSlice.reducer;
