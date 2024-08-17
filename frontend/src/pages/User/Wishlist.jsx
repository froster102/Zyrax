import { useDispatch, useSelector } from "react-redux"
import WishlistProductCard from "../../components/WishlistProductCard"
import { moveToCart, removeFromWishlist, selectWishlistItems } from "../../features/userSlice"
import { useAddItemsToUserCartMutation, useRemoveItemFromUserWishlistMutation } from "../../features/userApiSlice"
import { useEffect, useState } from "react"
import PickSizeModal from "../../components/PickSizeModal"
import { selectUserToken } from "../../features/authSlice"
import EmptyCart from "../../components/EmptyCart"

function Wishlist() {
  const items = useSelector(selectWishlistItems)
  const dispatch = useDispatch()
  const userAuth = useSelector(selectUserToken)
  const [selectedSize, setSelectedSize] = useState('')
  const [openSelectSizeModal, setOpenSelectSizeModal] = useState(false)
  const [removeUserWishlistItem] = useRemoveItemFromUserWishlistMutation()
  const [addToUserCart] = useAddItemsToUserCartMutation()
  const [productToMove, setProductToMove] = useState(null)

  async function removeItemFromWishlist(e, product) {
    e.preventDefault()
    e.stopPropagation()
    dispatch(removeFromWishlist(product))
    try {
      await removeUserWishlistItem({ item: product._id })
    } catch (error) {
    }
  }

  async function moveItemToCart(product) {
    if (!selectedSize) {
      setProductToMove(product)
      setOpenSelectSizeModal(true)
      return
    }
    try {
      userAuth && await removeUserWishlistItem({ item: product._id })
      userAuth && await addToUserCart({ items: [{ productId: product._id, selectedSize }] }).unwrap()
      dispatch(moveToCart({ itemToMove: product, selectedSize }))
      setSelectedSize('')
    } catch (error) {
    }
  }
  console.log(items)
  return (
    <>
      <div className="max-w-[1120px] m-auto mt-8">
        <h1 className="mt-10 font-semibold text-lg">My Wishlist <span className="font-light">({items.length} Items)</span></h1>
        {items.length === 0 && <EmptyCart />}
        <div className="flex gap-4 mt-4 flex-wrap">
          {items.map((item, i) => <WishlistProductCard key={i} product={item} removeItemFromWishlist={removeItemFromWishlist} moveItemToCart={moveItemToCart}></WishlistProductCard>)}
        </div>
        {openSelectSizeModal && <PickSizeModal
          sizes={productToMove?.sizes}
          selectedSize={selectedSize}
          setSelectedSize={setSelectedSize}
          closeModal={() => { setOpenSelectSizeModal(false) }}
          proceed={() => { moveItemToCart(productToMove) }}
        />}
      </div>
    </>
  )
}

export default Wishlist