import { useApplyCouponMutation, useGetCouponsQuery, useRemoveCouponMutation } from '../store/api/couponApiSlice'
import { useDispatch, useSelector } from 'react-redux'
import { selectUserToken } from '../store/slices/authSlice'
import { useNavigate } from 'react-router-dom'
import toast from 'react-hot-toast'
import PropTypes from 'prop-types'
import { IoIosArrowDown, IoIosClose } from 'react-icons/io'
import { useEffect, useState } from 'react'
import { applyCoupon, removeAppliedCoupon, selectAppliedCoupon } from '@/store/slices/userSlice'

function ApplyCoupon({ cartItems }) {
    const userAuth = useSelector(selectUserToken)
    const appliedCoupon = useSelector(selectAppliedCoupon)
    const navigate = useNavigate()
    const { data: { coupons = [] } = {}, isLoading: isCouponsLoading, refetch: refetchCoupons, isError } = useGetCouponsQuery(undefined, { skip: !userAuth })
    const [couponCode, setCouponCode] = useState({
        code: ''
    })
    const [applyUserCoupon] = useApplyCouponMutation()
    const [removeUserCoupon] = useRemoveCouponMutation()
    const [openSelectCoupon, setOpenSelectCoupon] = useState(false)
    const [error, setError] = useState('')
    const dispatch = useDispatch()

    async function handleApplyCoupon(coupon) {
        try {
            if (coupon.code !== appliedCoupon.code) {
                const res = await applyUserCoupon({ code: coupon.code }).unwrap()
                dispatch(applyCoupon({ coupon }))
                toast(res?.message)
            }
        } catch (error) {
            toast(error?.data?.message)
        }
    }

    async function handleRemoveCoupon() {
        try {
            const res = await removeUserCoupon().unwrap()
            dispatch(removeAppliedCoupon())
            toast(res?.message)
        } catch (error) {
            toast(error?.data?.message)
        }
    }

    useEffect(() => {
        function checkCouponAvailablity(couponCode) {
            if (coupons.length > 0) {
                const availableCoupons = coupons.map(coupon => coupon.code)
                if (availableCoupons.includes(couponCode)) return true
            }
            return false
        }
        if (isError) {
            navigate('/login')
        }
        const isCouponAvailable = checkCouponAvailablity(appliedCoupon.code)
        if (!isCouponAvailable) {
            if (appliedCoupon.code) {
                dispatch(removeAppliedCoupon())
            }
        }
        userAuth && refetchCoupons()
    }, [refetchCoupons, userAuth, navigate, isError, cartItems, appliedCoupon, isCouponsLoading, coupons, dispatch])

    return (
        <div>
            <div className="w-full h-fit border border-[#CFCBCB] rounded-lg p-5 bg-white mt-6">
                <p className="font-semibold text-lg">Do you have a voucher ?</p>
                <input
                    type="text"
                    className="p-2 border border-neutral-400 rounded-md mt-4 w-full"
                    value={couponCode.code}
                    onChange={(e) => {
                        setError('')
                        setCouponCode({ code: e.target.value })
                    }}
                />
                <button
                    onClick={() => {
                        if (!userAuth) {
                            toast('Please login to apply coupons')
                            navigate('/login')
                        } else {
                            if (!couponCode.code) {
                                setError('Coupon code is required')
                            } else if (!/^[A-Za-z0-9]+$/.test(couponCode.code)) {
                                setError('Only alphabets are allowed')
                            } else {
                                handleApplyCoupon(couponCode)
                            }
                        }
                    }}
                    className="block bg-black w-full py-2 text-white mt-2 rounded-lg font-medium">Apply code
                </button>
                {error && <span className='text-red-600 text-xs font-medium'>{error}</span>}
                {
                    appliedCoupon.code && <button
                        className='bg-neutral-600 text-white text-sm px-2 py-1 rounded-md mt-2 flex items-center'
                        onClick={handleRemoveCoupon}
                    >
                        <IoIosClose size={20} />
                        {appliedCoupon.code}
                    </button>
                }
                {
                    coupons.length > 0 && <div className='pt-4 transition-all ease-in-out duration-200'>
                        <div
                            className='flex items-center justify-between'
                            onClick={() => setOpenSelectCoupon(!openSelectCoupon)}
                        >
                            <p className='font-semibold'>Show applicable coupons</p>
                            <IoIosArrowDown />
                        </div>
                        <div className={`transition-opacity duration-200 ease-in-out overflow-hidden ${openSelectCoupon ? 'opacity-1 h-auto' : 'opacity-0 h-0'} duration-300`}>
                            {<div>
                                {
                                    coupons.map((coupon, i) => (
                                        <div key={i}
                                            className={`w-full mt-2 text-sm rounded-lg border border-neutral-300 ${coupon.code === appliedCoupon.code ? 'bg-neutral-700 text-white' : ''} p-2`}
                                            onClick={() => handleApplyCoupon(coupon)}
                                        >
                                            <p>{coupon.code}</p>
                                            <p>Save upto {coupon.discount}% for your order</p>
                                        </div>
                                    ))
                                }
                            </div>
                            }
                        </div>
                    </div>
                }
            </div>
        </div>
    )
}

ApplyCoupon.propTypes = {
    cartItems: PropTypes.array
}

export default ApplyCoupon