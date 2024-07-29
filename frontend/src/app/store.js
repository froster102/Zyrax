import { configureStore } from '@reduxjs/toolkit'
import authSlice from '../features/authSlice'
import { apiSlice } from '../features/apiSlice'

const store = configureStore({
    reducer: {
        auth: authSlice,
        [apiSlice.reducerPath]: apiSlice.reducer,
    },
    middleware: getDefaultMiddleware => getDefaultMiddleware().concat(apiSlice.middleware),
    // devTools : false
}
)


export default store