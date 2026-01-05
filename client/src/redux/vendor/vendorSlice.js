import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  loading: false,
  error: null,
  vendor: null, 
}

const vendorSlice = createSlice({
  name: 'vendor',
  initialState,
  reducers: {
    clearVendorError(state) {
      state.error = null
    },
    vendorSigninStart(state) {
      state.loading = true
      state.error = null
    },
    vendorSigninSuccess(state, action) {
      state.loading = false
      state.vendor = action.payload
    },
    vendorSigninFailure(state, action) {
      state.loading = false
      state.error = action.payload
    },

    vendorSignoutStart: (state)=>{
        state.loading = true;
    },
    vendorSignoutSuccess: (state)=>{
        state.vendor = null;
        state.loading = false;
        state.error = null;
    },
    vendorSignoutFailure: (state, action)=>{
        state.loading = false;
        state.error = action.payload;
    }
  },
})


export const { 
  clearVendorError,
    vendorSigninStart, 
    vendorSigninSuccess, 
    vendorSigninFailure, 
    vendorSignoutStart, 
    vendorSignoutSuccess, 
    vendorSignoutFailure 
} = vendorSlice.actions

export default vendorSlice.reducer