import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'
import { setUserCredentials, setAdminCredentials, userLogout, adminLogout } from './authSlice.js'


const baseQuery = fetchBaseQuery({
    baseUrl: 'http://localhost:3000/api',
    credentials: 'include',
    prepareHeaders: (headers, { getState },) => {
        const state = getState()
        const { role } = getState().auth
        let token = ''
        if (role === 'user') {
            token = state.auth.user?.token
        } else if (role === 'admin') {
            token = state.auth.admin?.token
        }
        if (token) headers.set('authorization', `Bearer ${token}`)
        return headers
    }
})

const baseQueryWithReauth = async (args, api, extraOptions) => {
    try {
        let response = await baseQuery(args, api, extraOptions)
        if (response?.error?.status === 403) {
            console.log('sending refresh token')
            const { role } = api.getState().auth
            if (role === 'user') {
                const refreshResponce = await baseQuery('/user/auth/refresh', api, extraOptions)
                if (refreshResponce?.data) {
                    console.log('user')
                    api.dispatch(setUserCredentials(...refreshResponce?.data))
                } else {
                    api.dispatch(userLogout())
                }
            } else if (role === 'admin') {
                const refreshResponce = await baseQuery('/admin/auth/refresh', api, extraOptions)
                if (refreshResponce?.data) {
                    const { accessToken: token, role } = refreshResponce?.data
                    console.log(refreshResponce)
                    api.dispatch(setAdminCredentials({ token, role }))
                } else {
                    api.dispatch(adminLogout())
                }
            }
            response = await baseQuery(args, api, extraOptions)
        }
        return response
    } catch (e) {
        console.log(e)
    }
}

export const apiSlice = createApi({
    baseQuery: baseQueryWithReauth,
    endpoints: (builder) => ({})
})


