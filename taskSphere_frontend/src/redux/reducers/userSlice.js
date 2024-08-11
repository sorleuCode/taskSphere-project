import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import {API_ROOT} from "../../apis/index"



export const registerUser = createAsyncThunk("user/registerUser", async (regData, { rejectWithValue }) => {
    try {
        let response;
        if (regData) {

            response = await API_ROOT.post("/users/register", regData, {withCredentials: true})
            return response.data
        } else {
            response = await API_ROOT.post("/users/register")

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

            response = await API_ROOT.post("/users/login", loginData)
            return response.data
        } else {
            response = await API_ROOT.post("/users/login")

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


export const getUserDetail = createAsyncThunk("user/getUserDetail", async (userId, { rejectWithValue }) => {
    try {
        const response = await API_ROOT.get(`/users/${userId}`);

        return response.data


    } catch (error) {
        return rejectWithValue(error.response.data)

    }
})



export const updateUserDetails = createAsyncThunk("user/updateUserDetails", async ({ updatedData, userId }, { rejectWithValue }) => {

    try {
        const response = await API_ROOT.put(`/users/update/${userId}`, updatedData)
        return response.data
    } catch (error) {

        return rejectWithValue(error.response.data)

    }
})


export const uploadProfilePicture = createAsyncThunk("user/uploadProfilePicture", async ({ imageUrl, userId }, { rejectWithValue }) => {

    try {
        const response = await API_ROOT.put(`/users//uploadProfile/${userId}`, imageUrl)
        return response.data
    } catch (error) {
        return rejectWithValue(error.response.data);

    }
}
)

export const logoutUser = createAsyncThunk("user/logoutUser", async ({ rejectWithValue }) => {
    try {


        const response = await API_ROOT.post("/users/logout");

        return response.data;

    } catch (error) {

        return rejectWithValue(error.response.data);


    }
})




const initialState = {
    userDetail: {},
    loading: false,
    error: null,
    userProfilePic: "",
    message: "", 
    status: null
};

const userSlice = createSlice({
    name: "user",
    initialState,
    reducers: {
        setStatus (state, action) {
            state.status = action.payload
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(registerUser.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(registerUser.fulfilled, (state, action) => {
                state.userDetail = action.payload;
                state.loading = false;

            })
            .addCase(registerUser.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;

            })
            .addCase(loginUser.pending, (state) => {
                state.loading = true;
                state.error = null;

            })
            .addCase(loginUser.fulfilled, (state, action) => {
                state.userDetail = action.payload;
                state.loading = false;

            })
            .addCase(loginUser.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;

            })
            .addCase(verifyUserEmail.pending, (state) => {
                state.loading = true;
                state.error = null;

            })
            .addCase(verifyUserEmail.fulfilled, (state, action) => {
                state.userDetail = action.payload;
                state.loading = false;

            })
            .addCase(verifyUserEmail.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;

            })
            .addCase(updateUserDetails.pending, (state) => {
                state.loading = true;
                state.error = null;

            })
            .addCase(updateUserDetails.fulfilled, (state, action) => {
                state.loading = false;
                state.userDetail = action.payload;

            })
            .addCase(updateUserDetails.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;

            })
            .addCase(getUserDetail.pending, (state) => {
                state.loading = true;
                state.error = null;

            })
            .addCase(getUserDetail.fulfilled, (state, action) => {
                state.loading = false;
                state.userDetail = action.payload;

            })
            .addCase(getUserDetail.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;

            })
            .addCase(uploadProfilePicture.pending, (state) => {
                state.loading = true;
                state.error = null;

            })
            .addCase(uploadProfilePicture.fulfilled, (state, action) => {
                state.loading = false;
                state.userProfilePic = action.payload;

            })
            .addCase(uploadProfilePicture.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;

            })
            .addCase(logoutUser.pending, (state) => {
                state.loading = true;
                state.error = null;


            })
            .addCase(logoutUser.fulfilled, (state, action) => {
                state.loading = false;
                state.message = action.payload;

            })
            .addCase(logoutUser.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;

            });
    },
});
export const {setStatus} = userSlice.actions

export default userSlice.reducer;