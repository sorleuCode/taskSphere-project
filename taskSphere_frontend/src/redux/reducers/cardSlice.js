import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { API_ROOT } from "../../apis";

export const createNewCard = createAsyncThunk("card/createNewCard", async(cardData, {rejectWithValue}) => {

        try {
            const response =  await API_ROOT.post("/cards/create", cardData);

            return response.data;

        } catch (error) {

            return rejectWithValue(error.response.data)
        }
})

export const updateCard = createAsyncThunk("card/updateCard", async ({cardId, updatedData}, {rejectWithValue}) => {
    try {
        
        const response =  await API_ROOT.put(`/cards/update/${cardId}`, updatedData);

            return response.data;

    } catch (error) {

        return rejectWithValue(error.response.data)
    }
})

export const fetchSingleCard= createAsyncThunk("board/fetchSingleCard", async(cardId, {rejectWithValue}) => {
    try {
        const response = await API_ROOT.get(`cards/${cardId}`)
        return response.data
    } catch (error) {
        return rejectWithValue(error.response.data)
    }
})


const cardSlice = createSlice({
    name: "card",
    initialState: {
        cards: [],
        card: {},
        loading: false,
        error: null
    },

    extraReducers: (builder) => {

        // createCard

        builder.addCase(createNewCard.pending, (state) => {
            state.loading = true;
            state.error = null
        })
        .addCase(createNewCard.fulfilled, (state, action) => {
            state.loading = false;
            state.card = action.payload
            state.cards = state.cards.push(action.payload)
            state.error = null

        })
        .addCase(createNewCard.rejected, (state, action) => {
            state.loading = false;
            state.error = action.payload.message
        })

        // updateCard

        builder.addCase(updateCard.pending, (state) => {
            state.loading = true;
            state.error = null;

        })
        .addCase(updateCard.fulfilled, (state, action) => {
            state.loading = false;
            state.error = null;

            const { arg: {cardId}} = action.meta;
            if(cardId) {
                
                state.cards = state.cards.map((card) => 
                    card._id === cardId ? action.payload : card
                )
            }
        })
        .addCase(updateCard.rejected, (state, action) => {
            state.loading = false;
            state.error = action.payload

        })

        // getSingleCard

        builder.addCase(fetchSingleCard.pending, (state) => {
            state.loading = true;
            state.error = null

        })
        .addCase(fetchSingleCard.fulfilled, (state, action) => {
            state.loading = false;
            state.card = action.payload
        })
        .addCase(fetchSingleCard.rejected, (state, action) => {
            state.loading = false;
            state.error = action.payload.message
        })
    }
})

export default cardSlice.reducer;