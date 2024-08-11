import { configureStore } from "@reduxjs/toolkit";
import boardReducer from "../reducers/boardSlice"
import cardReducer from "../reducers/cardSlice"
import userReduder from "../reducers/userSlice"

export const store = configureStore({
    reducer: {
        board: boardReducer,
        card: cardReducer,
        user: userReduder

    }
})