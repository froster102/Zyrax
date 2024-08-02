import { apiSlice } from './apiSlice'


const adminApiSlice = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        adminSignin: builder.mutation({
            query: (credentials) => ({
                url: '/admin/auth/signin',
                method: 'POST',
                body: credentials
            })
        }),
        fetchUsers: builder.query({
            query: () => ({
                url: '/admin/get-users',
                method: 'GET',
            })
        }),
        fetchProducts: builder.query({
            query: () => ({
                url: '/admin/get-products',
                method: 'GET'
            })
        }),
        blockUser: builder.mutation({
            query: (userId) => ({
                url: '/admin/block-user',
                method: 'POST',
                body: { userId }
            })
        }),
        unblockUser: builder.mutation({
            query: (userId) => ({
                url: '/admin/unblock-user',
                method: 'POST',
                body: { userId }
            })
        }),
    })
})

export const { useAdminSigninMutation, useFetchUsersQuery, useFetchProductsQuery, useBlockUserMutation, useUnblockUserMutation , useLogoutMutation } = adminApiSlice