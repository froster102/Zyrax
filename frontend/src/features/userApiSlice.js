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
        getProducts: builder.query({
            query: ({ category, exclude, latest, gender }) => {
                console.log(category, exclude, latest, gender)
                if (latest && category) return `/users/products?latest=${latest}&category=${category}&gender=${gender}`
                if (category && exclude) return `/users/products?category=${category}&exclude=${exclude}&gender=${gender}`
                if (category) return `/users/products?category=${category}&gender=${gender}`
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

export const { useSigninMutation, useSignupMutation, useGetProductsQuery, useGetProductDeatilsQuery, useGetProfileQuery } = userApiSlice