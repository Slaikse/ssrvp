import { configureStore } from '@reduxjs/toolkit'
import counterReducer from './counterSlice'
import authReducer from './authSlice'
import feedbackReducer from './feedbackSlice'
import { apiSlice } from './apiSlice'

const store = configureStore({
  reducer: {
    counter: counterReducer,
    auth: authReducer,
    feedback: feedbackReducer,
    [apiSlice.reducerPath]: apiSlice.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(apiSlice.middleware),
})

export default store
