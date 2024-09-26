import { configureStore } from "@reduxjs/toolkit";
import boardReducer from "../reducers/boardSlice"
import cardReducer from "../reducers/cardSlice"
import userReduder from "../reducers/userSlice"
import columnReducer from "../reducers/columnSlice"
import inviteReducer from "../reducers/inviteSlice"
import StreamClientTokenReducer from "../reducers/videoSlice"

export const store = configureStore({
    reducer: {
        board: boardReducer,
        card: cardReducer,
        user: userReduder,
        column: columnReducer,
        invitation: inviteReducer,
        clientToken: StreamClientTokenReducer



    }
})