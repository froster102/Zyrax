import { apiSlice } from "./apiSlice";

const authApiSlice = apiSlice.injectEndpoints({
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
        }),
        forgotPassword: (builder).mutation({
            query: ({ email }) => ({
                url: '/user/auth/forgot-password',
                method: 'POST',
                body: { email }
            })
        }),
        googleSignin: (builder).mutation({
            query: ({ authCode }) => ({
                url: `/user/auth/google?authCode=${authCode}`,
                method: 'POST'
            })
        }),
        resetPassword: (builder).mutation({
            query: ({ token, password }) => ({
                url: '/user/auth/reset-password',
                method: 'POST',
                body: { token, password }
            })
        }),
        logoutUser: builder.mutation({
            query: () => ({
                url: '/user/auth/logout',
                method: 'GET'
            })
        })
    })
})

export const {
    useLogoutUserMutation,
    useSignupMutation,
    useSigninMutation,
    useGoogleSigninMutation,
    useForgotPasswordMutation,
    useResetPasswordMutation,
} = authApiSlice