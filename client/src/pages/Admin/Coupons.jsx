import toast, { Toaster } from "react-hot-toast"
import { useAddCouponMutation, useDeleteCouponMutation, useGetAllCouponsQuery } from "../../store/api/adminApiSlice"
import CouponTable from "../../components/CouponTable"

function Coupons() {
    const { data: coupons, isLoading: isCouponsLoading, refetch: refetchCoupons } = useGetAllCouponsQuery()
    const [addCoupon] = useAddCouponMutation()
    const [deleteCoupon] = useDeleteCouponMutation()

    async function handleAddCoupon(data) {
        const { code, discount, expirationDate, minPurchaseAmount, maxDiscountAmount } = data
        try {
            const res = await addCoupon({ code, discount, expirationDate, minPurchaseAmount, maxDiscountAmount }).unwrap()
            toast(res?.message)
            refetchCoupons()
        } catch (error) {
            toast(error?.data?.message)
        }

    }

    async function handleDeleteCoupon(couponId) {
        try {
            const res = await deleteCoupon({ couponId }).unwrap()
            toast(res?.message)
        } catch (error) {
            toast(error?.data?.message)
        }

    }

    return (
        <div className='border border-black w-full ml-4 rounded-lg bg-neutral-50 shadow-inner pt-[40px] px-[20px]'>
            <Toaster
                position="top-center"
                toastOptions={{
                    style: {
                        backgroundColor: 'black',
                        color: 'white',
                    },
                    duration: 2000
                }}
            />
            <div className='bg-neutral-200 rounded-lg shadow-xl mt-4 w-full'>
                <CouponTable
                    coupons={coupons}
                    isCouponsLoading={isCouponsLoading}
                    handleAddCoupon={handleAddCoupon}
                    handleDeleteCoupon={handleDeleteCoupon}
                    refetchCoupons={refetchCoupons}
                />
            </div>
        </div>
    )
}

export default Coupons