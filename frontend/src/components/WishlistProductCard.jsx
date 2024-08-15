import React from 'react'
import { MdArrowForwardIos } from 'react-icons/md'
import _ from 'lodash'
import { IoMdClose } from "react-icons/io";
import { Link } from 'react-router-dom';

function WishlistProductCard({ product, removeItemFromWishlist, moveItemToCart }) {
    return (
        <>
            <div className="relative" >
                <Link to={`/product/${product.name}`}>
                    <div className='border border-[#CFCBCB] rounded-[20px] group flex flex-col relative'>
                        <div className='hidden group-hover:block transition ease-in'>
                            <IoMdClose onClick={(e) => { removeItemFromWishlist(e, product) }} className='w-[25px] h-[25px] transition ease-in bg-[#c9c8c8] rounded-full absolute z-50 right-4 top-4 flex items-center justify-center' size={20} />
                        </div>
                        <img className='w-[234px] h-[236px] rounded-t-[20px] object-cover' src={product.imageUrls[0]} alt="" />
                        <div className='bg-[#CFCECE] rounded-b-[20px] px-1 py-2'>
                            <div className='flex justify-between items-center'>
                                <div className='text-base font-sm px-1'>
                                    <p className='font-semibold'>{_.startCase(product.name)}</p>
                                    <p className='text-xs font-medium'>₹ {product.price}</p>
                                </div>
                                <div className="h-[20px] w-[20px] p-1 rounded-full flex justify-center items-center transition ease-in group-hover:bg-[#E6E6E6] ml-2">
                                    <MdArrowForwardIos />
                                </div>
                            </div>
                        </div>
                    </div>
                </Link>
                <button onClick={() => { moveItemToCart(product) }} className='rounded-full px-2 py-1 bg-white absolute bottom-[20%] right-4 text-sm z-10'>Move to Cart</button>
            </div>
        </>
    )
}

export default WishlistProductCard