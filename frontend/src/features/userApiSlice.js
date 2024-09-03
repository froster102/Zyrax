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
            query: ({ category, exclude, latest, gender, sort }) => {
                if (latest && category) return `/users/products?latest=${latest}&category=${category}&gender=${gender}`
                if (category && exclude) return `/users/products?category=${category}&exclude=${exclude}&gender=${gender}`
                if (sort) return `users/products?category=${category}&gender=${gender}&sort=${sort}`
                if (category) return `/users/products?category=${category}&gender=${gender}`
            }
        }),
        getProductDeatils: builder.query({
            query: (name) => `/users/products/${name}`
        }),
        getProfile: builder.query({
            query: () => '/users/profile'
        }),
        updateProfile: builder.mutation({
            query: ({ profileData }) => ({
                url: '/users/profile',
                method: 'PUT',
                body: profileData
            })
        }),
        addAddress: builder.mutation({
            query: ({ address }) => ({
                url: '/users/addresses/',
                method: 'POST',
                body: address
            })
        }),
        updateAddress: builder.mutation({
            query: ({ id, address }) => ({
                url: `/users/addresses/${id}`,
                method: 'PUT',
                body: address
            })
        }),
        deleteAddress: builder.mutation({
            query: ({ id }) => ({
                url: `/users/addresses/${id}`,
                method: 'DELETE',
            })
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
            query: ({ itemId }) => ({
                url: `/users/wishlist/${itemId}`,
                method: 'DELETE'
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
            query: ({ itemId }) => ({
                url: `/users/cart/${itemId}`,
                method: 'DELETE'
            })
        }),
        fetchUserOrders: builder.query({
            query: () => '/users/orders'
        }),
        chekout: builder.mutation({
            query: ({ cartItems, paymentMethod, shippingAddressId }) => ({
                url: '/users/checkout',
                method: 'POST',
                body: { cartItems, paymentMethod, shippingAddressId }
            })
        }),
        cancelOrder: builder.mutation({
            query: ({ orderId, productId }) => ({
                url: `/users/orders/${orderId}/products/${productId}/cancel`,
                method : 'PATCH',
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
    useUpdateProfileMutation,
    useAddAddressMutation,
    useUpdateAddressMutation,
    useDeleteAddressMutation,
    useGetUserWishlistItemsQuery,
    useAddItemsToUserWishlistMutation,
    useRemoveItemFromUserWishlistMutation,
    useGetItemsFromUserCartQuery,
    useAddItemsToUserCartMutation,
    useRemoveItemFromUserCartMutation,
    useChekoutMutation,
    useCancelOrderMutation,
    useFetchUserOrdersQuery
} = userApiSlice