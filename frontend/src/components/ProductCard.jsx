import { MdArrowForwardIos } from "react-icons/md";
import _ from 'lodash'

function ProductCard({ product }) {
    return (
        <>
            <div className="w-[325px] h-[350px] border rounded-[20px] border-[#CFCBCB] relative inline-block ml-8">
                <img src={product?.imageUrls?.[0]} className="w-full h-full rounded-[20px] object-cover" alt="" />
                <div className="absolute w-64 bottom-2 p-2 left-4 bg-white rounded-[12px]">
                    <div className="flex justify-between">
                        <div>
                            <p className="text-base font-semibold">{_.startCase(product?.name)}</p>
                            <p className="text-sm font-medium">₹ {_.startCase(product?.price)}</p>
                        </div>
                        <div className="h-[40px] w-[40px] rounded-full flex justify-center items-center transition ease-in hover:bg-[#E6E6E6] ml-2">
                            <MdArrowForwardIos size={20} />
                        </div>
                    </div>

                </div>
            </div>
        </>
    )
}

export default ProductCard