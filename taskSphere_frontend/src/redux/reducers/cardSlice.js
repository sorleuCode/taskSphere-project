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

export const fetchSingleCard= createAsyncThunk("card/fetchSingleCard", async(cardId, {rejectWithValue}) => {
    try {
        const response = await API_ROOT.get(`cards/${cardId}`)
        return response.data
    } catch (error) {
        return rejectWithValue(error.response.data)
    }
})
export const fetchAllCards= createAsyncThunk("card/fetchAllCards", async(boardId, {rejectWithValue}) => {
    try {
        const response = await API_ROOT.get(`cards/${boardId}`)
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
        error: "",
        status: false
    },

    reducers: {
        setReoderedCards: (state, action) => {
            state.cards = action.payload;
            state.loading = false;
            state.status = true
            state.error = ""

          },
    },

    extraReducers: (builder) => {

        // createCard

        builder.addCase(createNewCard.pending, (state) => {
            state.loading = true;
            state.error = ""
            state.status = false

        })
        .addCase(createNewCard.fulfilled, (state, action) => {
            state.loading = false;
            state.card = action.payload
            state.error = ""
            state.status = true


        })
        .addCase(createNewCard.rejected, (state, action) => {
            state.loading = false;
            state.error = action.payload
            state.status = false

        })

        // updateCard

        .addCase(updateCard.pending, (state) => {
            state.loading = true;
            state.error = "";
            state.status = false

        })
        .addCase(updateCard.fulfilled, (state, action) => {
            state.loading = false;
            state.error = "";
            state.status = true

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
            state.status = false


        })

        // getSingleCard

        .addCase(fetchSingleCard.pending, (state) => {
            state.loading = true;
            state.error = ""
            state.status = false


        })
        .addCase(fetchSingleCard.fulfilled, (state, action) => {
            state.loading = false;
            state.card = action.payload
            state.status = true
            state.error = "";


        })
        .addCase(fetchSingleCard.rejected, (state, action) => {
            state.loading = false;
            state.error = action.payload
            state.status = false


        })

        // fetchAllCards

        .addCase(fetchAllCards.pending, (state) => {
            state.loading = true;
            state.error = ""
            state.status = false


        })
        .addCase(fetchAllCards.fulfilled, (state, action) => {
            state.loading = false;
            state.cards = action.payload
            state.status = true

        })
        .addCase(fetchAllCards.rejected, (state, action) => {
            state.loading = false;
            state.error = action.payload
            state.status = false

        })
    }
})
export const {setReoderedCards} = cardSlice.actions
export default cardSlice.reducer;