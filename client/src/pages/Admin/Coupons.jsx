import toast from "react-hot-toast"
import { useAddCouponMutation, useDeleteCouponMutation, useGetAllCouponsQuery } from "../../store/api/adminApiSlice"
import CouponTable from "../../components/CouponTable"

function Coupons() {
    const { data: coupons, isLoading: isCouponsLoading } = useGetAllCouponsQuery()
    const [addCoupon] = useAddCouponMutation()
    const [deleteCoupon] = useDeleteCouponMutation()

    async function handleAddCoupon(data) {
        const { code, discount, expirationDate, minPurchaseAmount } = data
        try {
            const res = await addCoupon({ code, discount, expirationDate, minPurchaseAmount }).unwrap()
            toast(res?.message)
        } catch (error) {
            toast(res?.data?.message)
        }

    }

    async function handleDeleteCoupon(couponId) {
        try {
            const res = await addCoupon({ code, discount, expirationDate, minPurchaseAmount }).unwrap()
            toast(res?.message)
        } catch (error) {
            toast(res?.data?.message)
        }

    }

    return (
        <div className='border border-black w-full ml-4 rounded-lg bg-neutral-50 shadow-inner pt-[40px] px-[20px]'>
            <CouponTable
                coupons={coupons}
                isCouponsLoading={isCouponsLoading}
                handleAddCoupon={handleAddCoupon}
                handleDeleteCoupon={handleDeleteCoupon}
            />
        </div>
    )
}

export default Coupons