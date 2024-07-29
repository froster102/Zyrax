import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'
import { setUserCredentials, setAdminCredentials, userLogout, adminLogout } from './authSlice.js'


const baseQuery = fetchBaseQuery({
    baseUrl: 'http://localhost:3000/api',
    credentials: 'include',
    prepareHeaders: (headers, { getState }) => {
        const token = getState().auth.token
        if (token) {
            headers.set('authorization', `Bearer ${token}`)
        }
        return headers
    }
})

const baseQueryWithReauth = async (args, api, extraOptions) => {
    try {
        let response = await baseQuery(args, api, extraOptions)
        if (response?.error?.status === 403) {
            console.log('sending refresh token')
            const refreshResponce = await baseQuery('/auth/refresh', api, extraOptions)
            if (refreshResponce?.data) {
                const { role } = api.getState().auth
                if (role === 'user') {
                    api.dispatch(setUserCredentials(...refreshResponce?.data))
                } else {
                    api.dispatch(userLogout())
                }
                if (role === 'admin') {
                    api.dispatch(setAdminCredentials(...refreshResponce?.data))
                } else {
                    api.dispatch(adminLogout())
                }
            }else {
                api.dispatch(userLogout())
                api.dispatch(adminLogout())
            }
        }
        return response
    } catch (e) {
        console.log(e)
    }
}

export const apiSlice = createApi({
    baseQuery: baseQueryWithReauth,
    endpoints: (builder) => ({
        logout: builder.mutation({
            query: () => ({
                url: '/auth/logout',
                method: 'GET'
            })
        })
    })
})


export const { useLogoutMutation } = apiSlice