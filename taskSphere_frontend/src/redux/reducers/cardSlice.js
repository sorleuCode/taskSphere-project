import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { API_ROOT } from "../../apis/index";

export const createNewCard = createAsyncThunk("card/createNewCard", async(cardData, {rejectWithValue}) => {

        try {
            const response =  await API_ROOT.post("/cards/create", cardData);

            return response.data;

        } catch (error) {

            return rejectWithValue(error.response.data)
        }
})

export const updateCard = createAsyncThunk("card/updateCard", async ({cardId, updatedCard}, {rejectWithValue}) => {
    try {
        
        const response =  await API_ROOT.put(`/cards/update/${cardId}`, updatedCard);

            return response.data;

    } catch (error) {

        return rejectWithValue(error.response.data)
    }
})
export const inviteToMeeting = createAsyncThunk("card/inviteToMeeting", async (videoData, {rejectWithValue}) => {
    try {
        
        const response =  await API_ROOT.put(`/cards/meeting-notif`, videoData);

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
export const fetchCardMembers= createAsyncThunk("card/fetchCardMembers", async(cardId, {rejectWithValue}) => {
    try {
        const response = await API_ROOT.get(`cards/members/${cardId}`)
        return response.data
    } catch (error) {
        return rejectWithValue(error.response.data)
    }
})


const cardSlice = createSlice({
    name: "card",
    initialState: {
        cards: [],
        dndOrderedCards: [],
        card: {},
        cardMembers: [],
        loading: false,
        error: "",
        videoInviteStatus: "",
        status: false
    },

    reducers: {
        setReoderedCards: (state, action) => {
           state.dndOrderedCards = action.payload;
           const noneDndCards = state.cards.filter((card) => 
               !state.dndOrderedCards.some((dndCard) => dndCard._id === card._id)
           );
           state.cards = [...state.dndOrderedCards, ...noneDndCards];
           state.loading = false;
           state.status = true;
           state.error = "";
        },

        
    },

    extraReducers: (builder) => {
        // createCard
        builder.addCase(createNewCard.pending, (state) => {
            state.loading = true;
            state.error = "";
            state.status = false;
        })
        .addCase(createNewCard.fulfilled, (state, action) => {
            state.loading = false;
            state.card = action.payload;
            state.error = "";
            state.status = true;
        })
        .addCase(createNewCard.rejected, (state, action) => {
            state.loading = false;
            state.error = action.payload.message;
            state.status = false;
        });

        // updateCard
        builder.addCase(updateCard.pending, (state) => {
            state.loading = true;
            state.error = "";
            state.status = false;
        })
        .addCase(updateCard.fulfilled, (state, action) => {
            state.loading = false;
            state.error = "";
            state.status = true;

            const { arg: { cardId } } = action.meta;
            if (cardId) {
                state.cards = state.cards.map((card) => 
                    card._id === cardId ? action.payload : card
                );
            }
        })
        .addCase(updateCard.rejected, (state, action) => {
            state.loading = false;
            state.error = action.payload.message;
            state.status = false;
        });

        // getSingleCard
        builder.addCase(fetchSingleCard.pending, (state) => {
            state.loading = true;
            state.error = "";
            state.status = false;
        })
        .addCase(fetchSingleCard.fulfilled, (state, action) => {
            state.loading = false;
            state.card = action.payload;
            state.status = true;
            state.error = "";
        })
        .addCase(fetchSingleCard.rejected, (state, action) => {
            state.loading = false;
            state.error = action.payload.message;
            state.status = false;
        });

        // fetchAllCards
        builder.addCase(fetchAllCards.pending, (state) => {
            state.loading = true;
            state.error = "";
            state.status = false;
        })
        .addCase(fetchAllCards.fulfilled, (state, action) => {
            state.loading = false;
            if (state.dndOrderedCards.length > 0) {
                const noneDndCards = action.payload.filter((card) => 
                    !state.dndOrderedCards.some((dndCard) => dndCard._id === card._id)
                );
                state.cards = [...state.dndOrderedCards, ...noneDndCards];
            } else {
                state.cards = action.payload;
            }
            state.status = true;
        })
        .addCase(fetchAllCards.rejected, (state, action) => {
            state.loading = false;
            state.error = action.payload.message;
            state.status = false;
        });
        // fetchCardMembers

        builder.addCase(fetchCardMembers.pending, (state) => {
            state.loading = true;
            state.error = "";
            state.status = false;
        })
        .addCase(fetchCardMembers.fulfilled, (state, action) => {
            state.loading = false;
            state.cardMembers = action.payload.members
            state.status = true;
        })
        .addCase(fetchCardMembers.rejected, (state, action) => {
            state.loading = false;
            state.error = action.payload.message;
            state.status = false;
        });
        // inviteToMeeting

        builder.addCase(inviteToMeeting.pending, (state) => {
            state.loading = true;
            state.error = "";
            state.status = false;
        })
        .addCase(inviteToMeeting.fulfilled, (state, action) => {
            state.loading = false;
            state.videoInviteStatus = action.payload.message
            state.status = true;
        })
        .addCase(inviteToMeeting.rejected, (state, action) => {
            state.loading = false;
            state.error = action.payload.message;
            state.status = false;
        });
    }
});
export const { setReoderedCards } = cardSlice.actions;

export default cardSlice.reducer;
