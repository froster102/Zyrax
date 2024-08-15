import _ from "lodash"
import { useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import { useAddItemsToUserCartMutation, useAddItemsToUserWishlistMutation } from "../features/userApiSlice"
import { selectUserToken } from "../features/authSlice"
import { addToWishlist, moveToWishlist } from "../features/userSlice"
import { Link } from "react-router-dom"

function CartProductCard({ item, removeFromCart, changeSize, changeOty }) {
    const [selectedSize, setSelectedSize] = useState(item?.selectedSize)
    const [selectedQty, setSelectedQty] = useState(item?.selectedQty)
    const dispatch = useDispatch()
    const [addToUserWishlist] = useAddItemsToUserWishlistMutation()
    const [addToUserCart] = useAddItemsToUserCartMutation()
    const userAuth = useSelector(selectUserToken)

    async function moveItemToWishlist(item) {
        dispatch(moveToWishlist({ itemToMove: item.product }))
        try {
            userAuth && await removeFromCart({ productId: item?.product?._id })
            userAuth && await addToUserWishlist({ items: [item.product._id] }).unwrap()
        } catch (error) {

        }
    }

    async function handleSelectedSizeChange() {
        dispatch(addToWishlist())
        try {
            userAuth && await addToUserWishlist({ items: [product._id] }).unwrap()
        } catch (error) {
        }
    }
    return (
        <>
            <div className="relative">
                <Link to={`/product/${item?.product?.name}`} >
                    <div className="bg-[#f1f1f1] min-w-[769px] h-[173px] rounded-[20px] border border-[#CFCBCB] flex p-[10px] relative mt-2">
                        <img className="w-[127px] h-[146px] rounded-[20px]" src={item?.product?.imageUrls[0]} alt="" />
                        <div className="flex justify-between w-full pl-4">
                            <div>
                                <p className="font-semibold">{_.startCase(item?.product?.name)}</p>
                                <div className="flex py-2">
                                    <select className="ml-2 border border-[#CFCBCB] text-xs rounded-full text-[#828282] px-2 flex items-center justify-center outline-none"
                                        value={selectedSize}
                                        onChange={(e) => {
                                            setSelectedSize(e.target.value)
                                        }}
                                    >
                                        <option value="" disabled >Size</option>
                                        {
                                            item?.product.sizes.map((size) => (<option key={size} value={size}>{size}</option>))
                                        }
                                    </select>
                                    <select className="ml-2 border border-[#CFCBCB] text-xs rounded-full text-[#828282] px-2 flex items-center justify-center outline-none"
                                        value={selectedQty}
                                        onChange={(e) => {
                                            setSelectedQty(e.target.value)
                                        }}
                                    >
                                        <option value="" disabled >Qty</option>
                                        <option value="1">1</option>
                                        <option value="2">2</option>
                                        <option value="3">3</option>
                                        <option value="4">4</option>
                                    </select>
                                </div>
                            </div>
                            <div>
                                <p className="font-semibold text-right">₹ {item?.product.price}</p>
                                <p className="text-sm font-medium">MRP incl. of all taxes</p>
                            </div>
                        </div>
                    </div>
                </Link>
                <div className="absolute bottom-5 right-2 ">
                    <button onClick={() => { removeFromCart({ productId: item?.product?._id }) }} className="px-2 bg-white rounded-full border border-black text-sm font-medium z-10" >Remove</button>
                    <button onClick={() => { moveItemToWishlist(item) }} className="ml-2 px-2 bg-white rounded-full border border-black text-sm font-medium z-10" >Move to Wishlist</button>
                </div>
            </div>
        </>
    )
}

export default CartProductCard