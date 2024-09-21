import { useDispatch, useSelector } from "react-redux";
import CartProductCard from "../../components/CartProductCard"
import { moveToWishlist, removeFromCart, selectCartItems, updateCartItems } from "../../store/slices/userSlice";
import EmptyCart from "../../components/EmptyCart";
import { useAddItemsToUserWishlistMutation, useRemoveItemFromUserCartMutation, useUpdateUserCartItemsMutation } from "../../store/api/userApiSlice";
import { selectUserToken } from "../../store/slices/authSlice";
import { useEffect, useState } from "react";
import toast, { Toaster } from 'react-hot-toast'
import { useNavigate } from "react-router-dom";
import CartToatalCard from "../../components/CartToatalCard";
import ApplyCoupon from "../../components/ApplyCoupon";
import { calculateDiscount } from "../../utils/helper";

function Cart() {
  const cartItems = useSelector(selectCartItems)
  const dispatch = useDispatch()
  const [removeUserCartItem] = useRemoveItemFromUserCartMutation()
  const [addToUserWishlist] = useAddItemsToUserWishlistMutation()
  const [updateUserCartItem] = useUpdateUserCartItemsMutation()
  const userAuth = useSelector(selectUserToken)
  const [mrpTotal, setMrpTotal] = useState(0)
  const [totalCartAmount, setTotalCartAmount] = useState(0)
  const [couponDiscountAmount, setCouponDiscountAmount] = useState(0)
  const [offerAmount, setOfferAmount] = useState(0)
  const navigate = useNavigate()

  useEffect(() => {
    function calculateCartTotal() {
      let totalMrp = 0
      let totalOffer = 0

      cartItems.forEach((item) => {
        const price = Number(item.product.price)
        const selectedQty = Number(item.selectedQty)
        totalMrp += price * selectedQty
        if (item.product.offer) {
          const offerPrice = calculateDiscount(price, item.product.offer.discountPercentage)
          totalOffer += (price - offerPrice) * selectedQty
        }

      })
      const finalTotal = totalMrp - totalOffer - couponDiscountAmount

      setMrpTotal(totalMrp)
      setOfferAmount(totalOffer)
      setTotalCartAmount(finalTotal)

    }
    calculateCartTotal()
  }, [cartItems, couponDiscountAmount])

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
      toast(error?.data?.message)
    }
  }

  async function updateCartItem({ itemId, selectedSize, selectedQty, index }) {
    try {
      userAuth && await updateUserCartItem({ itemId, selectedSize, selectedQty, index }).unwrap()
      dispatch(updateCartItems({ itemId, selectedSize, selectedQty, index }))
    } catch (error) {
      toast(error?.data?.message)
    }
  }

  async function handleApplyCoupon(code) {
    try {

    } catch (error) {
      toast(error?.data?.message)
    }
  }

  async function handleRemoveCoupon(code) {
    try {

    } catch (error) {
      toast(error?.data?.message)
    }
  }

  // function calculateOffer(cartItems) {
  //   const prodcutOfferDicount = cartItems.reduce(acc, el)=> {
  //     if (el.pro)
  //   }
  // }

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
        {cartItems.length === 0 ? <EmptyCart />
          : <div className="md:flex w-full mt-8 m-auto gap-10 px-4">
            <div className="w-full">

              {cartItems.map((item, i) => (<CartProductCard
                key={i} item={item}
                removeFromCart={removeItemFromCart}
                moveItemToWishlist={moveItemToWishlist}
                updateCartItem={updateCartItem}
                index={i}
              />))
              }
              {cartItems.length > 0 && <div>
              </div>}
            </div>
            <div>
              {
                cartItems.length !== 0 && <CartToatalCard
                  priceTotal={mrpTotal}
                  cartTotal={totalCartAmount}
                  offerDiscount={offerAmount}
                  couponDiscount={couponDiscountAmount}
                  navigateToSelectAddress={() => navigate('/select-address', { state: { mrpTotal, offerAmount, couponDiscountAmount, cartItems, totalCartAmount, selectAddress: true, orderProcess: true } })}
                />
              }
              <ApplyCoupon
                handleApplyCoupon={handleApplyCoupon}
                handleRemoveCoupon={handleRemoveCoupon}
              />
            </div>
          </div>
        }
      </div>
    </>
  )
}

export default Cart