import { createSlice } from '@reduxjs/toolkit'

const initialState = {
    loading: false
}

const loadingSlice = createSlice({
    name: 'loadPage',
    initialState,
    reducers: {
        startLoading: (state)=>{
            state.loading = true;
        },
        endLoading: (state)=>{
            state.loading = false;
        }
    }
})


export const { 
    startLoading, 
    endLoading
} = loadingSlice.actions;

export default loadingSlice.reducer;