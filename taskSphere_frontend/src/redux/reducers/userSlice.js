import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import {API_ROOT} from "../../apis/index"



export const registerUser = createAsyncThunk("user/registerUser", async (regData, { rejectWithValue }) => {
    try {
        let response;
        if (regData) {

            response = await API_ROOT.post("/users/register", regData, {withCredentials: true})
            return response.data
        } else {
            response = await API_ROOT.post("/users/registerWithEmail", {withCredentials: true})


            return response.data
        }
    } catch (error) {

        return rejectWithValue(error.response.data)
    }
})



export const loginUser = createAsyncThunk("user/loginUser", async (loginData, { rejectWithValue }) => {

    try {
        let response;
        if (loginData) {

            response = await API_ROOT.post("/users/login", loginData, {withCredentials: true});

            return response.data
        } else {
            response = await API_ROOT.post("/users/loginWithEmail", {withCredentials: true})

            return response.data
        }
    } catch (error) {
        return rejectWithValue(error.response.data)
    }
})


export const verifyUserEmail = createAsyncThunk("user/verifyUserEmail", async (token, { rejectWithValue }) => {

    try {

        const response = await API_ROOT.get(`/users/verifyEmail/${token}`)
        return response.data

    } catch (error) {
        return rejectWithValue(error.response.data)
    }
})


export const getUserDetail = createAsyncThunk("user/getUserDetail", async (_, { rejectWithValue }) => {
    try {
        const response = await API_ROOT.get(`/users/user`,  {withCredentials: true});

        return response.data


    } catch (error) {
        return rejectWithValue(error.response.data)

    }
})



export const updateUserDetails = createAsyncThunk("user/updateUserDetails", async ({ updatedData}, { rejectWithValue }) => {

    try {
        const response = await API_ROOT.put(`/users/update`, updatedData, {withCredentials: true})
        return response.data
    } catch (error) {

        return rejectWithValue(error.response.data)

    }
})


export const uploadProfilePicture = createAsyncThunk("user/uploadProfilePicture", async ({ imageLink }, { rejectWithValue }) => {

    try {
        const response = await API_ROOT.put(`/users/uploadProfile`, imageLink,  {withCredentials: true})
        return response.data
    } catch (error) {
        return rejectWithValue(error.response.data);

    }
}
)

export const logoutUser = createAsyncThunk("user/logoutUser", async (_, { rejectWithValue }) => {
    try {
        const response = await API_ROOT.post("/users/logout", { withCredentials: true });
        return response.data;
    } catch (error) {
        return rejectWithValue(error.response.data);
    }
});




const initialState = {
    user: {},
    loading: false,
    error: null,
    message: "", 
    status: false
};

const userSlice = createSlice({
    name: "user",
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(registerUser.pending, (state) => {
                state.loading = true;
                state.error = null;
                state.status = false
            })
            .addCase(registerUser.fulfilled, (state, action) => {
                state.user = action.payload;
                state.loading = false;
                state.status= true

            })
            .addCase(registerUser.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
                state.status = false

            })
            .addCase(loginUser.pending, (state) => {
                state.loading = true;
                state.error = null;
                state.status = false

            })
            .addCase(loginUser.fulfilled, (state, action) => {
                state.user = action.payload;
                state.loading = false;
                state.status = true

            })
            .addCase(loginUser.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
                state.status = false

            })
            .addCase(verifyUserEmail.pending, (state) => {
                state.loading = true;
                state.error = null;
                state.status = false

            })
            .addCase(verifyUserEmail.fulfilled, (state, action) => {
                state.user = action.payload;
                state.loading = false;
                state.status = true

            })
            .addCase(verifyUserEmail.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
                state.status = false

            })
            .addCase(updateUserDetails.pending, (state) => {
                state.loading = true;
                state.error = null;
                state.status = false

            })
            .addCase(updateUserDetails.fulfilled, (state, action) => {
                state.loading = false;
                state.user = action.payload;
                state.status = true

            })
            .addCase(updateUserDetails.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
                state.status = false

            })
            .addCase(getUserDetail.pending, (state) => {
                state.loading = true;
                state.error = null;
                state.status = false

            })
            .addCase(getUserDetail.fulfilled, (state, action) => {
                state.loading = false;
                state.user = action.payload;
                state.status = true;
            })
            .addCase(getUserDetail.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
                state.status = false

            })
            .addCase(uploadProfilePicture.pending, (state) => {
                state.loading = true;
                state.error = null;
                state.status = false

            })
            .addCase(uploadProfilePicture.fulfilled, (state, action) => {
                state.loading = false;
                state.user = action.payload;
                state.status = true

            })
            .addCase(uploadProfilePicture.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload.message;
                state.status = false

            })
            .addCase(logoutUser.pending, (state) => {
                state.loading = true;
                state.error = null;
                state.status = false


            })
            .addCase(logoutUser.fulfilled, (state, action) => {
                state.loading = false;
                state.user = {};
                state.message = action.payload.message
                state.status = true;
            })
            .addCase(logoutUser.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
                state.status = false

            });
    },
});

export default userSlice.reducer;