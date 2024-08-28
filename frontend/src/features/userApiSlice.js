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
        forgotPassword: (builder).mutation({
            query: ({ email }) => ({
                url: '/users/auth/forgot-password',
                method: 'POST',
                body: { email }
            })
        }),
        resetPassword: (builder).mutation({
            query: ({ token, password }) => ({
                url: '/users/auth/reset-password',
                method: 'POST',
                body: { token, password }
            })
        }),
        getAllCategories: builder.query({
            query: () => `/users/categories`
        }),
        getProducts: builder.query({
            query: ({ category, exclude, latest, gender }) => {
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
        }),
        getUserWishlistItems: builder.query({
            query: () => '/users/wishlist'
        }),
        addItemsToUserWishlist: builder.mutation({
            query: ({ items }) => ({
                url: '/users/wishlist',
                method: 'POST',
                body: { items }
            })
        }),
        removeItemFromUserWishlist: builder.mutation({
            query: ({ item }) => ({
                url: '/users/wishlist',
                method: 'DELETE',
                body: { item }
            })
        }),
        getItemsFromUserCart: builder.query({
            query: () => '/users/cart'
        }),
        addItemsToUserCart: builder.mutation({
            query: ({ items }) => ({
                url: '/users/cart',
                method: 'POST',
                body: { items }
            })
        }),
        removeItemFromUserCart: builder.mutation({
            query: ({ productId }) => ({
                url: '/users/cart',
                method: 'DELETE',
                body: { productId }
            })
        }),
        logoutUser: builder.mutation({
            query: () => ({
                url: '/auth/logout',
                method: 'GET'
            })
        })
    })
})

export const {
    useSigninMutation,
    useSignupMutation,
    useLogoutUserMutation,
    useForgotPasswordMutation,
    useResetPasswordMutation,
    useGetAllCategoriesQuery,
    useGetProductsQuery,
    useGetProductDeatilsQuery,
    useGetProfileQuery,
    useGetUserWishlistItemsQuery,
    useAddItemsToUserWishlistMutation,
    useRemoveItemFromUserWishlistMutation,
    useGetItemsFromUserCartQuery,
    useAddItemsToUserCartMutation,
    useRemoveItemFromUserCartMutation
} = userApiSlice