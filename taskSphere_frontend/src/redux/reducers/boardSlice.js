import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { API_ROOT } from "../../apis";

export const fetchBoards = createAsyncThunk("board/fetchBoards", async (_, { rejectWithValue }) => {
    try {
        const response = await API_ROOT.get("boards/myboards");
        return response.data;
    } catch (error) {
        return rejectWithValue(error.response.data);
    }
});

export const createNewBoard = createAsyncThunk("board/createNewBoard", async (boardData, { rejectWithValue }) => {
    try {
        const response = await API_ROOT.post("boards/create", boardData, { withCredentials: true });
        return response.data;
    } catch (error) {
        return rejectWithValue(error.response.data);
    }
});

export const fetchSingleBoard = createAsyncThunk("board/fetchSingleBoard", async (boardId, { rejectWithValue }) => {
    try {
        const response = await API_ROOT.get(`boards/${boardId}`, { withCredentials: true });
        return response.data;
    } catch (error) {
        return rejectWithValue(error.response.data);
    }
});

export const updateBoard = createAsyncThunk("board/updateBoard", async ({ boardId, updatedBoardData }, { rejectWithValue }) => {
    try {
        const response = await API_ROOT.put(`boards/update/${boardId}`, updatedBoardData, { withCredentials: true });
        return response.data;
    } catch (error) {
        return rejectWithValue(error.response.data);
    }
});

export const moveCardToDifferentColumn = createAsyncThunk("board/moveCardToDifferentColumn", async (moveCardData, { rejectWithValue }) => {
    try {
        const response = await API_ROOT.put(`boards/moving-card`, moveCardData, { withCredentials: true });
        return response.data;
    } catch (error) {
        return rejectWithValue(error.response.data);
    }
});

const boardSlice = createSlice({
    name: "board",
    initialState: {
        board: {},
        allBoards: [],
        loading: false,
        moveCardStatus: null,
        error: null,
        status: false,
    },
    reducers: {},
    extraReducers: (builder) => {
        builder
            // fetchBoards
            .addCase(fetchBoards.pending, (state) => {
                state.loading = true;
                state.error = null;
                state.status = false;
            })
            .addCase(fetchBoards.fulfilled, (state, action) => {
                state.loading = false;
                state.allBoards = action.payload;
                state.error = null;
                state.status = true;
            })
            .addCase(fetchBoards.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
                state.status = false;
            })

            // createNewBoard
            .addCase(createNewBoard.pending, (state) => {
                state.loading = true;
                state.error = null;
                state.status = false;
            })
            .addCase(createNewBoard.fulfilled, (state, action) => {
                state.loading = false;
                state.allBoards.push(action.payload);
                state.error = null;
                state.status = true;
            })
            .addCase(createNewBoard.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
                state.status = false;
            })

            // fetchSingleBoard
            .addCase(fetchSingleBoard.pending, (state) => {
                state.loading = true;
                state.error = null;
                state.status = false;
            })
            .addCase(fetchSingleBoard.fulfilled, (state, action) => {
                state.loading = false;
                state.board = action.payload;
                state.error = null;
                state.status = true;
            })
            .addCase(fetchSingleBoard.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
                state.status = false;
            })

            // updateBoard
            .addCase(updateBoard.pending, (state) => {
                state.loading = true;
                state.error = null;
                state.status = false;
            })
            .addCase(updateBoard.fulfilled, (state, action) => {
                state.loading = false;
                state.error = null;
                state.status = true;

                const { boardId } = action.meta.arg;
                if (boardId) {
                    state.allBoards = state.allBoards.map((item) =>
                        item._id === boardId ? action.payload : item
                    );
                }
            })
            .addCase(updateBoard.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
                state.status = false;
            })

            // moveCardToDifferentColumn
            .addCase(moveCardToDifferentColumn.pending, (state) => {
                state.loading = true;
                state.error = null;
                state.status = false;
            })
            .addCase(moveCardToDifferentColumn.fulfilled, (state, action) => {
                state.loading = false;
                state.error = null;
                state.status = true;

                const { currentCardId } = action.meta.arg;
                if (currentCardId) {
                    state.moveCardStatus = action.payload;
                }
            })
            .addCase(moveCardToDifferentColumn.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
                state.status = false;
            });
    },
});

export default boardSlice.reducer;
