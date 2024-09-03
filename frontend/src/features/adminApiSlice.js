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
            query: () => `/admin/users/`
        }),
        blockUser: builder.mutation({
            query: (id) => ({
                url: `/admin/users/${id}/block`,
                method: 'PATCH',
            })
        }),
        unblockUser: builder.mutation({
            query: ({ id }) => ({
                url: `/admin/users/${id}/unblock`,
                method: 'PATCH',
            })
        }),
        fetchProducts: builder.query({
            query: () => '/admin/products'
        }),
        fetchProduct: builder.query({
            query: ({ id }) => `/admin/products/${id}`
        }),
        addProduct: builder.mutation({
            query: (productData) => ({
                url: '/admin/products',
                method: 'POST',
                body: productData
            })
        }),
        editProduct: builder.mutation({
            query: ({ id, productData }) => ({
                url: `/admin/products/${id}`,
                method: 'PUT',
                body: productData
            })
        }),
        blockProduct: builder.mutation({
            query: ({ id }) => ({
                url: `/admin/products/${id}/block`,
                method: 'PATCH',
            })
        }),
        deleteProduct: builder.mutation({
            query: ({ id }) => ({
                url: `/admin/products/${id}`,
                method: 'DELETE',
            })
        }),
        getCategories: builder.query({
            query: () => '/admin/categories'
        }),
        addCategory: builder.mutation({
            query: (data) => ({
                url: '/admin/categories/',
                method: 'POST',
                body: data
            })
        }),
        editCategory: builder.mutation({
            query: ({ id, data }) => {
                console.log(id, data)
                return {
                    url: `/admin/categories/${id}`,
                    method: 'PUT',
                    body: data
                }
            }
        }),
        blockCategory: builder.mutation({
            query: (id) => ({
                url: `/admin/categories/${id}/block`,
                method: 'PATCH',
            })
        }),
        deleteCategory: builder.mutation({
            query: (id) => ({
                url: `/admin/categories/${id}`,
                method: 'DELETE',
            })
        }),
        fetchOrders: builder.query({
            query: () => '/admin/orders'
        }),
        changeOrderStatus: builder.mutation({
            query: ({ orderId, productId, status }) => {
                console.log(productId)
                return {
                    url: `/admin/orders/${orderId}/products/${productId}/status`,
                    method: 'PATCH',
                    body: { status }
                }

            }
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
} = adminApiSlice