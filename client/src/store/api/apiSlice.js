import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'
import { setUserCredentials, userLogout } from '../slices/authSlice'

const baseQuery = fetchBaseQuery({
    baseUrl: import.meta.env.VITE_PRODUCTION_API_URL,
    credentials: 'include',
    prepareHeaders: (headers, { getState },) => {
        const token = getState().auth.user.accessToken
        if (token) headers.set('authorization', `Bearer ${token}`)
        return headers
    }
})

const baseQueryWithReauth = async (args, api, extraOptions) => {
    let response = await baseQuery(args, api, extraOptions)
    if (response?.error?.status === 403) {
        const refreshResponse = await baseQuery('/auth/refresh', api, extraOptions)
        if (refreshResponse?.data) {
            api.dispatch(setUserCredentials({ ...refreshResponse?.data }))
        } else {
            api.dispatch(userLogout())
        }
        response = await baseQuery(args, api, extraOptions)
    } else if (response?.error?.status === 401) {
        api.dispatch(userLogout())
    }
    return response

}

export const apiSlice = createApi({
    baseQuery: baseQueryWithReauth,
    endpoints: () => ({})
})



