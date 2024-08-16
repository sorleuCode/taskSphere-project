import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { API_ROOT } from "../../apis";

export const createColumn = createAsyncThunk("column/createColumn", async (columnData, {rejectWithValue}) => {
    try {
        const response =  await API_ROOT.post("/columns/create", columnData);

        return response.data;

    } catch (error) {

        return rejectWithValue(error.response.data)
    }
})


export const constUpdateColumn = createAsyncThunk("column/constUpdateColumn", async({columnId, updatedData}, {rejectWithValue}) => {
    try {
        
        const response =  await API_ROOT.put(`/columns/update/${columnId}`, updatedData);

            return response.data;

    } catch (error) {

        return rejectWithValue(error.response.data)
    }
})


export const deleteColumn = createAsyncThunk("column/deleteColumn", async (columnId, {rejectWithValue}) => {
    try {
        const response = API_ROOT.delete(`/columns/delete/${columnId}`)
        return response.data;

    } catch (error) {
        return rejectWithValue(error.response.data)

    }
})


const initialState = {
    columns: [],
    column: {},
    loading: false,
    error: null

}

const columnSlice = createSlice({
    name: "column",
    initialState,
    reducers: {},
    extraReducers: (builder) => {

        builder
        .addCase(createColumn.pending, (state) => {
            state.loading = true;
            state.error = null;

        })
        .addCase(createColumn.fulfilled, (state, action) => {
            state.loading = false;
            state.column = action.payload;
            state.error = null;
            state.columns = [...state.columns, action.payload];
        })
        .addCase(createColumn.rejected, (state, action) => {

            state.loading = false;
            state.error = action.payload;

        }),



        builder
        .addCase(updateCard.pending, (state) => {

            state.loading = true;
            state.error = null;

        })
        .addCase(updateCard.fulfilled, (state, action) => {

            state.loading = false;
            state.error = null;

            const { arg: {columnId}} = action.meta;
            if(columnId) {
                
                state.columns = state.columns.map((column) => 
                    column._id === columnId ? action.payload : column
                )
            }
        })
        .addCase(updateCard.rejected, (state, action) => {

            state.loading = false;
            state.error = action.payload;

        }),


        builder
        .addCase(deleteColumn.pending, (state) => {

            state.loading = true;
            state.error = null;

        })
        .addCase(deleteColumn.fulfilled, (state, action) => {

            state.loading = false;
            state.error = null;

            const { arg: {columnId}} = action.meta;
            if(columnId) {
                
                state.columns = state.columns.filter((column) => 
                    column._id !== columnId
                )
            }
        })
        .addCase(deleteColumn.rejected, (state, action) => {

            state.loading = false;
            state.error = action.payload;

        })
        
    }
})

export default columnSlice;