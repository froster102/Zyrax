import { useParams } from "react-router-dom"
import BreadCrumbs from "./BreadCrumbs"
import { useSelector } from "react-redux"
import { selectActiveGender } from "../features/userSlice"
import { useGetProductsQuery } from "../features/userApiSlice"
import ProductCard from "./ProductCard"
import { RotatingLines } from 'react-loader-spinner'
import _ from "lodash"
import Filter from "./Filter"

function ProductLists() {
    const { category } = useParams()
    const gender = useSelector(selectActiveGender)
    const { data: products, isLoading: isProductsLoading } = useGetProductsQuery({ category, gender })
    console.log(products)
    return (
        <>
            <div className="flex justify-between md:justify-center items-center w-full px-6">
                <div className="md:block hidden w-full">
                    <BreadCrumbs category={category} />
                    <div className="flex justify-between items-center">
                        <p className="pl-4 font-normal">{`${_.startCase(gender)} ${_.startCase(category)} - ${products?.length} items`}</p>
                        <select value='' onChange={() => { }} className="bg-neutral-200 rounded-md focus:outline-none p-2">
                            <option value="">Select Sorting options</option>
                            <option value="">Low to high</option>
                            <option value="">High to low</option>
                            <option value="">A to Z</option>
                            <option value="">Z to A</option>
                            <option value="">Newest</option>
                            <option value="">Ratings</option>
                        </select>
                    </div>
                </div>
            </div>
            <div className="pt-6 flex justify-between w-full px-6 ">
                <Filter />
                <div className={`${isProductsLoading ? 'flex justify-center w-full' : ''}`}>
                    {
                        isProductsLoading ? <div className="flex justify-center w-full"><RotatingLines strokeColor="black" strokeWidth="3" /></div>
                            : products.map((product, i) => <ProductCard key={i} product={product} />)
                    }
                </div>
            </div>
        </>
    )
}

export default ProductLists