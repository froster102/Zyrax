import { useLocation, useNavigate } from 'react-router-dom'
import { useEffect, useState } from 'react'
import { useChekoutMutation, useVerifyPaymentMutation } from '../../store/api/userApiSlice'
import toast from 'react-hot-toast'
import { useDispatch, useSelector } from 'react-redux'
import { removeFromCart, resetCart, selectActiveGender, selectCartSummary, selectDefaultDeliveryAddress } from '../../store/slices/userSlice'
import { RotatingLines } from 'react-loader-spinner'
import { FaGooglePay, FaPaypal, FaWallet } from "react-icons/fa";
import { SiPhonepe } from "react-icons/si";
import { MdOutlinePayment } from "react-icons/md";
import { motion, AnimatePresence } from 'framer-motion'
import CartSummary from '../../components/CartSummary'

const paymentIcons = [
    <SiPhonepe key={'phonepe'} />,
    < MdOutlinePayment key={'card'} />,
    <FaGooglePay key={'gpay'} />
]

function Checkout() {
    const navigate = useNavigate()
    const dispatch = useDispatch()
    const activeGender = useSelector(selectActiveGender)
    const defaultDeliveryAddress = useSelector(selectDefaultDeliveryAddress)
    const location = useLocation()
    const { from } = location.state || ''
    const cartSummary = useSelector(selectCartSummary)
    const [paymentMethod, setPaymentMethod] = useState('')
    const [checkout, { isLoading }] = useChekoutMutation()
    const [verifyPayment] = useVerifyPaymentMutation()
    const [activeIconIndex, setActiveIndex] = useState(0)
    // useEffect(() => {
    //     const iconSlideInterval = setInterval(() => {
    //         setActiveIndex(activeIconIndex)
    //         setActiveIndex(activeIconIndex + 1)
    //         if (activeIconIndex >= paymentIcons.length - 1) setActiveIndex(0)
    //         console.log(activeIconIndex)
    //     }, 2000)

    //     return () => clearInterval(iconSlideInterval)
    // }, [activeIconIndex])

    useEffect(() => {
        if (from !== 'cart') {
            navigate('/cart')
            return
        }
    }, [navigate, from])

    async function proceedToCheckOut() {
        if (!paymentMethod) {
            toast('Please select a payment to proceed')
            return
        }
        try {
            const res = await checkout({ paymentMethod, shippingAddressId: defaultDeliveryAddress._id }).unwrap()
            if (paymentMethod === 'cash on delivery' || paymentMethod === 'zyraxWallet') {
                dispatch(resetCart())
                toast(res.message)
                navigate(`/order-sucess`, { state: { orderDetails: res.orderDetails }, replace: true })
            }
            if (paymentMethod === 'razorpay') {
                loadRazorpayCheckout(res)
            }
        } catch (error) {
            toast(error?.data?.message)
            if (error?.data?.type === 'stockError') {
                dispatch(removeFromCart({ productId: error?.data?.itemId }))
                navigate(`/${activeGender}`)
            }
        }
    }

    function loadScript(src) {
        return new Promise((resolve) => {
            const script = document.createElement('script')
            script.src = src
            script.onload = () => resolve(true)
            script.onerror = () => resolve(false)
            document.body.appendChild(script)
        })
    }

    async function loadRazorpayCheckout(orderData) {
        try {
            const res = await loadScript('https://checkout.razorpay.com/v1/checkout.js')
            if (!res) {
                toast('Failed to load payment page please try again later')
                return
            }
            const options = {
                "key": import.meta.env.VITE_RAZORPAY_KEY,
                "amount": orderData.amount,
                "currency": "INR",
                "name": "The Zyrax Store",
                "description": "Proceed with your suitable payment",
                "image": "https://example.com/your_logo",
                "order_id": orderData.id,
                handler: function (res) {
                    handlePaymentResponse(res)
                },
                "notes": {
                    "address": "The Zyrax Store  Office"
                },
                "theme": {
                    "color": "#3399cc"
                }
            }
            const razorpay = new window.Razorpay(options)
            razorpay.on('payment.failed', (res) => {
                handlePaymentResponse(res)
            })
            razorpay.open()

        } catch (error) {
            toast('Failed to load payment page please try again later')
        }

    }
    async function handlePaymentResponse(paymentDetails) {
        try {
            const res = await verifyPayment(paymentDetails).unwrap()
            dispatch(resetCart())
            navigate(`/order-sucess`, { state: { orderDetails: res.orderDetails } })
        } catch (error) {
            toast('Failed to confirm payment please try after some time')
        }
    }

    return (
        <div className="sm:max-w-[1040px] w-full m-auto">
            <div className="md:flex w-full mt-8 m-auto gap-10 px-4 pb-20">
                <div className="w-full">
                    <p>Select payment method</p>
                    <div className='w-full relative border border-neutral-300 bg-neutral-200 rounded-lg p-5 mt-2'>
                        <div className='flex w-full justify-between gap-1'>
                            <p>
                                Cash on delivery
                            </p>
                            <input name='payment' onClick={(e) => {
                                if (cartSummary.totalCartAmount < 1000) {
                                    e.preventDefault()
                                    toast('Cash on delivery only for order above 1000')
                                } else {
                                    setPaymentMethod('cash on delivery')
                                }
                            }} type="radio" />
                        </div>
                    </div>
                    <div className='w-full border border-neutral-300 bg-neutral-200 rounded-lg p-5 mt-2'>
                        <div className='flex w-full justify-between'>
                            <p className='flex items-center justify-center gap-1'>
                                <AnimatePresence>
                                    <motion.span
                                        key={activeIconIndex}
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        exit={{ opacity: 0 }}
                                        transition={{ duration: 0.5 }}
                                    >
                                        {paymentIcons[activeIconIndex]}
                                    </motion.span>
                                </AnimatePresence>
                                UPI/Card/Net Banking
                            </p>
                            <input name='payment' onClick={() => setPaymentMethod('razorpay')} type="radio" />
                        </div>
                    </div>
                    {/* <div className='w-full border border-neutral-300 bg-neutral-200 rounded-lg p-5 mt-2'>
                        <div
                            onClick={() => {
                                setPaymentMethod('card')
                                setOpenCardAccordion(!openCardAccordion)
                            }}
                            className='flex w-full justify-between gap-1'>
                            <p className='flex items-center justify-between w-full'>
                                <span className='flex items-center justify-center gap-1'>
                                    <span>
                                        <IoIosCard size={20} />
                                    </span>
                                    Credit / Debit Card
                                </span>
                                <IoIosArrowDown size={20} />
                            </p>
                        </div>
                        <div className={`py-5 ${openCardAccordion ? 'flex' : 'hidden'} justify-center transition-all ease-in-out duration-300`}>
                            <form action="" onSubmit={handleSubmit(proceedToCheckOut)}>
                                <div className='w-[400px] border rounded-md border-neutral-300 shadow-xl py-4 px-4'>
                                    <div className={`w-full rounded-md bg-neutral-300 px-2 ${errors?.cardNumber ? 'border border-red-600' : ''}`}>
                                        <label className='text-xs text-neutral-500'>Card Number</label>
                                        <input
                                            {...register('cardNumber')}
                                            value={getValues('cardNumber') || ''}
                                            onChange={(e) => {
                                                let value = e.target.value.replace(/\D/g, '')
                                                if (value.length > 16) {
                                                    value = value.slice(0, 16)
                                                }
                                                let formatedValue = ''
                                                for (let i = 0; i < value.length; i += 4) {
                                                    if (i + 4 < value.length) {
                                                        formatedValue += value.substring(i, i + 4) + ' '
                                                    } else {
                                                        formatedValue += value.substring(i)
                                                    }
                                                }
                                                setValue('cardNumber', formatedValue, { shouldValidate: true })
                                            }}
                                            className='text-sm w-full bg-transparent focus:outline-none' type="text" placeholder='xxxx xxxx xxxx xxxx' />
                                    </div>
                                    <div className='flex justify-between items-center'>
                                        <div className='flex gap-4 pt-4'>
                                            <div className={`rounded-md w-16 bg-neutral-300 px-2 ${errors?.month ? 'border border-red-600' : ''} `}>
                                                <label className='text-xs text-neutral-500' >Month</label>
                                                <input
                                                    {...register('month')}
                                                    value={getValues('month' || '')}
                                                    onChange={(e) => {
                                                        let value = e.target.value.replace(/\D/g, '')
                                                        if (value > 2) {
                                                            value = value.slice(0, 2)
                                                        }
                                                        setValue('month', value, { shouldValidate: true })
                                                    }}
                                                    className='w-full text-sm bg-transparent focus:outline-none h-4' type="text" placeholder='00' />
                                            </div>
                                            <div className={`rounded-md w-16 bg-neutral-300 px-2 ${errors?.year ? 'border border-red-600' : ''}`}>
                                                <label className='text-xs text-neutral-500' >Year</label>
                                                <input
                                                    {...register('year')}
                                                    value={getValues('year') || ''}
                                                    onChange={(e) => {
                                                        let value = e.target.value.replace(/\D/g, '')
                                                        if (value > 4) {
                                                            value = value.slice(0, 4)
                                                        }
                                                        setValue('year', value, { shouldValidate: true })
                                                    }}
                                                    className='w-full text-sm bg-transparent focus:outline-none h-4' type="text" placeholder='00' />
                                            </div>
                                        </div>
                                        <div className='pt-4'>
                                            <div className={`rounded-md w-16 bg-neutral-300 px-2 ${errors?.cvv ? 'border border-red-600' : ''}`}>
                                                <label className='text-xs text-neutral-500' >CVV</label>
                                                <input
                                                    {...register('cvv')}
                                                    value={getValues('cvv') || ''}
                                                    onChange={(e) => {
                                                        let value = e.target.value.replace(/\D/g, '')
                                                        if (value > 4) {
                                                            value = value.slice(0, 4)
                                                        }
                                                        setValue('cvv', value, { shouldValidate: true })
                                                    }}
                                                    className='w-full text-sm bg-transparent focus:outline-none h-4' type="password" placeholder='xxx' />
                                            </div>
                                        </div>
                                    </div>
                                    <div className='pt-4'>
                                        <div className={`w-full rounded-md bg-neutral-300 px-2 ${errors?.name ? 'border border-red-600' : ''}`}>
                                            <label className='text-xs text-neutral-500'>Name on card</label>
                                            <input
                                                {...register('name')}
                                                value={getValues('name') || ''}
                                                onChange={(e) => {
                                                    let value = e.target.value.replace(/[^a-zA-Z]/g, '').toUpperCase()
                                                    setValue('name', value, { shouldValidate: true })
                                                }}
                                                className='text-sm w-full bg-transparent focus:outline-none' type="text" placeholder='Name' />
                                        </div>
                                    </div>
                                </div>
                            </form>
                        </div>
                    </div> */}
                    <div className='w-full border border-neutral-300 bg-neutral-200 rounded-lg p-5 mt-2'>
                        <div onClick={() => setPaymentMethod('zyraxWallet')} className='flex w-full justify-between gap-1'>
                            <p className='flex items-center justify-between gap-1'>
                                <span>
                                    <FaWallet size={20} />
                                </span>
                                Zyrax Wallet
                            </p>
                            <input name='payment' onClick={() => setPaymentMethod('zyraxWallet')} type="radio" />
                        </div>
                    </div>
                    <div className='w-full border border-neutral-300 bg-neutral-200 rounded-lg p-5 mt-2'>
                        <div onClick={() => setPaymentMethod('payPal')} className='flex w-full justify-between gap-1'>
                            <p className='flex items-center justify-between'>
                                <span>
                                    <FaPaypal size={20} />
                                </span>
                                PayPal
                            </p>
                            <input name='payment' onClick={() => setPaymentMethod('payPal')} type="radio" />
                        </div>
                    </div>
                </div>
                <div>
                    <CartSummary />
                    <div className='px-4'>
                        <button onClick={() => {
                            proceedToCheckOut()
                        }} className="bg-black w-full py-2 text-white mt-2 rounded-lg font-medium">Proceed to order</button>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Checkout