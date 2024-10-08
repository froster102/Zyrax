import { useLocation, useNavigate } from "react-router-dom"
import Address from "./Address"
import CartToatalCard from "./CartToatalCard"
import { useEffect, useState } from "react"
import { RotatingLines } from "react-loader-spinner"

function SelectDeliveryAddress() {
    const location = useLocation()
    const navigate = useNavigate()
    const [pageLoading, setPageLoading] = useState(true)
    const [deliveryAddress, setDeliveryAddress] = useState({})
    const { totalCartAmount, cartItems, orderProcess, mrpTotal, offerAmount, couponDiscountAmount } = location.state || {}

    useEffect(() => {
        if (!orderProcess) {
            navigate('/cart')
        } else {
            setPageLoading(false)
        }
    }, [navigate, orderProcess])

    if (pageLoading) {
        return <div className='h-screen flex justify-center items-center'>
            <RotatingLines />
        </div>
    }

    return (
        <div className="my-20 px-4 md:flex gap-4 w-full justify-evenly">
            <Address deliveryAddress={deliveryAddress} setDeliveryAddress={setDeliveryAddress} orderMode={true} />
            <CartToatalCard
                cartTotal={totalCartAmount}
                priceTotal={mrpTotal}
                offerDiscount={offerAmount}
                couponDiscount={couponDiscountAmount}
                proceedToCheckout={() => navigate('/checkout', { state: { mrpTotal, offerAmount, couponDiscountAmount, cartItems, totalCartAmount, selectedAddress: deliveryAddress } })}
            />
        </div>
    )
}

export default SelectDeliveryAddress