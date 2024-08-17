import { MdArrowForwardIos } from "react-icons/md";
import _ from 'lodash'
import { useState } from "react";

function ProductCard({ product, isLoading }) {
    const [changeImg, setChangeImg] = useState(false)
    return (
        <>
            <div className="lg:w-[300px] lg:h-[350px] md:w-[200px] md:h-[250px] sm:w-[150px] sm:h-[200px] w-[130px] h-[180px] border rounded-lg border-[#CFCBCB] relative inline-block lg:ml-8 md:ml-4 ml-2">
                <img src={product?.imageUrls?.[0]} loading="lazy" className="w-full h-full rounded-lg object-cover" alt="" />
                <div className="absolute w-full bottom-2 lg:px-4 md:px-2 px-1">
                    <div className="bg-stone-400 bg-opacity-70 backdrop-blur-md rounded-[12px] group p-2">
                        <div className="flex justify-between items-center">
                            <div className=" truncate ... whitespace-nowrap">
                                <p className="lg:text-sm md:text-xs sm:text-[10px] text-[10px] font-semibold">{_.startCase(product?.name)}</p>
                                <p className="lg:text-xs md:text-xs sm:text-[10px] text-[10px] font-normal">{_.startCase(product?.category.name)}</p>
                                <p className="lg:text-sm  md:text-xs sm:text-[10px] text-[10px] font-medium">₹ {_.startCase(product?.price)}</p>
                            </div>
                        </div>
                    </div>  
                </div>
            </div>
        </>
    )
}

export default ProductCard