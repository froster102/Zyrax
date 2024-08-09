import { apiSlice } from "./apiSlice";


const userApiSlice = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        signin: builder.mutation({
            query: (credentials) => ({
                url: '/users/auth/signin',
                method: 'POST',
                body: credentials
            })
        }),
        signup: (builder).mutation({
            query: (credentials) => ({
                url: '/users/auth/signup',
                method: 'POST',
                body: credentials
            })
        }),
        getProductsBycategory: builder.query({
            query: ({ category, exclude }) => {
                console.log(category, exclude)
                if (category && exclude) {
                    return `/users/products?category=${category}&exclude=${exclude}`
                }
                return `/users/products?category=${category}`
            }
        }),
        getProductDeatils: builder.query({
            query: (name) => `/users/products/${name}`
        }),
        getProfile: builder.query({
            query: () => '/users/me'
        })
    })
})

export const { useSigninMutation, useSignupMutation, useGetProductsBycategoryQuery, useGetProductDeatilsQuery, useGetProfileQuery } = userApiSlice