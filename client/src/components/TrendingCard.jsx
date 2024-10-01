import _ from "lodash"

function TrendingCard({ product }) {
    return (
        <>
            <div className="lg:w-[350px] lg:h-[450px] md:w-[250px] md:h-[350px] sm:w-[200px] sm:h-[300px] w-[180px] h-[280px]  border border-neutral-300 inline-block ml-2 rounded-xl relative">
                <img src={product?.imageUrls?.[0]} className="w-full h-full rounded-xl object-cover" alt="" />
                <div className="absolute w-full bottom-2 lg:px-4 md:px-2 px-1">
                    <div className="bg-neutral-400 bg-opacity-70 backdrop-blur-md rounded-[12px] group p-2">
                        <div className="flex justify-between items-center truncate ...">
                            <div>
                                <p className="text-lg font-semibold">{_.startCase(product?.name)}</p>
                                <p className="text-xs font-normal">{_.startCase(product?.category.name)}</p>
                                <p className="text-sm font-medium">₹ {_.startCase(product?.price)}</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}

export default TrendingCard