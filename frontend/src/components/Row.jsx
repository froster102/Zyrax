import { useRef } from "react"
import ProductCard from "./ProductCard"
import { MdChevronLeft, MdChevronRight } from "react-icons/md"
import { Link } from "react-router-dom"
import ProductCardSkeleton from "./ProductCardSkeleton"


function Row({ title, products, isLoading }) {
    const sliderRef = useRef(null)

    function scrollLeft() {
        let slider = sliderRef.current
        slider.scrollLeft = slider.scrollLeft - 500
    }

    function scrollRight() {
        let slider = sliderRef.current
        slider.scrollLeft = slider.scrollLeft + 500
    }

    return (
        <>
            <div className="my-4">
                <h1 className="text-2xl ml-8">{title}</h1>
                <div className="flex items-center relative">
                    <MdChevronLeft onClick={scrollLeft} className="absolute text-black left-2 z-10 bg-[#E6E6E6] w-[40px] h-[40px] rounded-full flex items-center justify-center" size={40} />
                    <div ref={sliderRef} className="mt-4 w-full h-full overflow-x-scroll whitespace-nowrap scroll-smooth scrollbar-hide">
                        {
                            isLoading || !products ? [...Array(5)].map((e, i) => {
                                return <ProductCardSkeleton key={i}></ProductCardSkeleton>
                            }) : products.map((product, i) => { 
                                return <Link to={`/product/${product.name}`} key={i}><ProductCard product={product}></ProductCard></Link> })
                        }
                    </div>
                    <MdChevronRight onClick={scrollRight} className="absolute text-black right-0 z-10 bg-[#E6E6E6] w-[40px] h-[40px] rounded-full flex items-center justify-center" size={40} />
                </div>
            </div>
        </>
    )
}

export default Row