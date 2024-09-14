import { apiSlice } from "./apiSlice";

const productApiSlice = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        getAllCategories: builder.query({
            query: () => `/products/categories`
        }),
        getProducts: builder.query({
            query: ({ category, exclude, latest, gender, sort }) => {
                if (latest && category) return `/products?latest=${latest}&category=${category}&gender=${gender}`
                if (category && exclude) return `/products?category=${category}&exclude=${exclude}&gender=${gender}`
                if (sort) return `/products?category=${category}&gender=${gender}&sort=${sort}`
                if (category) return `/products?category=${category}&gender=${gender}`
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