import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    currentUser:null,
    error:null,
    loading:null,
};

const userSlice = createSlice({
    name:'user',
    initialState,
    reducers:{
        signInStart:(state)=>{
            state.loading = true
        },
        signInSuccess:(state,action)=>{
            state.currentUser = action.payload;
            state.error = false;
            state.loading = null;
        },
        signInFailure:(state,action)=>{
            state.error = action.payload;
            state.loading = null;

        },
        updateUserStart:(state)=>{
            state.loading = true
        },
        updateUserSuccess:(state,action)=>{
            state.currentUser = action.payload;
            state.error = false;
            state.loading = null;
        },
        updateUserFailure:(state,action)=>{
            state.error = action.payload;
            state.loading = null;

        }
    }
})

export const {signInStart,signInSuccess,signInFailure,updateUserStart,updateUserSuccess,updateUserFailure} = userSlice.actions;

export default userSlice.reducer;