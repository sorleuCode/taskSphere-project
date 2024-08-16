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
        const response = await API_ROOT.post("boards/create", boardData,  {withCredentials: true})
        return response.data
    } catch (error) {
        return rejectWithValue(error.response.data)
    }
} )


export const FetchSingleBoard = createAsyncThunk("board/FetchSingleBoard", async(boardId, {rejectWithValue}) => {
    try {
        const response = await API_ROOT.get(`boards/${boardId}`,  {withCredentials: true})
        return response.data
    } catch (error) {
        return rejectWithValue(error.response.data)
    }
})

export const updateBoard = createAsyncThunk("board/updateBoard", async({boardId, updatedBoardData}, {rejectWithValue}) => {
    try {
        const response = await API_ROOT.put(`boards/update/${boardId}`, updatedBoardData,  {withCredentials: true})
        return response.data
    } catch (error) {
        return rejectWithValue(error.response.data)
    }

})

export const moveCardToDifferentColumn = createAsyncThunk("board/moveCardToDifferentColumn", async(moveCardData, {rejectWithValue}) => {
    try {
        const response = await API_ROOT.put(`boards/moving-card`, moveCardData,  {withCredentials: true})
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
        error: null,
        status: false
    },

    reducers: {},

    extraReducers: (builder) => {

        // fetchBoards

        builder.addCase(fetchBoards.pending, (state) => {
            state.loading = true;
            state.error = null;
            state.status = false

        })

        .addCase(fetchBoards.fulfilled, (state, action) => {
            state.loading = false
            state.allBoards = action.payload;
            state.error = null;
            state.status = true


        })

        .addCase(fetchBoards.rejected, (state, action) => {
            state.loading = false
            state.error = action.payload;
            state.status = false

        });

        // createNewBoard

        builder.addCase(createNewBoard.pending, (state) => {
            state.loading = true;
            state.error = null;
            state.status = false


        })

        .addCase(createNewBoard.fulfilled, (state, action) => {
            state.loading = false
            state.allBoards = [...state.allBoards, action.payload];
            state.error = null;
            state.status = true


        })

        .addCase(createNewBoard.rejected,(state, action) => {
            state.loading = false
            state.error = action.payload
            state.status = false

        });


        // FetchSingleBoard
        builder
        .addCase(FetchSingleBoard.pending, (state) => {
            state.loading = true;
            state.error = null;
            state.status = false

    
            

        })

        .addCase(FetchSingleBoard.fulfilled, (state, action) => {
            state.loading = false
            state.singleBoard = action.payload
            state.error = null;
            state.status = true


        })

        .addCase(FetchSingleBoard.rejected, (state, action) => {
            state.loading = false
            state.error = action.payload
            state.status = false

        })

        // updateBoard
        builder.addCase(updateBoard.pending, (state) => {
            state.loading = true;
            state.error = null;
            state.status = false


        })

        .addCase(updateBoard.fulfilled, (state, action) => {
            state.loading = false;
            state.error = null;
            state.status = true


            const { arg: {id} } = action.meta
            if (id) {
                state.allBoards = state.allBoards.filter((item) => item._id !== id )
                state.allBoards = [...state.allBoards, action.payload]
            }
        })

        .addCase(updateBoard.rejected, (state, action) => {
            state.loading = false
            state.error = action.payload;
            state.error = null;
            state.status = false


        })


        // moveCardToDifferentColumn

        builder.addCase(moveCardToDifferentColumn.pending, (state) => {
            state.loading = true;
            state.error = null;
            state.status = false


        })

        .addCase(moveCardToDifferentColumn.fulfilled, (state, action) => {
            state.loading = false;
            state.error = null;
            state.status = true


            const { arg: {currentCardId} } = action.meta
            if (currentCardId) {
                state.moveCardStatus = action.payload
            }
        })

        .addCase(moveCardToDifferentColumn.rejected, (state, action) => {
            state.loading = false
            state.error = action.payload
            state.status = false

        })


    }

})

export default boardSlice.reducer