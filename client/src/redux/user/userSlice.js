import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  loading: false,
  error: null,
  user: null, 
}

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    userSigninStart(state) {
      state.loading = true
      state.error = null
    },
    userSigninSuccess(state, action) {
      state.loading = false
      state.user = action.payload
    },
    userSigninFailure(state, action) {
      state.loading = false
      state.error = action.payload
    },

    userSignoutStart: (state)=>{
        state.loading = true;
    },
    userSignoutSuccess: (state)=>{
        state.user = null;
        state.loading = false;
        state.error = null;
    },
    userSignoutFailure: (state, action)=>{
        state.loading = false;
        state.error = action.payload;
    }
  },
})


export const { 
    userSigninStart, 
    userSigninSuccess, 
    userSigninFailure, 
    userSignoutStart, 
    userSignoutSuccess, 
    userSignoutFailure 
} = userSlice.actions

export default userSlice.reducer