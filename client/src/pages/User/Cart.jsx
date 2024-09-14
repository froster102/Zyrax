import { useDispatch, useSelector } from "react-redux";
import CartProductCard from "../../components/CartProductCard"
import { moveToWishlist, removeFromCart, selectCartItems } from "../../features/userSlice";
import EmptyCart from "../../components/EmptyCart";
import { useAddItemsToUserWishlistMutation, useRemoveItemFromUserCartMutation, useUpdateUserCartItemsMutation } from "../../features/userApiSlice";
import { selectUserToken } from "../../features/authSlice";
import { useEffect, useState } from "react";
import toast, { Toaster } from 'react-hot-toast'
import { useNavigate } from "react-router-dom";
import CartToatalCard from "../../components/CartToatalCard";

function Cart() {
  const cartItems = useSelector(selectCartItems)
  const dispatch = useDispatch()
  const [removeUserCartItem] = useRemoveItemFromUserCartMutation()
  const [addToUserWishlist] = useAddItemsToUserWishlistMutation()
  const [updateUserCartItem] = useUpdateUserCartItemsMutation()
  const userAuth = useSelector(selectUserToken)
  const [totalCartAmount, setTotalCartAmount] = useState(0)
  const navigate = useNavigate()

  useEffect(() => {
    function calculateCartTotal() {
      let total = 0
      for (let item of cartItems) {
        total += Number(item.product.price)
      }
      setTotalCartAmount(total)
    }
    calculateCartTotal()
  }, [cartItems])

  async function removeItemFromCart({ productId, moveToCart, selectedSize }) {
    try {
      userAuth && await removeUserCartItem({ itemId: productId, selectedSize }).unwrap()
      !moveToCart && toast('Product removed from cart sucessfully')
      dispatch(removeFromCart({ productId, selectedSize }))
    } catch (error) {
      toast(error?.data?.message)
    }
  }

  async function moveItemToWishlist(item) {
    try {
      userAuth && await removeUserCartItem({ itemId: item?.product?._id, selectedSize: item.selectedSize })
      userAuth && await addToUserWishlist({ productId: item?.product._id }).unwrap()
      dispatch(moveToWishlist({ itemToMove: item.product }))
      toast('Product added to your wishlist')
    } catch (error) {
      ''
    }
  }

  async function updateCartItem({ itemId, selectedSize, selectedQty }) {
    try {
      userAuth && await updateUserCartItem({ itemId, selectedSize, selectedQty }).unwrap()
      dispatch({ itemId, selectedSize, selectedQty })
    } catch (error) {
      toast(error?.data?.message)
    }
  }

  return (
    <>
      <Toaster
        position="top-right"
        toastOptions={{
          style: {
            backgroundColor: 'black',
            color: 'white',
          },
          duration: 1000
        }}
      />
      <div className="sm:max-w-[1040px] w-full m-auto">
        <div className="md:flex w-full mt-8 m-auto gap-10 px-4">
          <div className="w-full">
            {cartItems.length === 0 && <EmptyCart />}
            {cartItems.map((item, i) => (<CartProductCard
              key={i} item={item}
              removeFromCart={removeItemFromCart}
              moveItemToWishlist={moveItemToWishlist}
              updateCartItem={updateCartItem}
            />))
            }
            {cartItems.length > 0 && <div>
            </div>}
          </div>
          {
            cartItems.length !== 0 && <CartToatalCard cartTotal={totalCartAmount} navigateToSelectAddress={() => navigate('/select-address', { state: { cartItems, totalCartAmount, selectAddress: true, orderProcess: true } })} />
          }
        </div>
      </div>
    </>
  )
}

export default Cart