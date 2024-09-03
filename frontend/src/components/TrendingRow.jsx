import { useRef, useState } from 'react'
import TrendingCard from './TrendingCard'
import { useGetProductsQuery } from '../features/userApiSlice'
import TrendingRowSkeleton from './TrendingRowSkeleton'
import { MdChevronLeft, MdChevronRight } from "react-icons/md"
import { Link, useLocation } from 'react-router-dom'

function TrendingRow() {
    const [showProducts, setShowProducts] = useState('topwears')
    const { pathname } = useLocation()
    const { data: products, error, isLoading: isProductsLoading } = useGetProductsQuery({ latest: true, category: showProducts, gender: pathname.replace(/\//g, '') })
    const sliderRef = useRef(null)

    function scrollLeft() {
        let slider = sliderRef.current
        slider.scrollLeft = slider.scrollLeft - 500
    }

    function scrollRight() {
        let slider = sliderRef.current
        slider.scrollLeft = slider.scrollLeft + 500
    }

    function handleShowProducts(name) {
        setShowProducts(name)
    }

    return (
        <>
            <div className="w-fit ml-auto mr-auto mt-2">
                <button onClick={() => { handleShowProducts('topwears') }} className="bg-black lg:px-4 lg:py-2 px-2 py-1 sm:text-base text-sm rounded-full text-white">Topwears</button>
                <button onClick={() => { handleShowProducts('bottomwears') }} className="bg-black lg:px-4 lg:py-2 px-2 py-1 sm:text-base text-sm rounded-full text-white ml-2">Bottomwears</button>
            </div>
            <div className="my-4">
                <div className="flex items-center relative lg:w-[1024px] md:w-[724px] sm:w-[624px] w-[324px] ml-auto mr-auto h-full">
                    {products && <MdChevronLeft onClick={scrollLeft} className="absolute text-black left-2 z-10 bg-[#E6E6E6] lg:w-[40px] lg:h-[40px] w-[30px] h-[30px] rounded-full flex items-center justify-center" size={40} />}
                    {!error && !isProductsLoading && <div ref={sliderRef} className="mt-4  overflow-x-scroll whitespace-nowrap scroll-smooth scrollbar-hide">
                        {
                            isProductsLoading ? [...Array(3)].map((e, i) => {
                                return <TrendingRowSkeleton key={i} />
                            })
                                : products.map((product, i) => {
                                    return <Link key={i} to={`/product/${product.name}`}><TrendingCard product={product}></TrendingCard></Link>
                                })
                        }
                    </div>}
                    {products && <MdChevronRight onClick={scrollRight} className="absolute text-black right-0 z-10 bg-[#E6E6E6] lg:w-[40px] lg:h-[40px] w-[30px] h-[30px] rounded-full flex items-center justify-center" size={40} />}
                </div>
            </div>
        </>
    )
}

export default TrendingRow