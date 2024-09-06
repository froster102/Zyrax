import { useLocation, useNavigate } from 'react-router-dom'
import CardToatalCard from '../../components/CartToatalCard'
import { useEffect, useState } from 'react'
import { useChekoutMutation } from '../../features/userApiSlice'
import toast from 'react-hot-toast'
import { useDispatch, useSelector } from 'react-redux'
import { removeFromCart, resetCart, selectActiveGender } from '../../features/userSlice'
import { RotatingLines } from 'react-loader-spinner'

function Checkout() {
    const location = useLocation()
    const navigate = useNavigate()
    const dispatch = useDispatch()
    const activeGender = useSelector(selectActiveGender)
    const [pageLoading, setPageLoading] = useState(true)
    const { cartItems, totalCartAmount, selectedAddress } = location.state || ''
    const [paymentMethod, setPaymentMethod] = useState('')
    const [checkout, { isLoading }] = useChekoutMutation()

    useEffect(() => {
        if (!location?.state) {
            navigate('/cart')
        } else {
            setPageLoading(false)
        }
    }, [navigate, cartItems, location])

    async function proceedToCheckOut() {
        if (!paymentMethod) {
            toast('Please select a payment to proceed')
            return
        }
        try {
            const res = await checkout({ cartItems, paymentMethod, shippingAddressId: selectedAddress._id }).unwrap()
            toast(res.message)
            dispatch(resetCart())
            navigate('/order-sucess', { state: { orderSucess: true }, replace: true })
        } catch (error) {
            toast(error?.data?.message)
            if (error?.data?.type === 'stockError') {
                dispatch(removeFromCart({ productId: error?.data?.itemId }))
                navigate(`/${activeGender}`)
            }
        }
    }

    if (pageLoading) {
        return <div className='h-screen flex justify-center items-center'>
            <RotatingLines />
        </div>
    }

    return (
        <div className="sm:max-w-[1040px] w-full m-auto">
            <div className="md:flex w-full mt-8 m-auto gap-10 px-4">
                <div className="w-full">
                    <p>Select address to deliver</p>
                    <div className='w-full border border-stone-300 bg-stone-200 rounded-lg p-10 mt-4'>
                        <div className='flex w-full justify-between'>
                            <p>
                                Cash on delivery
                            </p>
                            <input onClick={() => setPaymentMethod('cash on delivery')} type="radio" />
                        </div>

                    </div>
                </div>
                <CardToatalCard
                    cartTotal={totalCartAmount}
                    proceedToCheckout={proceedToCheckOut}
                    checkoutLoading={isLoading}
                />
            </div>
        </div>
    )
}

export default Checkout