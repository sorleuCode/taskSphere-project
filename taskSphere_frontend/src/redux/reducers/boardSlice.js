import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { API_ROOT } from "../../apis";

export const fetchBoards = createAsyncThunk("board/fetchBoards", async ({rejectWithValue}) => {
    try {
        const response = await API_ROOT.get("boards/myboards")
         return response.data

    } catch (error) {
        return rejectWithValue(error.response.data);
    }
})

export const createNewBoard = createAsyncThunk("board/creatNewBoard", async(boardData, {rejectWithValue}) => {
    try {
        const response = await API_ROOT.post("boards/create", boardData)
        return response.data
    } catch (error) {
        return rejectWithValue(error.response.data)
    }
} )


export const FetchSingleBoard = createAsyncThunk("board/FetchSingleBoard", async(boardId, {rejectWithValue}) => {
    try {
        const response = await API_ROOT.get(`boards/${boardId}`)
        return response.data
    } catch (error) {
        return rejectWithValue(error.response.data)
    }
})

export const updateBoard = createAsyncThunk("board/updateBoard", async({boardId, updatedBoardData}, {rejectWithValue}) => {
    try {
        const response = await API_ROOT.put(`boards/update/${boardId}`, updatedBoardData)
        return response.data
    } catch (error) {
        return rejectWithValue(error.response.data)
    }

})

export const moveCardToDifferentColumn = createAsyncThunk("board/moveCardToDifferentColumn", async(moveCardData, {rejectWithValue}) => {
    try {
        const response = await API_ROOT.put(`boards/moving-card`, moveCardData)
        return response.data
    } catch (error) {
        return rejectWithValue(error.response.data)
    }
})


const boardSlice = createSlice({
    name: "board",
    initialState:{
        singleBoard: {},
        allBoards: [],
        loading: false,
        moveCardStatus: null,
        error: ""
    },

    reducers: {},

    extraReducers: (builder) => {

        // fetchBoards

        builder.addCase(fetchBoards.pending, (state) => {
            state.loading = true;
        })

        .addCase(fetchBoards.fulfilled, (state, action) => {
            state.loading = false
            state.allBoards = action.payload
        })

        .addCase(fetchBoards.rejected, (state, action) => {
            state.loading = false
            state.error = action.payload.message
        });

        // createNewBoard

        builder.addCase(createNewBoard.pending, (state) => {
            state.loading = true;
        })

        .addCase(createNewBoard.fulfilled, (state, action) => {
            state.loading = false
            state.allBoards = [...state.allBoards, action.payload]
        })

        .addCase(createNewBoard.rejected,(state, action) => {
            state.loading = false
            state.error = action.payload.message
        });


        // FetchSingleBoard
        builder
        .addCase(FetchSingleBoard.pending, (state) => {
            state.loading = true;
        })

        .addCase(FetchSingleBoard.fulfilled, (state, action) => {
            state.loading = false
            state.singleBoard = action.payload
        })

        .addCase(FetchSingleBoard.rejected, (state, action) => {
            state.loading = false
            state.error = action.payload.message
        })

        // updateBoard
        builder.addCase(updateBoard.pending, (state) => {
            state.loading = true;
        })

        .addCase(updateBoard.fulfilled, (state, action) => {
            state.loading = false
            const { arg: {id} } = action.meta
            if (id) {
                state.allBoards = state.allBoards.filter((item) => item._id !== id )
                state.allBoards = [...state.allBoards, action.payload]
            }
        })

        .addCase(updateBoard.rejected, (state, action) => {
            state.loading = false
            state.error = action.payload.message
        })


        // moveCardToDifferentColumn

        builder.addCase(moveCardToDifferentColumn.pending, (state) => {
            state.loading = true;
        })

        .addCase(moveCardToDifferentColumn.fulfilled, (state, action) => {
            state.loading = false
            const { arg: {currentCardId} } = action.meta
            if (currentCardId) {
                state.moveCardStatus = action.payload
            }
        })

        .addCase(moveCardToDifferentColumn.rejected, (state, action) => {
            state.loading = false
            state.error = action.payload.message
        })


    }

})

export default boardSlice.reducer