import { useRef } from "react"
import ProductCard from "./ProductCard"
import { MdChevronLeft, MdChevronRight } from "react-icons/md"
import ProductCardSkeleton from "./ProductCardSkeleton"
import PropTypes from 'prop-types'


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
                <h1 className="lg:text-2xl md:text-xl text-lg uppercase sm:ml-8 ml-4 font-semibold">{title}</h1>
                <div className="flex items-center relative">
                    {products && <MdChevronLeft onClick={scrollLeft} className="absolute border border-neutral-300 text-black left-0 z-10 bg-[#E6E6E6] lg:w-[40px] lg:h-[40px] w-[30px] h-[30px]  rounded-full flex items-center justify-center" size={20} />}
                    <div ref={sliderRef} className="mt-4 w-full h-full overflow-x-scroll whitespace-nowrap scroll-smooth scrollbar-hide">
                        {
                            isLoading || !products ? [...Array(5)].map((e, i) => {
                                return <ProductCardSkeleton key={i}></ProductCardSkeleton>
                            }) : products.map((product, i) => {
                                return <ProductCard key={i} product={product}></ProductCard>
                            })
                        }
                    </div>
                    {products && <MdChevronRight onClick={scrollRight} className="absolute border border-neutral-300 text-black right-0 z-10 bg-[#E6E6E6] lg:w-[40px] lg:h-[40px] w-[30px] h-[30px]  rounded-full flex items-center justify-center" size={40} />}
                </div>
            </div>
        </>
    )
}

Row.propTypes = {
    title: PropTypes.string.isRequired,
    products: PropTypes.array,
    isLoading: PropTypes.bool.isRequired
}

export default Row