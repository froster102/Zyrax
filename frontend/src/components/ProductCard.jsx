import { MdArrowForwardIos } from "react-icons/md";
import _ from 'lodash'
import { useState } from "react";

function ProductCard({ product, isLoading }) {
    const [changeImg, setChangeImg] = useState(false)
    return (
        <>
            <div className="w-[300px] h-[350px] border rounded-[20px] border-[#CFCBCB] relative inline-block ml-8">
                <img src={product?.imageUrls?.[0]} loading="lazy" className="w-full h-full rounded-[20px] object-cover" alt="" />
                <div className="absolute w-64 bottom-2 p-2 left-4 bg-[#d3d3d3] bg-opacity-70 backdrop-blur-md rounded-[12px] group">
                    <div className="flex justify-between items-center">
                        <div>
                            <p className="text-sm font-semibold">{_.startCase(product?.name)}</p>
                            <p className="text-xs font-normal">{_.startCase(product?.category.name)}</p>
                            <p className="text-sm font-medium">₹ {_.startCase(product?.price)}</p>
                        </div>
                        <div className="h-[40px] w-[40px] rounded-full flex justify-center items-center transition ease-in group-hover:bg-[#E6E6E6] ml-2">
                            <MdArrowForwardIos size={20} />
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}

export default ProductCard