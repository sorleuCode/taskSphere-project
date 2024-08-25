import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { API_ROOT } from "../../apis";

// Async thunk to create a column
export const createColumn = createAsyncThunk(
  "column/createColumn",
  async (columnData, { rejectWithValue }) => {
    try {
      const response = await API_ROOT.post("/columns/create", columnData, {
        withCredentials: true,
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

// Async thunk to get columns for a specific board
export const getColumns = createAsyncThunk(
  "column/getColumns",
  async (boardId, { rejectWithValue }) => {
    try {
      const response = await API_ROOT.get(`/columns/${boardId}`, {
        withCredentials: true,
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

// Async thunk to update a column
export const updateColumn = createAsyncThunk(
  "column/updateColumn",
  async ({ columnId, updatedData }, { rejectWithValue }) => {
    try {
      const response = await API_ROOT.put(
        `/columns/update/${columnId}`,
        updatedData,
        { withCredentials: true }
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

// Async thunk to delete a column
export const deleteColumn = createAsyncThunk(
  "column/deleteColumn",
  async (columnId, { rejectWithValue }) => {
    try {
      await API_ROOT.delete(`/columns/delete/${columnId}`, {
        withCredentials: true,
      });
      return columnId; // Return the columnId after successful deletion
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

// Initial state for the column slice
const initialState = {
  columns: [],
  column: {},
  loading: false,
  error: null,
  status: false,
};

// Column slice with extra reducers to handle async thunk actions
const columnSlice = createSlice({
  name: "column",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder

      // Handle getColumns actions
      .addCase(getColumns.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.status = false;
      })
      .addCase(getColumns.fulfilled, (state, action) => {
        state.loading = false;
        state.columns = action.payload;
        state.error = null;
        state.status = true;
      })
      .addCase(getColumns.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.status = false;
      })

      // Handle createColumn actions
      .addCase(createColumn.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.status = false;
      })
      .addCase(createColumn.fulfilled, (state, action) => {
        state.loading = false;
        state.column = action.payload;
        state.error = null;
        state.status = true;
        state.columns = [...state.columns, action.payload];
      })
      .addCase(createColumn.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.status = false;
      })

      // Handle updateColumn actions
      .addCase(updateColumn.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.status = false;
      })
      .addCase(updateColumn.fulfilled, (state, action) => {
        state.loading = false;
        state.error = null;
        state.status = true;

        const { columnId } = action.meta.arg;
        state.columns = state.columns.map((column) =>
          column._id === columnId ? action.payload : column
        );
      })
      .addCase(updateColumn.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.status = false;
      })

      // Handle deleteColumn actions
      .addCase(deleteColumn.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteColumn.fulfilled, (state, action) => {
        state.loading = false;
        state.error = null;
        state.columns = state.columns.filter(
          (column) => column._id !== action.payload
        );
      })
      .addCase(deleteColumn.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.status = false;
      });
  },
});

export default columnSlice.reducer;
