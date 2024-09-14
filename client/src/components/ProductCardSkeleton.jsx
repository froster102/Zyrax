import Skeleton from "react-loading-skeleton"
import 'react-loading-skeleton/dist/skeleton.css'


function ProductCardSkeleton() {
    return (
        <div className="lg:w-[300px] lg:h-[350px] md:w-[200px] md:h-[250px] sm:w-[150px] sm:h-[200px] w-[130px] h-[180px] rounded-xl inline-block md:ml-8 ml-2">
            <Skeleton className="w-full h-full rounded-xl"/>
        </div>
    )
}

export default ProductCardSkeleton