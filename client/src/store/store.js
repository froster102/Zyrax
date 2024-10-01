import { configureStore } from '@reduxjs/toolkit'
import authSlice from './slices/authSlice'
import { apiSlice } from '../store/api/apiSlice'
import userSlice from './slices/userSlice'

const store = configureStore({
    reducer: {
        auth: authSlice,
        user: userSlice,
        [apiSlice.reducerPath]: apiSlice.reducer,
    },
    middleware: getDefaultMiddleware => getDefaultMiddleware().concat(apiSlice.middleware),
    // devTools : false
}
)


export default store