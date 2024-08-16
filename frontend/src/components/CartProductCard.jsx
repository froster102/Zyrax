import _ from "lodash"
import { useRef, useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import { useAddItemsToUserCartMutation, useAddItemsToUserWishlistMutation } from "../features/userApiSlice"
import { selectUserToken } from "../features/authSlice"
import { addToCart, moveToWishlist } from "../features/userSlice"
import { Link } from "react-router-dom"

function CartProductCard({ item, removeFromCart, changeSize, changeOty }) {
    const [selectedSize, setSelectedSize] = useState(item?.selectedSize)
    const [selectedQty, setSelectedQty] = useState(item?.selectedQty)
    const dispatch = useDispatch()
    const [addToUserWishlist] = useAddItemsToUserWishlistMutation()
    const [addToUserCart] = useAddItemsToUserCartMutation()
    const userAuth = useSelector(selectUserToken)
    const selectedSizeRef = useRef(null)
    const selectedQtyRef = useRef(null)

    async function moveItemToWishlist(item) {
        dispatch(moveToWishlist({ itemToMove: item.product }))
        try {
            userAuth && await removeFromCart({ productId: item?.product?._id })
            userAuth && await addToUserWishlist({ items: [item.product._id] }).unwrap()
        } catch (error) {

        }
    }

    async function handleChange() {
        const selectedSize = selectedSizeRef.current.value
        const selectedQty = selectedQtyRef.current.value
        console.log(selectedSize, selectedQty)
        dispatch(addToCart({ product: item.product, selectedSize, selectedQty }))
        try {
            userAuth && await addToUserCart({ items: [{ productId: item.product._id, selectedSize, selectedQty }] }).unwrap()
        } catch (error) {
        }
    }

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
                                        onChange={() => {
                                            handleChange()
                                        }}
                                    >
                                        <option value="" disabled >Size</option>
                                        {
                                            item?.product.sizes.map((size) => (<option key={size} value={size}>{size}</option>))
                                        }
                                    </select>
                                    <select ref={selectedQtyRef} className="ml-2 border border-[#CFCBCB] text-xs rounded-md py-1 text-[#828282] px-2 flex items-center justify-center outline-none"
                                        value={item.selectedQty}
                                        onClick={(e) => {
                                            e.preventDefault()
                                            e.stopPropagation()
                                        }}
                                        onChange={() => {
                                            handleChange()
                                        }}
                                    >
                                        <option value="" disabled >Qty</option>
                                        <option value="1">1</option>
                                        <option value="2">2</option>
                                        <option value="3">3</option>
                                        <option value="4">4</option>
                                    </select>
                                </div>
                                <div className="flex w-full">
                                    <button onClick={(e) => {
                                        e.preventDefault()
                                        e.stopPropagation()
                                        removeFromCart({ productId: item?.product?._id })
                                    }} className="md:px-2 p-[2px] text-nowrap bg-stone-300 rounded-full border border-stone-300 md:text-sm text-xs font-medium z-10" >Remove</button>
                                    <button onClick={(e) => {
                                        e.preventDefault()
                                        e.stopPropagation()
                                        moveItemToWishlist(item)
                                    }} className="ml-2 md:px-2 p-[2px] text-nowrap bg-stone-300 rounded-full border border-stone-300 md:text-sm font-medium z-10 text-xs" >Move to Wishlist</button>
                                </div>
                            </div>
                            <p className="font-semibold text-right pt-4 md:text-base text-sm text-nowrap">₹ {item?.product.price}</p>
                        </div>
                    </div>
                </Link>
                {/* <div className="absolute bottom-5 left-36">
                    <button onClick={() => { removeFromCart({ productId: item?.product?._id }) }} className="md:px-2 p-1 bg-stone-300 rounded-full border border-stone-300 text-sm font-medium z-10" >Remove</button>
                    <button onClick={() => { moveItemToWishlist(item) }} className="ml-2 md:px-2 p-1 bg-stone-300 rounded-full border border-stone-300 text-sm font-medium z-10" >Move to Wishlist</button>
                </div> */}
            </div>
        </>
    )
}

export default CartProductCard