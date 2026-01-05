import { combineReducers, configureStore } from '@reduxjs/toolkit'
import { persistReducer } from 'redux-persist'
import storage from 'redux-persist/lib/storage'
import persistStore from 'redux-persist/es/persistStore'

// import loadingReducer from './loadPage/loadingSlice'
import userReducer from './user/userSlice'
import vendorReducer from './vendor/vendorSlice'


// Persist only stable auth data; avoid transient fields like error/loading
const userPersistConfig = {
  key: 'user',
  storage,
  version: 1,
  blacklist: ['error', 'loading']
}

const vendorPersistConfig = {
  key: 'vendor',
  storage,
  version: 1,
  blacklist: ['error', 'loading']
}

const rootReducer = combineReducers({
  user: persistReducer(userPersistConfig, userReducer),
  vendor: persistReducer(vendorPersistConfig, vendorReducer)
})

export const store = configureStore({
  reducer: rootReducer,

  middleware: (getDefaultMiddleware)=>
    getDefaultMiddleware({
      serializableCheck : false
    })

})


export const persistor = persistStore(store)