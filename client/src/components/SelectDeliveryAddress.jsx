import { useLocation, useNavigate } from "react-router-dom"
import Address from "./Address"
// import { RotatingLines } from "react-loader-spinner"
import CartSummary from "./CartSummary"
import { useSelector } from "react-redux"
import { selectDefaultDeliveryAddress } from "@/store/slices/userSlice"
import toast from "react-hot-toast"
import { useEffect } from "react"

function SelectDeliveryAddress() {
    const navigate = useNavigate()
    const defaultDeliveryAddress = useSelector(selectDefaultDeliveryAddress)
    const location = useLocation()
    const { from } = location.state || ''

    useEffect(() => {
        if (from !== 'cart' && from !== 'orders') {
            navigate('/cart')
        }
    }, [navigate, from])

    return (
        <div className="my-20 px-4 md:flex gap-4 w-full justify-evenly">
            <Address orderMode={true} />
            <div>
                <CartSummary />
                <div className='px-4'>
                    <button onClick={() => {
                        if (defaultDeliveryAddress) navigate('/checkout', { state: { from: 'cart' } })
                        else if (from === 'orders' && location.state.mode === 'retry') {
                            navigate('/checkout', { state: { from: 'orders', mode: 'retry', orderId: location.state.orderId } })
                        }
                        else toast('Select a delivery address')
                    }} className="bg-black w-full py-2 text-white mt-2 rounded-lg font-medium">Proceed to order</button>
                </div>
            </div>
        </div>
    )
}

export default SelectDeliveryAddress