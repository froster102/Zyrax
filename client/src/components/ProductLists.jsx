import { useLocation } from "react-router-dom"
import BreadCrumbs from "./BreadCrumbs"
import { useSelector } from "react-redux"
import { selectActiveGender } from "../store/slices/userSlice"
import ProductCard from "./ProductCard"
import { RotatingLines } from 'react-loader-spinner'
import _ from "lodash"
import Filter from "./Filter"
import { useEffect, useState } from "react"
import { useGetProductsQuery } from "../store/api/productApiSlice"
import queryString from "query-string"
import Pagination from "./Pagination"
import { FadeLoader } from "react-spinners"

function ProductLists() {
    const location = useLocation()
    const query = queryString.parse(location.search)
    const gender = useSelector(selectActiveGender)
    const [filter, setFilter] = useState({
        search: query?.search,
        category: query?.category,
        minPrice: null,
        maxPrice: null,
        offerPercentage: 0,
        stock: null,
        latest: null,
        page: 1,
        limit: 10,
        gender
    })
    const initialFilter = {
        search: query?.search,
        category: query?.category,
        minPrice: null,
        maxPrice: null,
        offerPercentage: 0,
        stock: null,
        latest: null,
        page: 1,
        limit: 10,
        gender
    }
    const [sort, setSort] = useState('')
    const { data: { products = [], totalCount = 0 } = {}, isLoading: isProductsLoading, isFetching: isProductsFetching, isError } = useGetProductsQuery({ filter, sort })

    useEffect(() => {
        setFilter(prev => ({
            ...prev,
            category: query.category,
            search: query?.search,
            page: 1
        }))
    }, [query.category, query?.search])

    function onPageChange(page) {
        setFilter(prev => ({
            ...prev,
            page: page
        }))
    }

    function resetFilter() {
        setFilter(initialFilter)
    }

    return (
        <>
            {
                isProductsFetching && <div className="absolute inset-0 z-10 w-full h-full overflow-hidden">
                    <div className="fixed inset-0 bg-neutral-300 bg-opacity-35 transition-all backdrop-blur-sm"></div>
                    <div className="flex justify-center items-center h-full">
                        <FadeLoader />
                    </div>
                </div>
            }
            <div className="flex justify-between md:justify-center items-center w-full px-2">
                <div className="md:block hidden w-full">
                    <BreadCrumbs category={query?.category} />
                </div>
            </div>
            <div className="flex items-center justify-between px-6">
                <p className="font-medium pt-2">{`${_.startCase(gender)} ${_.startCase(query?.category)} - ${products?.length} items`}</p>
                <select
                    value={sort} onChange={(e) => {
                        if (e.target.value !== 'default') setSort(e.target.value)
                    }}
                    className="bg-neutral-200 rounded-md focus:outline-none p-2">
                    <option value="default">Select Sorting options</option>
                    <option value="L2H">Low to high</option>
                    <option value="H2L">High to low</option>
                    <option value="A2Z">A to Z</option>
                    <option value="Z2A">Z to A</option>
                    <option value="newest">Newest</option>
                    <option value="rating">Ratings</option>
                </select>
            </div>
            <div className="flex pt-4 px-6">
                <Filter
                    initialFilter={initialFilter}
                    filter={filter}
                    setFilter={setFilter}
                    resetFilter={resetFilter}
                />
                {
                    isError ? <div className="w-full text-center text-2xl font-medium h-full">No items found</div>
                        : <div className={`${isProductsLoading ? 'flex justify-center w-full' : ''}`}>
                            {
                                isProductsLoading ? <div className=""><RotatingLines strokeColor="black" strokeWidth="3" /></div>
                                    : products.map((product, i) => <ProductCard key={i} product={product} />)
                            }
                        </div>
                }
            </div>
            <div className="pb-20">
                <Pagination
                    currentPage={filter.page}
                    totalPages={Math.ceil(totalCount / filter.limit)}
                    onPageChange={onPageChange}
                />
            </div>
        </>
    )
}

export default ProductLists