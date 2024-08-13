import { useDispatch, useSelector } from "react-redux"
import WishlistProductCard from "../../components/WishlistProductCard"
import { moveToCart, removeFromWishlist, selectWishlistItems } from "../../features/userSlice"
import { useAddItemsToUserCartMutation, useRemoveItemFromUserWishlistMutation } from "../../features/userApiSlice"

function Wishlist() {
  const items = useSelector(selectWishlistItems)
  const dispatch = useDispatch()
  const [removeUserWishlistItem] = useRemoveItemFromUserWishlistMutation()
  const [addToUserCartItem, { isLoading }] = useAddItemsToUserCartMutation()


  async function removeItemFromWishlist(e, product) {
    e.preventDefault()
    e.stopPropagation()
    dispatch(removeFromWishlist(product))
    try {
      await removeUserWishlistItem({ item: product._id })
    } catch (error) {
    }
  }

  async function moveItemToCart(e, product) {
    e.preventDefault()
    e.stopPropagation()
    try {
      await removeUserWishlistItem({ item: product._id })
      await addToUserCartItem({items:[product._id]})
      dispatch(moveToCart(product))
    } catch (error) {
    }
  }
  return (
    <>
      <div className="w-[1024px] ml-auto mr-auto mt-8">
        <h1 className="mt-10 font-semibold text-lg">My Wishlist <span className="font-light">({items.length} Items)</span></h1>
        <div className="flex gap-4 mt-4 flex-wrap">
          {items.map((item, i) => <WishlistProductCard key={i} product={item} removeItemFromWishlist={removeItemFromWishlist} moveItemToCart={moveItemToCart}></WishlistProductCard>)}
        </div>
      </div>
    </>
  )
}

export default Wishlist