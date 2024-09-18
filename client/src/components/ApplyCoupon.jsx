import PropTypes from 'prop-types'
import { useGetCouponsQuery } from '../store/api/couponApiSlice'
import { useSelector } from 'react-redux'
import { selectUserToken } from '../store/slices/authSlice'
import { useNavigate } from 'react-router-dom'
import toast from 'react-hot-toast'

function ApplyCoupon({ handleApplyCoupon, handleValidateCoupon, handleRemoveCoupon }) {
    const userAuth = useSelector(selectUserToken)
    const navigate = useNavigate()
    const { data: coupons } = useGetCouponsQuery(undefined, { skip: !userAuth })

    return (
        <div>
            <div className="w-full h-fit border border-[#CFCBCB] rounded-lg p-5 bg-white mt-6">
                <p className="font-semibold text-lg">Do you have a voucher ?</p>
                <input type="text" className="p-2 border border-neutral-400 rounded-md mt-4 w-full" />
                <button
                    onClick={() => {
                        // toast('Please login to apply coupons')
                        // if (!userAuth) navigate('/login')
                    }}
                    className="block bg-black w-full py-2 text-white mt-2 rounded-lg font-medium">Apply code</button>
            </div>
        </div>
    )
}

ApplyCoupon.propTypes = {
    handleApplyCoupon: PropTypes.func.isRequired,
    handleValidateCoupon: PropTypes.func.isRequired,
    handleRemoveCoupon: PropTypes.func.isRequired
}

export default ApplyCoupon