import PropTypes from 'prop-types'
import { useGetCouponsQuery } from '../store/api/couponApiSlice'

function ApplyCoupon({ handleApplyCoupon, handleValidateCoupon, handleRemoveCoupon }) {
    const { data: coupons } = useGetCouponsQuery()

    return (
        <div>
            <div className="w-full h-fit border border-[#CFCBCB] rounded-lg p-5 bg-white mt-6">
                <p className="font-semibold text-lg">Do you have a voucher ?</p>
                <input type="text" className="p-2 border border-stone-400 rounded-md mt-4 w-full" />
                <button className="block bg-black w-full py-2 text-white mt-2 rounded-lg font-medium">Apply code</button>
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