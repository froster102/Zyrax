import { selectCartSummary } from '@/store/slices/userSlice'
import { useSelector } from 'react-redux'

function CartSummary() {
    const cartSummary = useSelector(selectCartSummary)

    return (
        <div className="md:mt-0 mt-4 text-nowrap">
            <p className='text-lg font-semibold'>Order Summary</p>
            <div className="w-full h-fit border border-[#CFCBCB] rounded-lg py-4 bg-white font-medium">
                <p className="flex justify-between border-b border-[#CFCBCB]  px-4 pb-2"><span>Price Total<span>(Incl. of all taxes)</span></span><span className="text-right pl-2">{`₹ ${cartSummary.mrpTotal}`}</span></p>
                <p className="flex justify-between border-b border-[#CFCBCB] py-2 px-4">Offer Discount <span className="text-right">₹{cartSummary.offerAmount}</span></p>
                <p className="flex justify-between border-b border-[#CFCBCB] py-2 px-4">Coupon Discount <span className="text-right">₹{cartSummary.totalCouponDiscount}</span></p>
                <p className="flex justify-between border-b border-[#CFCBCB] py-2 px-4">Shipping Charges <span className="text-right">₹{0}</span></p>
                <p className="text-lg font-semibold flex justify-between px-4">Total Amount <span className="font-semibold ">{`₹ ${cartSummary.totalCartAmount}`}</span></p>
            </div>
        </div>
    )
}

export default CartSummary


