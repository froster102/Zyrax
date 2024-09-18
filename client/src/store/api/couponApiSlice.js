import { apiSlice } from "./apiSlice";

const couponApiSlice = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        getCoupons: builder.query({
            query: () => '/user/coupons'
        }),
        validateCoupon: builder.mutation({
            query: ({ couponCode }) => ({
                url: '/user/coupons/validate',
                method: 'POST',
                body: { couponCode }
            })
        }),
        applyCoupon: builder.mutation({
            query: ({ couponCode }) => ({
                url: '/user/coupons/apply',
                method: 'POST',
                body: { couponCode }
            })
        }),
        removeCoupon: builder.mutation({
            query: ({ couponCode }) => ({
                url: '/user/coupons/remove',
                method: 'DELETE',
                body: { couponCode }
            })
        })
    })
})

export const {
    useGetCouponsQuery,
    useValidateCouponMutation,
    useApplyCouponMutation,
    useRemoveCouponMutation
} = couponApiSlice