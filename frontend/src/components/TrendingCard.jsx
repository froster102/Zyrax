import _ from "lodash"
import { MdArrowForwardIos } from "react-icons/md"

function TrendingCard({ product }) {
    return (
        <>
            <div className="w-[400px] h-[500px] border border-[#E6E6E6] inline-block ml-2 rounded-[20px] relative">
                <img src={product?.imageUrls?.[0]} className="w-full h-full rounded-[20px] object-cover" alt="" />
                <div className="absolute w-80 bottom-2 p-2 left-4 bg-[#d3d3d3] bg-opacity-70 backdrop-blur-md rounded-[12px] group">
                    <div className="flex justify-between items-center">
                        <div>
                            <p className="text-xl font-semibold">{_.startCase(product?.name)}</p>
                            <p className="text-sm font-normal">{_.startCase(product?.category.name)}</p>
                            <p className="text-lg font-medium">₹ {_.startCase(product?.price)}</p>
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

export default TrendingCard