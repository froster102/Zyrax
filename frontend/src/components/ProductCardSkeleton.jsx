import Skeleton from "react-loading-skeleton"
import 'react-loading-skeleton/dist/skeleton.css'


function ProductCardSkeleton() {
    return (
        <div className="w-[325px] h-[350px] border rounded-[20px] border-[#CFCBCB] inline-block ml-8">
            <Skeleton className="w-full h-full rounded-[20px]"/>
        </div>
    )
}

export default ProductCardSkeleton