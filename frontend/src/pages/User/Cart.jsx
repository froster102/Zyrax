import { useDispatch, useSelector } from "react-redux";
import Accordion from "../../components/Accordion";
import CartProductCard from "../../components/CartProductCard"
import { removeFromCart, selectCartItems } from "../../features/userSlice";
import EmptyCart from "../../components/EmptyCart";
import { useRemoveItemFromUserCartMutation } from "../../features/userApiSlice";
import { selectUserToken } from "../../features/authSlice";
import { useEffect, useState } from "react";
import toast, { Toaster } from 'react-hot-toast'

function Cart() {
  const cartItems = useSelector(selectCartItems)
  const dispatch = useDispatch()
  const [removeUserCartItem] = useRemoveItemFromUserCartMutation()
  const userAuth = useSelector(selectUserToken)
  const [orders, setOrders] = useState([{
    productId: '',
    selectedSize: '',
    selectedQty: 0,
    appliedCoupoun: '',

  }])

  useEffect(() => {
    const updatedOrders = cartItems.map((item) => ({
      productId: item?._id,
      selectedSize: item?.selectedSize,
      selectedQty: item?.selectedQty,
      appliedCoupoun: item?.appliedCoupoun
    }))
    setOrders(updatedOrders)
  }, [cartItems])


  async function removeItemFromCart({ productId, moveToCart }) {
    try {
      userAuth && await removeUserCartItem({ productId }).unwrap()
      !moveToCart && toast('Product removed from cart sucessfully')
      dispatch(removeFromCart({ productId }))
    } catch (error) {
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
            {cartItems.map((item, i) => (<CartProductCard key={i} item={item} removeFromCart={removeItemFromCart} />))}
            {cartItems.length > 0 && <div>
            </div>}
          </div>
          <div className="md:mt-0 mt-4">
            <div className="w-full h-fit border border-[#CFCBCB] rounded-lg py-4 bg-white">
              <Accordion title={'Apply voucher'} ></Accordion>
              <Accordion title={'Gift Vouchers'} end={true}></Accordion>
            </div>
            <div className="pt-4">
              <p>Billing Detials</p>
              <div className="w-full h-fit border border-[#CFCBCB] rounded-lg py-4 bg-white font-medium">
                <p className="flex justify-between border-b border-[#CFCBCB]  px-4 pb-2"><span>Cart Total<span>(Incl. of all taxes)</span></span><span className="text-right">$398</span></p>
                <p className="flex justify-between border-b border-[#CFCBCB] py-2 px-4">Discout <span className="text-right">$20</span></p>
                <p className="flex justify-between border-b border-[#CFCBCB] py-2 px-4">GST <span className="text-right">$2</span></p>
                <p className="flex justify-between border-b border-[#CFCBCB] py-2 px-4">Shipping Charges <span className="text-right">$0</span></p>
                <p className="text-lg font-semibold flex justify-between px-4">Total Amount <span className="font-semibold ">$398</span></p>
              </div>
              <button className="bg-black w-full py-2 text-white mt-2 rounded-lg font-medium">Proceed to order</button>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export default Cart