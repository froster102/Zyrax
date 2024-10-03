import { useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import WishlistProductCard from "../../components/WishlistProductCard"
import { moveToCart, removeFromWishlist, selectWishlistItems } from "../../store/slices/userSlice"
import { useAddItemsToUserCartMutation, useGetUserWishlistItemsQuery, useRemoveItemFromUserWishlistMutation } from "../../store/api/userApiSlice"
import PickSizeModal from "../../components/PickSizeModal"
import { selectUserToken } from "../../store/slices/authSlice"
import EmptyCart from "../../components/EmptyCart"
import toast, { Toaster } from "react-hot-toast"

function Wishlist() {
  const localWishlistItems = useSelector(selectWishlistItems)
  const dispatch = useDispatch()
  const userAuth = useSelector(selectUserToken)
  const { data: { userWishlistItems = [] } = {} } = useGetUserWishlistItemsQuery(undefined, { skip: !userAuth })
  const [selectedSize, setSelectedSize] = useState('')
  const [openSelectSizeModal, setOpenSelectSizeModal] = useState(false)
  const [removeUserWishlistItem] = useRemoveItemFromUserWishlistMutation()
  const [addToUserCart] = useAddItemsToUserCartMutation()
  const [productToMove, setProductToMove] = useState(null)

  async function removeItemFromWishlist({ e, product }) {
    e.preventDefault()
    e.stopPropagation()
    try {
      if (userAuth) {
        await removeUserWishlistItem({ itemId: product._id })
        toast('Product removed from your wishlist')
      } else {
        dispatch(removeFromWishlist({ itemId: product._id }))
        toast('Product removed from your wishlist')
      }
    } catch (error) {
      ''
    }
  }

  async function moveItemToCart(product) {
    if (!selectedSize) {
      setProductToMove(product)
      setOpenSelectSizeModal(true)
      return
    }
    try {
      if (userAuth) {
        userAuth && await removeUserWishlistItem({ itemId: product._id })
        userAuth && await addToUserCart({ items: [{ productId: product._id, selectedSize }] }).unwrap()
        setSelectedSize('')
      } else {
        toast('Product added to your cart')
        dispatch(moveToCart({ itemToMove: product, selectedSize }))
        setSelectedSize('')
      }
    } catch (error) {
      ''
    }
  }

  const wishlistItems = userAuth ? userWishlistItems : localWishlistItems

  return (
    <>
      <Toaster
        position="top-right"
        toastOptions={{
          style: {
            backgroundColor: 'black',
            color: 'white',
          },
          duration: 2000
        }}
      />
      <div className="max-w-[1120px] m-auto mt-8 px-8">
        <h1 className="mt-10 font-semibold text-lg">My Wishlist <span className="font-light">({wishlistItems.length} Items)</span></h1>
        {wishlistItems.length === 0 && <EmptyCart />}
        <div className="flex gap-4 mt-4 flex-wrap">
          {wishlistItems.map((item, i) => <WishlistProductCard key={i} product={item} removeItemFromWishlist={removeItemFromWishlist} moveItemToCart={moveItemToCart}></WishlistProductCard>)}
        </div>
        {openSelectSizeModal && <PickSizeModal
          sizes={productToMove?.stock || []}
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