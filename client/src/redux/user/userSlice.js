import { createSlice } from '@reduxjs/toolkit'

const initialState = {
    user: null,
    error: null,
    loading: false
}

const userSlice = createSlice({
    name: 'user',
    initialState,
    reducers: {
        signinStart: (state)=>{
            state.loading = true;
        },
        signinSuccess: (state, action)=>{
            state.user = action.payload;
            state.loading = false;
            state.error = null;
        },
        signinFailure: (state, action)=>{
            state.loading = false;
            state.error = action.payload;
        },

        signOutStart: (state)=>{
            state.loading = true;
        },
        signOutSuccess: (state)=>{
            state.user = null;
            state.loading = false;
            state.error = null;
        },
        signOutFailure: (state, action)=>{
            state.loading = false;
            state.error = action.payload;
        }
    }
})


export const { 
    signinStart, 
    signinSuccess, 
    signinFailure, 
    signOutStart, 
    signOutSuccess, 
    signOutFailure 
} = userSlice.actions;

export default userSlice.reducer;