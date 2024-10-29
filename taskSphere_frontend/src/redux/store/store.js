import { configureStore } from "@reduxjs/toolkit";
import boardReducer from "../reducers/boardSlice"
import cardReducer from "../reducers/cardSlice"
import userReduder from "../reducers/userSlice"
import columnReducer from "../reducers/columnSlice"
import inviteReducer from "../reducers/inviteSlice"
import StreamClientTokenReducer from "../reducers/videoSlice"
import { persistReducer } from 'redux-persist'
import storage from 'redux-persist/lib/storage'

const persistConfig = {
    key: 'root',
    storage
};

const persistedUserReducer = persistReducer(persistConfig, userReduder);



export const store = configureStore({
    reducer: {
        board: boardReducer,
        card: cardReducer,
        user: persistedUserReducer,
        column: columnReducer,
        invitation: inviteReducer,
        clientToken: StreamClientTokenReducer



    }
})