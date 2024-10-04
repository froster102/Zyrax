import { apiSlice } from "./apiSlice";

const couponApiSlice = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        getCoupons: builder.query({
            query: () => '/user/coupons',
            providesTags: (result) => result ? [{ type: 'Coupons', id: 'LIST' }] : []
        }),
        applyCoupon: builder.mutation({
            query: ({ code }) => ({
                url: '/user/coupons/apply',
                method: 'POST',
                body: { code }
            }),
            invalidatesTags: [
                { type: 'Coupons', id: 'LIST' },
                { type: 'CartItems', id: 'LIST' },
            ]
        }),
        removeCoupon: builder.mutation({
            query: () => ({
                url: '/user/coupons/remove',
                method: 'DELETE'
            }),
            invalidatesTags: [
                { type: 'Coupons', id: 'LIST' },
                { type: 'CartItems', id: 'LIST' },
            ]
        })
    })
})

export const {
    useGetCouponsQuery,
    useApplyCouponMutation,
    useRemoveCouponMutation
} = couponApiSlice