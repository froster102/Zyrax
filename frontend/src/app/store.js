import { configureStore } from '@reduxjs/toolkit'
import authSlice from '../features/authSlice'
import { apiSlice } from '../features/apiSlice'
import userSlice from '../features/userSlice'

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