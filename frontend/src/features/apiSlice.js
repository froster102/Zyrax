import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'
import { setUserCredentials, userLogout } from './authSlice.js'
import { resetCartAndWishlist } from './userSlice.js'

const baseQuery = fetchBaseQuery({
    baseUrl: 'https://1p4tj84j-3000.inc1.devtunnels.ms/api/v1',
    credentials: 'include',
    prepareHeaders: (headers, { getState },) => {
        const token = getState().auth.user.accessToken
        if (token) headers.set('authorization', `Bearer ${token}`)
        return headers
    }
})

const baseQueryWithReauth = async (args, api, extraOptions) => {
    try {
        let response = await baseQuery(args, api, extraOptions)
        if (response?.error?.status === 403) {
            console.log('sending refresh token')
            const refreshResponse = await baseQuery('/auth/refresh', api, extraOptions)
            if (refreshResponse?.data) {
                api.dispatch(setUserCredentials({ ...refreshResponse?.data }))
            } else {
                api.dispatch(userLogout())
            }
            response = await baseQuery(args, api, extraOptions)
        } else if (response?.error?.status === 401) {
            api.dispatch(userLogout())
            api.dispatch(resetCartAndWishlist())
        }
        return response
    } catch (e) {
    }
}

export const apiSlice = createApi({
    baseQuery: baseQueryWithReauth,
    endpoints: (builder) => ({})
})



