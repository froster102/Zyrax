import { apiSlice } from "./apiSlice";

const couponApiSlice = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        getCoupons: builder.query({
            query: () => '/user/coupons'
        }),
        applyCoupon: builder.mutation({
            query: ({ code }) => ({
                url: '/user/coupons/apply',
                method: 'POST',
                body: { code }
            })
        }),
        removeCoupon: builder.mutation({
            query: () => ({
                url: '/user/coupons/remove',
                method: 'DELETE'
            })
        })
    })
})

export const {
    useGetCouponsQuery,
    useApplyCouponMutation,
    useRemoveCouponMutation
} = couponApiSlice