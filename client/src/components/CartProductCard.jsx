import _ from "lodash"
import { useRef } from "react"
import { Link } from "react-router-dom"
import PropTypes from 'prop-types'

function CartProductCard({ item, removeFromCart, moveItemToWishlist, updateCartItem, index }) {
    const selectedSizeRef = useRef(null)
    const selectedQtyRef = useRef(null)
    
    async function handleChange() {
        const selectedSize = selectedSizeRef.current.value
        const selectedQty = selectedQtyRef.current.value
        updateCartItem({ item, itemId: item?.product?._id, selectedQty, selectedSize, index })
    }

    const itemQtyMap = item.product.stock.reduce((acc, { size, quantity }) => {
        acc[size] = quantity
        return acc
    }, {})
    const maxQty = Math.min(itemQtyMap[item.selectedSize], 5)
    const maxQtyOptions = Array.from({ length: maxQty }, (_, i) => i + 1)
    const sizes = item.product.stock.map(({ size, quantity }) => {
        if (quantity > 0) return size
        return null
    }).filter(size => size)

    return (
        <>
            <div className="relative">
                <Link to={`/product/${item?.product?.name}`} >
                    <div className="bg-stone-200 w-full rounded-lg border border-[#CFCBCB] flex p-[10px] relative mt-2 px-4">
                        <img className="w-[127px] h-[146px] rounded-[20px]" src={item?.product?.imageUrls[0]} alt="" />
                        <div className="flex justify-between w-full md:pl-4 pl-2">
                            <div className="w-full">
                                <p className="font-semibold py-4 md:text-base text-sm">{_.startCase(item?.product?.name)}</p>
                                <p className="font-semibold text-xs">{_.startCase(item?.product?.category?.name)}</p>
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
                                        removeFromCart({ productId: item?.product?._id, selectedSize: item.selectedSize })
                                    }} className="md:px-2 p-[2px] text-nowrap bg-stone-100 rounded-md border border-stone-300 hover:bg-black hover:text-white transition ease-in duration-200 md:text-sm text-xs font-medium z-10" >Remove</button>
                                    <button onClick={(e) => {
                                        e.preventDefault()
                                        e.stopPropagation()
                                        moveItemToWishlist(item)
                                    }} className="ml-2 md:px-2 p-[2px] text-nowrap bg-stone-100 rounded-md border border-stone-300 hover:bg-black hover:text-white transition ease-in duration-200 md:text-sm font-medium z-10 text-xs" >Move to Wishlist</button>
                                </div>
                            </div>
                            <p className="font-semibold text-right pt-4 md:text-base text-sm text-nowrap">₹ {item?.product.price}</p>
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