import { configureStore } from "@reduxjs/toolkit";
import boardReducer from "../reducers/boardSlice"
import cardReducer from "../reducers/cardSlice"
import userReduder from "../reducers/userSlice"
import columnReducer from "../reducers/columnSlice"

export const store = configureStore({
    reducer: {
        board: boardReducer,
        card: cardReducer,
        user: userReduder,
        column: columnReducer

    }
})