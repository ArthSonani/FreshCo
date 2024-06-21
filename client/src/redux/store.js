import { combineReducers, configureStore } from '@reduxjs/toolkit'
import { persistReducer } from 'redux-persist'
import storage from 'redux-persist/lib/storage'
import persistStore from 'redux-persist/es/persistStore'

// import loadingReducer from './loadPage/loadingSlice'
import userReducer from './user/userSlice'
import vendorReducer from './vendor/vendorSlice'



const rootreducer = combineReducers({
  user: userReducer, 
  vendor: vendorReducer
})

const persistConfig = {
  key: 'root',
  storage,
  version: 1
}
const persistedReducer = persistReducer(persistConfig, rootreducer)

export const store = configureStore({
  reducer: persistedReducer,

  middleware: (getDefaultMiddleware)=>
    getDefaultMiddleware({
      serializableCheck : false
    })

})


export const persistor = persistStore(store)