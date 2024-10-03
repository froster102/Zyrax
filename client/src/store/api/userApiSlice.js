import { apiSlice } from "./apiSlice";

const userApiSlice = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        getProfile: builder.query({
            query: () => '/user/profile'
        }),
        updateProfile: builder.mutation({
            query: ({ profileData }) => ({
                url: '/user/profile',
                method: 'PUT',
                body: profileData
            })
        }),
        addAddress: builder.mutation({
            query: ({ address }) => ({
                url: '/user/addresses/',
                method: 'POST',
                body: address
            })
        }),
        updateAddress: builder.mutation({
            query: ({ id, address }) => ({
                url: `/user/addresses/${id}`,
                method: 'PUT',
                body: address
            })
        }),
        deleteAddress: builder.mutation({
            query: ({ id }) => ({
                url: `/user/addresses/${id}`,
                method: 'DELETE',
            })
        }),
        getUserWishlistItems: builder.query({
            query: () => '/user/wishlist',
            providesTags: (result) => result ? [{ type: 'Wishlists', id: 'LIST' }] : []
        }),
        addItemsToUserWishlist: builder.mutation({
            query: ({ items = [] }) => ({
                url: '/user/wishlist/items',
                method: 'POST',
                body: { items }
            }),
            invalidatesTags: [{ type: 'Wishlists', id: 'LIST' }]
        }),
        removeItemFromUserWishlist: builder.mutation({
            query: ({ itemId }) => ({
                url: `/user/wishlist/items/${itemId}`,
                method: 'DELETE'
            }),
            invalidatesTags: [{ type: 'Wishlists', id: 'LIST' }]
        }),
        getItemsFromUserCart: builder.query({
            query: () => '/user/cart',
            providesTags: (result) => result ? [{ type: 'CartItems', id: 'LIST' }] : []
        }),
        addItemsToUserCart: builder.mutation({
            query: ({ items }) => ({
                url: '/user/cart/items',
                method: 'POST',
                body: { items }
            }),
            invalidatesTags: [{ type: 'CartItems', id: 'LIST' }]
        }),
        updateUserCartItems: builder.mutation({
            query: ({ itemId, selectedSize, selectedQty, index }) => ({
                url: `/user/cart/items/${itemId}`,
                method: 'PUT',
                body: { selectedQty, selectedSize, index }
            }),
            invalidatesTags: [{ type: 'CartItems', id: 'LIST' }]
        }),
        removeItemFromUserCart: builder.mutation({
            query: ({ itemId, selectedSize }) => ({
                url: `/user/cart/items/${itemId}`,
                method: 'DELETE',
                body: { selectedSize }
            }),
            invalidatesTags: [{ type: 'CartItems', id: 'LIST' }]
        }),
        chekout: builder.mutation({
            query: ({ paymentMethod, shippingAddressId, cardDetails }) => {
                return {
                    url: '/user/checkout',
                    method: 'POST',
                    body: { paymentMethod, shippingAddressId, cardDetails }
                }
            }
        }),
        verifyPayment: builder.mutation({
            query: (paymentDetails) => ({
                url: '/user/payments/verify',
                method: 'POST',
                body: paymentDetails
            })
        }),
        fetchUserOrders: builder.query({
            query: () => '/user/orders',
            providesTags: (result) => result ? [{ type: 'UserOrders', id: 'LIST' }] : []
        }),
        getUserOrderDetails: builder.query({
            query: ({ orderId, productId }) => {
                if (orderId && productId) return `/user/orders/details?orderId=${orderId}&productId=${productId}`
                return `/user/orders/details?orderId=${orderId}`
            },
            providesTags: [{ type: 'OrderDetails', id: 'Details' }]
        }),
        cancelOrder: builder.mutation({
            query: ({ orderId, productId }) => ({
                url: `/user/orders/${orderId}/products/${productId}/cancel`,
                method: 'PATCH',
            }),
            invalidatesTags: [
                { type: 'UserOrders', id: 'LIST' },
                { type: 'OrderDetails', id: 'Details' }
            ],
        }),
        returnOrder: builder.mutation({
            query: ({ orderId, productId, additionalRemarks, reason }) => ({
                url: `/user/orders/${orderId}/products/${productId}/return`,
                method: 'POST',
                body: { additionalRemarks, reason }
            }),
            invalidatesTags: [
                { type: 'UserOrders', id: 'LIST' },
                { type: 'OrderDetails', id: 'Details' }
            ]
        }),
        getWalletDetails: builder.query({
            query: () => '/user/wallet'
        }),
        createWallet: builder.mutation({
            query: () => ({
                url: '/user/wallet',
                method: 'POST'
            })
        }),
        topUpWallet: builder.mutation({
            query: ({ amount }) => ({
                url: '/user/wallet',
                method: 'PUT',
                body: { amount }
            })
        })
    })
})

export const {
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
    useUpdateUserCartItemsMutation,
    useRemoveItemFromUserCartMutation,
    useChekoutMutation,
    useVerifyPaymentMutation,
    useCreateWalletMutation,
    useGetWalletDetailsQuery,
    useTopUpWalletMutation,
    useFetchUserOrdersQuery,
    useGetUserOrderDetailsQuery,
    useCancelOrderMutation,
    useReturnOrderMutation,
} = userApiSlice