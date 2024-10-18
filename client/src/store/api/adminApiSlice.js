/* eslint-disable no-console */
import { constructQueryParams } from '@/utils/helper'
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
        adminLogout: builder.mutation({
            query: () => ({
                url: 'auth/logout',
                method: 'GET'
            })
        }),
        fetchUsers: builder.query({
            query: () => `/admin/users`,
            providesTags: (result) => result ? [{ type: 'Users', id: 'LIST' }] : []
        }),
        blockUser: builder.mutation({
            query: (id) => ({
                url: `/admin/users/${id}/block`,
                method: 'PATCH',
            }),
            invalidatesTags: [{ type: 'Users', id: 'LIST' }]
        }),
        unblockUser: builder.mutation({
            query: ({ id }) => ({
                url: `/admin/users/${id}/unblock`,
                method: 'PATCH',
            }),
            invalidatesTags: [{ type: 'Users', id: 'LIST' }]
        }),
        fetchProducts: builder.query({
            query: ({ filter, sort }) => {
                const params = { ...filter, sort }
                const query = constructQueryParams(params)
                return `/admin/products?${query}`
            },
            providesTags: (result) => result ? [{ type: 'Products', id: 'LIST' }] : []
        }),
        fetchProduct: builder.query({
            query: ({ id }) => `/admin/products/${id}`,
            providesTags: (result) => result ? [{ type: 'Product', id: 'singleProduct' }] : []
        }),
        addProduct: builder.mutation({
            query: (productData) => ({
                url: '/admin/products',
                method: 'POST',
                body: productData
            }),
            invalidatesTags: [{ type: 'Products', id: 'LIST' }]
        }),
        editProduct: builder.mutation({
            query: ({ id, productData }) => ({
                url: `/admin/products/${id}`,
                method: 'PUT',
                body: productData
            }),
            invalidatesTags: [{ type: 'Products', id: 'LIST' }, { type: 'Product', id: 'singleProduct' }]
        }),
        blockProduct: builder.mutation({
            query: ({ id }) => ({
                url: `/admin/products/${id}/block`,
                method: 'PATCH',
            }),
            invalidatesTags: [{ type: 'Products', id: 'LIST' }]
        }),
        deleteProduct: builder.mutation({
            query: ({ id }) => ({
                url: `/admin/products/${id}`,
                method: 'DELETE',
            }),
            invalidatesTags: [{ type: 'Products', id: 'LIST' }]
        }),
        getCategories: builder.query({
            query: ({ filter }) => {
                const params = { ...filter }
                const query = constructQueryParams(params)
                return `/admin/categories?${query}`
            },
            providesTags: (result) => result ? [{ type: 'Categories', id: 'LIST' }] : []
        }),
        addCategory: builder.mutation({
            query: (data) => ({
                url: '/admin/categories/',
                method: 'POST',
                body: data
            }),
            invalidatesTags: [{ type: 'Categories', id: 'LIST' }]
        }),
        editCategory: builder.mutation({
            query: ({ id, data }) => ({
                url: `/admin/categories/${id}`,
                method: 'PUT',
                body: data
            }),
            invalidatesTags: [{ type: 'Categories', id: 'LIST' }]
        }),
        blockCategory: builder.mutation({
            query: (id) => ({
                url: `/admin/categories/${id}/block`,
                method: 'PATCH',
            }),
            invalidatesTags: [{ type: 'Categories', id: 'LIST' }]
        }),
        deleteCategory: builder.mutation({
            query: (id) => ({
                url: `/admin/categories/${id}`,
                method: 'DELETE',
            }),
            invalidatesTags: [{ type: 'Categories', id: 'LIST' }]
        }),
        fetchOrders: builder.query({
            query: ({ filter }) => {
                const params = { ...filter }
                const query = constructQueryParams(params)
                return `/admin/orders?${query}`
            },
            providesTags: (result) => result ? [{ type: 'Orders', id: 'LIST' }] : []
        }),
        getAllReturns: builder.query({
            query: () => '/admin/returns'
        }),
        approveReturn: builder.mutation({
            query: ({ productId, orderId }) => ({
                url: '/admin/returns/',
                method: 'PUT',
                body: { productId, orderId }
            })
        }),
        changeOrderStatus: builder.mutation({
            query: ({ orderId, itemId, status }) => {
                return {
                    url: `/admin/orders/${orderId}/products/${itemId}/status`,
                    method: 'PATCH',
                    body: { status }
                }
            },
            invalidatesTags: [{ type: 'Orders', id: 'LIST' }]
        }),
        getAllCoupons: builder.query({
            query: () => '/admin/coupons',
            providesTags: (result) => result ? [{ type: 'Coupons', id: 'LIST' }] : []
        }),
        addCoupon: builder.mutation({
            query: ({ code, discount, expirationDate, minPurchaseAmount, maxDiscountAmount }) => ({
                url: '/admin/coupons',
                method: 'POST',
                body: { code, discount, expirationDate, minPurchaseAmount, maxDiscountAmount }
            }),
            invalidatesTags: [{ type: 'Coupons', id: 'LIST' }]
        }),
        deleteCoupon: builder.mutation({
            query: ({ couponId }) => ({
                url: `/admin/coupons/${couponId}`,
                method: 'DELETE'
            }),
            invalidatesTags: [{ type: 'Coupons', id: 'LIST' }]
        }),
        getOffers: builder.query({
            query: ({ offerType = '' }) => {
                if (offerType) return `/admin/offers?offerType=${offerType}`
                else return `/admin/offers`
            },
            providesTags: (result) => result ? [{ type: 'Offers', id: 'LIST' }] : []
        }),
        addOffer: builder.mutation({
            query: ({ name, discountPercentage, startDate, endDate, offerType }) => ({
                url: '/admin/offers',
                method: 'POST',
                body: { name, discountPercentage, startDate, endDate, offerType }
            }),
            invalidatesTags: [{ type: 'Offers', id: 'LIST' }]
        }),
        deleteOffer: builder.mutation({
            query: ({ offerId }) => ({
                url: `/admin/offers/${offerId}`,
                method: 'DELETE',
            }),
            invalidatesTags: [{ type: 'Offers', id: 'LIST' }]
        }),
        getOverviewData: builder.query({
            query: ({ filter, sort, format }) => {
                const params = { ...filter, sort, format }
                const query = constructQueryParams(params)
                return `/admin/analytics/overview?${query}`
            }
        }),
        getAnalyticsGraphData: builder.query({
            query: ({ filter }) => {
                const params = { ...filter }
                const query = constructQueryParams(params)
                return `/admin/analytics/chart?${query}`
            }
        }),
        getSalesReport: builder.query({
            query: ({ filter, format }) => {
                const params = { ...filter, format }
                const query = constructQueryParams(params)
                return {
                    url: `/admin/analytics/downloads/salesReport?${query}`,
                    method: 'GET',
                    responseHandler: (response) => response.blob()
                }
            },

        })
    })
})

export const {
    useAdminSigninMutation,
    useAdminLogoutMutation,
    useFetchUsersQuery,
    useBlockUserMutation,
    useUnblockUserMutation,
    useAddProductMutation,
    useFetchProductQuery,
    useFetchProductsQuery,
    useEditProductMutation,
    useBlockProductMutation,
    useDeleteProductMutation,
    useGetCategoriesQuery,
    useAddCategoryMutation,
    useEditCategoryMutation,
    useBlockCategoryMutation,
    useDeleteCategoryMutation,
    useFetchOrdersQuery,
    useChangeOrderStatusMutation,
    useGetAllReturnsQuery,
    useApproveReturnMutation,
    useGetAllCouponsQuery,
    useAddCouponMutation,
    useDeleteCouponMutation,
    useGetOffersQuery,
    useAddOfferMutation,
    useDeleteOfferMutation,
    useGetOverviewDataQuery,
    useGetAnalyticsGraphDataQuery,
    useLazyGetSalesReportQuery,
} = adminApiSlice