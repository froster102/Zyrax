import { apiSlice } from "./apiSlice";


const userApiSlice = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        signin: builder.mutation({
            query: (credentials) => ({
                url: '/user/auth/signin',
                method: 'POST',
                body: credentials
            })
        }),
        signup: (builder).mutation({
            query: (credentials) => ({
                url: '/user/auth/signup',
                method: 'POST',
                body: credentials
            })
        })
    })
})

export const { useSigninMutation, useSignupMutation  } = userApiSlice