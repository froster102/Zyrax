import _ from 'lodash'
import { Link } from 'react-router-dom';
import { IoMdClose } from 'react-icons/io';
import PropTypes from 'prop-types'

function WishlistProductCard({ product, removeItemFromWishlist, moveItemToCart }) {
    return (
        <>
            <div className="relative" >
                <Link to={`/product/${product.name}`}>
                    <div className='border border-[#CFCBCB] xl:w-[244px] lg:w-[228px] md:w-[190px]  sm:w-[270px] w-[140px] rounded-xl relative truncate ... '>
                        <IoMdClose onClick={(e) => { removeItemFromWishlist({ e, product, moveToCart: true }) }} className='w-[25px] h-[25px] bg-[#c9c8c8] rounded-full absolute z-10 right-4 top-4 flex items-center justify-center' size={20} />
                        <img className='xl:w-[244px] lg:w-[228px] md:w-[190px] sm:w-[270px] w-[140px] rounded-t-xl object-cover' src={product.imageUrls[0]} alt="" />
                        <div className='bg-[#CFCECE] rounded-b-xl px-1 py-2'>
                            <div className='flex justify-between items-center'>
                                <div className='text-base font-sm px-1'>
                                    <p className='lg:text-base text-sm font-semibold truncate ...'>{_.startCase(product.name)}</p>
                                    <p className='text-xs font-medium'>₹ {product.price}</p>
                                </div>
                            </div>
                            <button onClick={(e) => {
                                e.preventDefault()
                                e.stopPropagation()
                                moveItemToCart(product)
                            }} className='w-full md:text-base text-sm font-medium bg-neutral-100 rounded-md hover:bg-black transition ease-in duration-200 hover:text-white'>Move to Cart</button>
                        </div>
                    </div>
                </Link>
            </div>
        </>
    )
}

WishlistProductCard.propTypes = {
    product: PropTypes.object.isRequired,
    removeItemFromWishlist: PropTypes.func.isRequired,
    moveItemToCart: PropTypes.func.isRequired,
}

export default WishlistProductCard