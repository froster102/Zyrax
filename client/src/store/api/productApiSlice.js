import { apiSlice } from "./apiSlice";

const productApiSlice = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        getAllCategories: builder.query({
            query: () => `/user/products/categories`
        }),
        getProducts: builder.query({
            query: ({ category, exclude, latest, gender, sort }) => {
                if (latest && category) return `/user/products?latest=${latest}&category=${category}&gender=${gender}`
                if (category && exclude) return `/user/products?category=${category}&exclude=${exclude}&gender=${gender}`
                if (sort) return `/user/products?category=${category}&gender=${gender}&sort=${sort}`
                if (category) return `/user/products?category=${category}&gender=${gender}`
            }
        }),
        getProductDeatils: builder.query({
            query: (name) => `/user/products/${name}`
        }),
    })
})

export const {
    useGetAllCategoriesQuery,
    useGetProductsQuery,
    useGetProductDeatilsQuery
} = productApiSlice