import _ from "lodash"
import { useRef } from "react"
import { Link } from "react-router-dom"
import PropTypes from 'prop-types'
import { calculateDiscount } from '../utils/helper'

function CartProductCard({ item, removeFromCart, moveItemToWishlist, updateCartItem, index }) {
    const selectedSizeRef = useRef(null)
    const selectedQtyRef = useRef(null)

    async function handleChange() {
        const selectedSize = selectedSizeRef.current.value
        const selectedQty = selectedQtyRef.current.value
        updateCartItem({ item, itemId: item?.productId?._id, selectedQty, selectedSize, index })
    }

    const itemQtyMap = item.productId.stock.reduce((acc, { size, quantity }) => {
        acc[size] = quantity
        return acc
    }, {})
    const maxQty = Math.min(itemQtyMap[item.selectedSize], 5)
    const maxQtyOptions = Array.from({ length: maxQty }, (_, i) => i + 1)
    const sizes = item.productId.stock.map(({ size, quantity }) => {
        if (quantity > 0) return size
        return null
    }).filter(size => size)
    
    return (
        <>
            <div className="relative">
                <Link to={`/productId/${item?.productId?.name}`} >
                    <div className="bg-neutral-200 w-full rounded-lg border border-[#CFCBCB] flex p-[10px] relative mt-2 px-4">
                        <img className="w-[127px] h-[146px] rounded-[20px]" src={item?.productId?.imageUrls[0]} alt="" />
                        <div className="flex justify-between w-full md:pl-4 pl-2">
                            <div className="w-full">
                                <p className="font-semibold py-4 md:text-base text-sm">{_.startCase(item?.productId?.name)}</p>
                                <p className="font-semibold text-xs">{_.startCase(item?.productId?.category?.name)}</p>
                                <div className="flex py-1">
                                    <select ref={selectedSizeRef} className="border border-[#CFCBCB] text-xs rounded-md py-1 text-[#828282] px-2 flex items-center justify-center outline-none"
                                        value={item.selectedSize}
                                        onClick={(e) => {
                                            e.preventDefault()
                                            e.stopPropagation()
                                        }}
                                        onChange={handleChange}
                                    >
                                        <option value="" disabled >Size</option>
                                        {
                                            sizes.map((size) => (<option key={size} value={size}>{size}</option>))
                                        }
                                    </select>
                                    <select ref={selectedQtyRef} className="ml-2 border border-[#CFCBCB] text-xs rounded-md py-1 text-[#828282] px-2 flex items-center justify-center outline-none"
                                        value={item.selectedQty}
                                        onClick={(e) => {
                                            e.preventDefault()
                                            e.stopPropagation()
                                        }}
                                        onChange={handleChange}
                                    >
                                        <option value="" disabled >Qty</option>
                                        {maxQtyOptions.map((option) => <option key={option}>{option}</option>)}
                                    </select>
                                </div>
                                <div className="flex w-full">
                                    <button onClick={(e) => {
                                        e.preventDefault()
                                        e.stopPropagation()
                                        removeFromCart({ productId: item?.productId?._id, selectedSize: item.selectedSize })
                                    }} className="md:px-2 p-[2px] text-nowrap bg-neutral-100 rounded-md border border-neutral-300 hover:bg-black hover:text-white transition ease-in duration-200 md:text-sm text-xs font-medium z-10" >Remove</button>
                                    <button onClick={(e) => {
                                        e.preventDefault()
                                        e.stopPropagation()
                                        moveItemToWishlist(item)
                                    }} className="ml-2 md:px-2 p-[2px] text-nowrap bg-neutral-100 rounded-md border border-neutral-300 hover:bg-black hover:text-white transition ease-in duration-200 md:text-sm font-medium z-10 text-xs" >Move to Wishlist</button>
                                </div>
                            </div>
                            <div className="font-semibold text-right pt-4 md:text-base text-sm text-nowrap">
                                {item.productId?.offer ? <p className='flex items-center gap-2 w-full'>
                                    {'₹' + parseInt(calculateDiscount(item.productId.price, item.productId.offer.discountPercentage))}
                                    <span className='block text-sm items-end relative text-neutral-500'>
                                        ₹{item.productId.price}
                                        <span className='block absolute top-[5px]'>-----</span>
                                        <span className='pl-2 text-lg text-green-500'>{item.productId.offer.discountPercentage}%</span>
                                    </span>
                                </p>
                                    : <p className='font-semibold text-right pt-4 md:text-base text-sm text-nowrap align-text-top'>₹ {item.productId?.price}</p>
                                }
                            </div>

                        </div>
                    </div>
                </Link>
            </div>
        </>
    )
}

CartProductCard.propTypes = {
    item: PropTypes.object.isRequired,
    removeFromCart: PropTypes.func.isRequired,
    moveItemToWishlist: PropTypes.func.isRequired,
    updateCartItem: PropTypes.func.isRequired,
    index: PropTypes.number.isRequired
}

export default CartProductCard