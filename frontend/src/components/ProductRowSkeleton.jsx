import Skeleton from "react-loading-skeleton"
import 'react-loading-skeleton/dist/skeleton.css'

function ProductRowSkeleton() {
    return (
        <>
            <div className="my-4">
                <div className="flex items-center relative">
                    <div className="mt-4 w-full h-full overflow-x-scroll whitespace-nowrap scroll-smooth scrollbar-hide">
                        {[...Array(5).map((e, i) => {
                            return <Skeleton className="lg:w-[300px] lg:h-[350px] md:w-[200px] md:h-[250px] sm:w-[150px] sm:h-[200px] w-[130px] h-[180px]" key={i}  />
                        })]}
                    </div>
                </div>
            </div>
        </>
    )
}

export default ProductRowSkeleton