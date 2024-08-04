import { useState } from "react"
import ProductCard from "./ProductCard"
import { MdChevronLeft, MdChevronRight } from "react-icons/md"

function Row({ title, query, rowId , products }) {
    function scrollLeft() {
        let slider = document.getElementById('slider' + rowId)
        slider.scrollLeft = slider.scrollLeft - 500
    }

    function scrollRight() {
        let slider = document.getElementById('slider' + rowId)
        slider.scrollLeft = slider.scrollLeft + 500
    }

    return (
        <>
            <div className="my-4">
                <h1 className="text-3xl ml-8">{title}</h1>
                <div className="flex items-center relative">
                    <div onClick={scrollLeft} className="absolute text-black left-2 z-10 bg-[#E6E6E6] w-[40px] h-[40px] rounded-full flex items-center justify-center">
                        <MdChevronLeft size={40} />
                    </div>
                    <div id={"slider" + rowId} className="mt-4 w-full h-full overflow-x-scroll whitespace-nowrap scroll-smooth scrollbar-hide">
                        {
                            products.map((product, i) => { return <ProductCard key={i} ></ProductCard> })
                        }
                    </div>
                    <div onClick={scrollRight} className="absolute text-black right-0 z-10 bg-[#E6E6E6] w-[40px] h-[40px] rounded-full flex items-center justify-center">
                        <MdChevronRight size={40} />
                    </div>
                </div>
            </div>
        </>
    )
}

export default Row