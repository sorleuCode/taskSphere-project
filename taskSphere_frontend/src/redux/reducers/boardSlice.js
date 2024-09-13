import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { API_ROOT } from "../../apis/index";

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

export const fetchAllboardMembers = createAsyncThunk("board/fetchAllboardMembers", async (_, { rejectWithValue }) => {
    try {
        const response = await API_ROOT.get(`boards/members`, { withCredentials: true });
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

export const updateBoardMemberRole = createAsyncThunk("board/updateBoardMemberRole", async ({ boardId, updatedBoardData }, { rejectWithValue }) => {
    try {
        const response = await API_ROOT.put(`boards/update/role/${boardId}`, updatedBoardData, { withCredentials: true });
        return response.data;
    } catch (error) {
        return rejectWithValue(error.response.data);
    }
});

export const moveCardToDifferentColumns = createAsyncThunk("board/moveCardToDifferentColumns", async (moveCardData, { rejectWithValue }) => {
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
        boardsMembers: [],
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
                state.moveCardStatus = null;

            })
            .addCase(fetchBoards.fulfilled, (state, action) => {
                state.loading = false;
                state.allBoards = action.payload;
                state.error = null;
                state.status = true;
                state.moveCardStatus = null;
            })
            .addCase(fetchBoards.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
                state.status = false;
                state.moveCardStatus = null;
            })

            // createNewBoard
            .addCase(createNewBoard.pending, (state) => {
                state.loading = true;
                state.error = null;
                state.status = false;
                state.moveCardStatus = null;
            })
            .addCase(createNewBoard.fulfilled, (state, action) => {
                state.loading = false;
                state.allBoards.push(action.payload);
                state.error = null;
                state.status = true;
                state.moveCardStatus = null;
            })
            .addCase(createNewBoard.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
                state.status = false;
                state.moveCardStatus = null;
            })

            // fetchSingleBoard
            .addCase(fetchSingleBoard.pending, (state) => {
                state.loading = true;
                state.error = null;
                state.status = false;
                state.moveCardStatus = null;
            })
            .addCase(fetchSingleBoard.fulfilled, (state, action) => {
                state.loading = false;
                state.board = action.payload;
                state.error = null;
                state.status = true;
                state.moveCardStatus = null;
            })
            .addCase(fetchSingleBoard.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
                state.status = false;
                state.moveCardStatus = null;
            })

            // updateBoard
            .addCase(updateBoard.pending, (state) => {
                state.loading = true;
                state.error = null;
                state.status = false;
                state.moveCardStatus = null;
            })
            .addCase(updateBoard.fulfilled, (state, action) => {
                state.loading = false;
                state.error = null;
                state.status = true;
                state.moveCardStatus = null;

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
                state.moveCardStatus = null;
            })

            // moveCardToDifferentColumn
            .addCase(moveCardToDifferentColumns.pending, (state) => {
                state.loading = true;
                state.error = null;
                state.status = false;
                state.moveCardStatus = null;
            })
            .addCase(moveCardToDifferentColumns.fulfilled, (state, action) => {
                state.loading = false;
                state.error = null;
                state.status = true;
                state.moveCardStatus = action.payload

               
            })
            .addCase(moveCardToDifferentColumns.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
                state.status = false;
                state.moveCardStatus = null;
            })

            // fetchAllboardMembers

            .addCase(fetchAllboardMembers.pending, (state) => {
                state.loading = true;
                state.error = null;
                state.status = false;
            })
            .addCase(fetchAllboardMembers.fulfilled, (state, action) => {
                state.loading = false;
                state.error = null;
                state.status = action.payload.success;
                state.boardsMembers = action.payload.users

               
            })
            .addCase(fetchAllboardMembers.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
                state.status = false;
            })

            // updateBoardMemberRole

            .addCase(updateBoardMemberRole.pending, (state) => {
                state.loading = true;
                state.error = null;
                state.status = false;
            })
            .addCase(updateBoardMemberRole.fulfilled, (state, action) => {
                state.loading = false;
                state.error = null;
                state.status = action.payload.status;
               
            })
            .addCase(updateBoardMemberRole.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload.message;
                state.status = false;
            });
    },
});

export default boardSlice.reducer;
