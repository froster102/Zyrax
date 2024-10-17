import { useDispatch, useSelector } from "react-redux";
import CartProductCard from "../../components/CartProductCard"
import { moveToWishlist, removeFromCart, selectCartItems, selectDefaultDeliveryAddress, updateCartItems, updateCartSummary } from "../../store/slices/userSlice";
import { useAddItemsToUserWishlistMutation, useGetItemsFromUserCartQuery, useRemoveItemFromUserCartMutation, useUpdateUserCartItemsMutation } from "../../store/api/userApiSlice";
import { selectUserToken } from "../../store/slices/authSlice";
import { useEffect } from "react";
import toast from 'react-hot-toast'
import { useNavigate } from "react-router-dom";
import ApplyCoupon from "../../components/ApplyCoupon";
import { calculateDiscount } from "../../utils/helper";
import CartSummary from "../../components/CartSummary";
import _ from "lodash";
import EmptyCard from "../../components/EmptyCard";


function Cart() {
  const localCartItems = useSelector(selectCartItems)
  const defaultDeliveryAddress = useSelector(selectDefaultDeliveryAddress)
  const dispatch = useDispatch()
  const [removeUserCartItem] = useRemoveItemFromUserCartMutation()
  const [addToUserWishlist] = useAddItemsToUserWishlistMutation()
  const [updateUserCartItem] = useUpdateUserCartItemsMutation()
  const userAuth = useSelector(selectUserToken)
  const navigate = useNavigate()
  const { data: { userCartItems = [], appliedCoupon = {} } = {} } = useGetItemsFromUserCartQuery(undefined, { skip: !userAuth })
  const cartItems = userAuth ? userCartItems : localCartItems

  useEffect(() => {
    function calculateCartTotal() {
      let totalMrp = 0
      let totalOffer = 0
      let totalCouponDiscount = 0

      cartItems.forEach((item) => {
        const price = Number(item.productId.price)
        const selectedQty = Number(item.selectedQty)
        totalMrp += price * selectedQty
        if (item.productId.offer) {
          const offerDeduction = calculateDiscount(price, item.productId.offer.discountPercentage)
          totalOffer += (price - offerDeduction) * selectedQty
        }

      })
      const totalPrice = totalMrp - totalOffer
      if (appliedCoupon?.code) {
        const couponDiscountAmount = parseInt((appliedCoupon.discount / 100) * totalPrice)
        const applicableCouponDiscount = Math.min(couponDiscountAmount, appliedCoupon.maxDiscountAmount)
        totalCouponDiscount = applicableCouponDiscount
        dispatch(updateCartSummary({
          totalCouponDiscount: applicableCouponDiscount
        }))
      }
      const finalTotal = (totalMrp - totalOffer) - totalCouponDiscount
      dispatch(updateCartSummary({
        mrpTotal: totalMrp,
        totalCouponDiscount,
        totalCartAmount: finalTotal,
        offerAmount: totalOffer
      }))
    }
    if (cartItems.length > 0) calculateCartTotal()
  }, [cartItems, appliedCoupon, dispatch])

  async function removeItemFromCart({ productId, moveToCart, selectedSize }) {
    try {
      if (userAuth) {
        await removeUserCartItem({ itemId: productId, selectedSize }).unwrap()
        !moveToCart && toast('Product removed from cart sucessfully', {
          position: 'top-right'
        })
      } else {
        dispatch(removeFromCart({ productId, selectedSize }))
        !moveToCart && toast('Product removed from cart sucessfully', {
          position: 'top-right'
        })
      }
    } catch (error) {
      toast(error?.data?.message)
    }
  }

  async function moveItemToWishlist(item) {
    try {
      if (userAuth) {
        userAuth && await removeUserCartItem({ itemId: item?.productId?._id, selectedSize: item.selectedSize })
        userAuth && await addToUserWishlist({ items: [item?.productId._id] }).unwrap()
        toast('Product added to your wishlist', {
          position: 'top-right'
        })
      } else {
        dispatch(moveToWishlist({ itemToMove: item.productId }))
        toast('Product added to your wishlist', {
          position: 'top-right'
        })
      }
    } catch (error) {
      toast(error?.data?.message)
    }
  }

  async function updateCartItem({ itemId, selectedSize, selectedQty, index }) {
    try {
      if (userAuth) {
        await updateUserCartItem({ itemId, selectedSize, selectedQty, index }).unwrap()
      } else {
        dispatch(updateCartItems({ itemId, selectedSize, selectedQty, index }))
      }
    } catch (error) {
      toast(error?.data?.message)
    }
  }

  return (
    <>
      <div className="sm:max-w-[1040px] w-full m-auto">
        {cartItems.length === 0 ? <EmptyCard title="Cart" />
          : <div className="md:flex w-full mt-8 m-auto gap-10 px-4">
            <div className="w-full">
              {
                defaultDeliveryAddress &&
                <div className="sm:max-w-[1040px] w-full m-auto mt-2 px-4 py-2 rounded-md border">
                  <div className="flex justify-between items-center">
                    <div>
                      <p>Deliver to: <span className="font-semibold">{_.startCase(defaultDeliveryAddress.firstName) + ' ' + _.startCase(defaultDeliveryAddress.lastName)}, {defaultDeliveryAddress.pincode}</span> </p>
                      <p className="text-xs font-medium">{_.startCase(defaultDeliveryAddress.buildingName)},{_.startCase(defaultDeliveryAddress.street)}, {_.startCase(defaultDeliveryAddress.city)}</p>
                    </div>
                    <button onClick={() => {
                      navigate('/select-address', { state: { from: 'cart' } })
                    }} className="font-semibold">Change</button>
                  </div>
                </div>
              }
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
                cartItems.length !== 0 &&
                <div>
                  <CartSummary />
                  <div className='px-4'>
                    <button onClick={() => {
                      if (defaultDeliveryAddress) {
                        navigate('/checkout', { state: { from: 'cart' } })
                      } else {
                        navigate('/select-address', { state: { from: 'cart' } })
                      }
                    }} className="bg-black w-full py-2 text-white mt-2 rounded-lg font-medium">Proceed to order</button>
                  </div>
                </div>
              }
              {
                userAuth && <ApplyCoupon
                  cartItems={cartItems}
                  appliedCoupon={appliedCoupon}
                />
              }
            </div>
          </div>
        }
      </div>
    </>
  )
}

export default Cart