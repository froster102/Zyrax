import { constructQueryParams } from "@/utils/helper";
import { apiSlice } from "./apiSlice";

const productApiSlice = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        getAllCategories: builder.query({
            query: () => `/products/categories`
        }),
        getProducts: builder.query({
            query: ({ filter, sort }) => {
                const params = { ...filter, sort }
                const query = constructQueryParams(params)
                return `/products?${query}`
            }
        }),
        getProductDeatils: builder.query({
            query: (name) => `/products/${name}`
        }),
    })
})

export const {
    useGetAllCategoriesQuery,
    useGetProductsQuery,
    useGetProductDeatilsQuery
} = productApiSlice