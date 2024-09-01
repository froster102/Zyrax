import { useLocation, useNavigate } from "react-router-dom"
import Address from "./Address"
import CartToatalCard from "./CartToatalCard"
import { useState } from "react"

function SelectDeliveryAddress() {
    const location = useLocation()
    const navigate = useNavigate()
    const [deliveryAddress, setDeliveryAddress] = useState({})
    const { totalCartAmount, cartItems } = location.state

    return (
        <div className="my-20 px-4 md:flex gap-4 w-full justify-evenly">
            <Address deliveryAddress={deliveryAddress} setDeliveryAddress={setDeliveryAddress} />
            <CartToatalCard
                cartTotal={totalCartAmount}
                proceedToCheckout={() => navigate('/checkout', { state: { cartItems, totalCartAmount, selectedAddress: deliveryAddress } })}
            />
        </div>
    )
}

export default SelectDeliveryAddress