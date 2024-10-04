import { useApplyCouponMutation, useGetCouponsQuery, useRemoveCouponMutation } from '../store/api/couponApiSlice'
import { useSelector } from 'react-redux'
import { selectUserToken } from '../store/slices/authSlice'
import { useNavigate } from 'react-router-dom'
import toast from 'react-hot-toast'
import PropTypes from 'prop-types'
import { IoIosArrowDown, IoIosClose } from 'react-icons/io'
import { useState } from 'react'

function ApplyCoupon({ appliedCoupon }) {
    const userAuth = useSelector(selectUserToken)
    const navigate = useNavigate()
    const { data: { coupons = [] } = {} } = useGetCouponsQuery(undefined, { skip: !userAuth })
    const [couponCode, setCouponCode] = useState({
        code: ''
    })
    const [applyUserCoupon] = useApplyCouponMutation()
    const [removeUserCoupon] = useRemoveCouponMutation()
    const [openSelectCoupon, setOpenSelectCoupon] = useState(false)
    const [error, setError] = useState('')

    async function handleApplyCoupon(coupon) {
        try {
            if (coupon.code !== appliedCoupon?.code) {
                const res = await applyUserCoupon({ code: coupon.code }).unwrap()
                toast(res?.message)
            }
        } catch (error) {
            toast(error?.data?.message)
        }
    }

    async function handleRemoveCoupon() {
        try {
            const res = await removeUserCoupon().unwrap()
            toast(res?.message)
        } catch (error) {
            toast(error?.data?.message)
        }
    }

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
                        let value = e.target.value.toUpperCase()
                        setCouponCode({ code: value })
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
                    appliedCoupon?.code && <button
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
                                            className={`w-full mt-2 text-sm rounded-lg border border-neutral-300 ${coupon.code === appliedCoupon?.code ? 'bg-neutral-700 text-white' : ''} p-2`}
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
    appliedCoupon: PropTypes.object,
}

export default ApplyCoupon