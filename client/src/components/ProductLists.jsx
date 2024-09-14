import { useParams } from "react-router-dom"
import BreadCrumbs from "./BreadCrumbs"
import { useSelector } from "react-redux"
import { selectActiveGender } from "../features/userSlice"
import ProductCard from "./ProductCard"
import { RotatingLines } from 'react-loader-spinner'
import _ from "lodash"
import Filter from "./Filter"
import { useEffect, useState } from "react"
import { useGetProductsQuery } from "../features/productApiSlice"

function ProductLists() {
    const { category } = useParams()
    const [sort, setSort] = useState('')
    const gender = useSelector(selectActiveGender)
    const { data: products, isLoading: isProductsLoading, refetch, isError } = useGetProductsQuery({ category, gender, sort })

    useEffect(() => {
        refetch()
    }, [category, gender, sort, refetch])

    return (
        <>
            <div className="flex justify-between md:justify-center items-center w-full px-6">
                <div className="md:block hidden w-full">
                    <BreadCrumbs category={category} />
                    <div className="flex justify-between items-center">
                        <p className="pl-4 font-normal">{`${_.startCase(gender)} ${_.startCase(category)} - ${products?.length} items`}</p>
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
                </div>
            </div>
            <div className="pt-6 flex justify-between w-full px-6 ">
                <Filter />
                {
                    isError ? <div className="w-full text-center text-2xl font-medium h-full">No items found</div>
                        : <div className={`${isProductsLoading ? 'flex justify-center w-full' : ''}`}>
                            {
                                isProductsLoading ? <div className="flex justify-center w-full"><RotatingLines strokeColor="black" strokeWidth="3" /></div>
                                    : products.map((product, i) => <ProductCard key={i} product={product} />)
                            }
                        </div>
                }
            </div>
        </>
    )
}

export default ProductLists