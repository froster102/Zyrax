import _ from 'lodash'
import PropTypes from 'prop-types'
import { Link } from 'react-router-dom'
import Skeleton from 'react-loading-skeleton'
import 'react-loading-skeleton/dist/skeleton.css'
import { useEffect, useState } from 'react'

function ProductCard({ product }) {
    const [imageLoading, setImageLoading] = useState(true)
    const imgSrc = product.imageUrls[0]

    useEffect(() => {
        const img = new Image()
        img.src = imgSrc
        img.onload = () => setImageLoading(false)
        img.onerror = () => setImageLoading(true)
        
        return () => {
            img.onload = null
            img.onerror = null
        }
    }, [imgSrc])

    return (
        <>
            <Link to={`/product/${product.name}`} >
                <div className="lg:w-[280px] md:w-[200px] sm:w-[150px] w-[155px] border border-neutral-200 rounded-lg relative inline-block lg:ml-4p md:ml-4 ml-2">
                    {
                        imageLoading ? <Skeleton className='lg:w-[280px] lg:h-[370px] md:w-[200px] md:h-[264px] sm:w-[150px] sm:h-[197px] w-[155px] h-[204px] rounded-lg' />
                            : <img
                                src={product?.imageUrls?.[0]}
                                className="w-full h-full rounded-lg object-cover"
                                alt="product image"
                                loading='lazy'
                            />
                    }

                    <div className="absolute w-full bottom-2 lg:px-4 md:px-2 px-1">
                        <div className="bg-neutral-400 bg-opacity-70 backdrop-blur-md rounded-[12px] group p-2">
                            <div className="flex justify-between items-center">
                                <div className=" truncate ... whitespace-nowrap">
                                    <p className="lg:text-sm md:text-xs sm:text-[10px] text-[10px] font-semibold">{_.startCase(product?.name)}</p>
                                    <p className="lg:text-xs md:text-xs sm:text-[10px] text-[10px] font-normal">{_.startCase(product?.category?.name)}</p>
                                    <p className="lg:text-sm  md:text-xs sm:text-[10px] text-[10px] font-medium">₹ {_.startCase(product?.price)}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </Link>
        </>
    )
}

ProductCard.propTypes = {
    product: PropTypes.object.isRequired,
}

export default ProductCard