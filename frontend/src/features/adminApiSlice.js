import { apiSlice  } from './apiSlice'


const adminApiSlice = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        adminSignin: builder.mutation({
            query: (credentials) => ({
                url: '/admin/auth/signin',
                method: 'POST',
                body: credentials
            })
        })
    })
})

export const { useAdminSigninMutation } = adminApiSlice