import { IoSearchOutline } from "react-icons/io5"
import ConfirmationModal from "./ConfirmationModal"
import { useState } from "react"
import { RotatingLines } from "react-loader-spinner"
import StatusChip from "./StatusChip"
import { MdDelete } from "react-icons/md"
import _ from "lodash"
import AddCouponModal from "./AddCouponModal"
import PropTypes from 'prop-types'
import { format, parseISO } from "date-fns"

function CouponTable({ coupons, isCouponsLoading, handleAddCoupon, handleDeleteCoupon }) {
    const [openAddCouponModal, setOpenAddCouponModal] = useState(false)
    const [confirmModalState, setConfirmModalState] = useState({
        show: false,
        action: '',
        onConfirm: () => { },
        message: '',
        onCancel: () => setConfirmModalState(prev => ({
            ...prev,
            show: false
        }))

    })
    const [search, setSearch] = useState('')

    return (
        <>
            <div className='flex justify-between p-4'>
                <div className="w-fit h-full px-2 flex items-center justify-items-center bg-white  rounded-md border border-neutral-400">
                    <IoSearchOutline size={20} color="gray" />
                    <input className='h-[36px] rounded-md w-80 outline-none' type="text" placeholder='Search' value={search} onChange={(e) => setSearch(e.target.value)} />
                </div>
                <button onClick={() => { setOpenAddCouponModal(true) }} className='bg-black px-4 py-2 rounded-full text-white font-medium'>Add coupon</button>
            </div>
            <table className="w-full text-sm text-left rtl:text-right text-gray-500">
                <thead className="text-xs text-black uppercase bg-neutral-300">
                    <tr>
                        <th className="px-6 py-3">
                            Code
                        </th>
                        <th className="px-6 py-3">
                            Min.purchase amount
                        </th>
                        <th className="px-6 py-3">
                            Max.discount amount
                        </th>
                        <th className="px-6 py-3">
                            Status
                        </th>
                        <th className="px-6 py-3">
                            Expiration Date
                        </th>
                        <th className="px-6 py-3">
                            Action
                        </th>
                    </tr>
                </thead>
                <tbody>
                    {
                        isCouponsLoading && <tr className='w-full'>
                            <td colSpan={7} className='w-full'>
                                <div className='flex w-full justify-center items-center'>
                                    <RotatingLines visible={isCouponsLoading} strokeColor='black' strokeWidth='3' />
                                </div>
                            </td>
                        </tr>
                    }
                    {!isCouponsLoading &&
                        coupons.filter((coupon) => {
                            return search.toLowerCase() === ''
                                ? coupon
                                : coupon.code.toLowerCase().includes(search.toLowerCase())
                        }).map((coupon, i) => {
                            return (
                                <tr key={i} className="border-b ">
                                    <td className="px-6 py-4 ">
                                        <p className='text-neutral-900 font-medium text-base'>{coupon.code}</p>
                                    </td>
                                    <td className="px-6 py-4 ">
                                        <p className='text-neutral-900 font-medium text-base'>{coupon.minPurchaseAmount}</p>
                                    </td>
                                    <td className="px-6 py-4 ">
                                        <p className='text-neutral-900 font-medium text-base'>{coupon.maxDiscountAmount}</p>
                                    </td>
                                    <td className="px-6 py-4 ">
                                        <StatusChip status={coupon.status} />
                                    </td>
                                    <td className="px-6 py-4">
                                        <p>{format(parseISO(coupon.expirationDate), 'dd MMM, yyy, h:mm a')}</p>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex gap-2">
                                            <div onClick={() => {
                                                setConfirmModalState(prev => ({
                                                    ...prev,
                                                    show: true,
                                                    action: 'delete',
                                                    onConfirm: () => handleDeleteCoupon(coupon._id),
                                                    message: `Are you sure you want to delete category ${coupon.code} ?`
                                                }))
                                            }} className="w-fit p-1 rounded-md hover:bg-neutral-900 hover:text-white transition ease-in">
                                                <MdDelete size={20} />
                                            </div>
                                        </div>
                                    </td>
                                </tr>
                            )
                        })}
                </tbody>
            </table>
            <ConfirmationModal
                show={confirmModalState.show}
                action={confirmModalState.action}
                onCancel={confirmModalState.onCancel}
                onConfirm={confirmModalState.onConfirm}
                message={confirmModalState.message}
            />
            {
                openAddCouponModal && <AddCouponModal
                    handleAddCoupon={handleAddCoupon}
                    onClose={() => { setOpenAddCouponModal(false) }}
                />
            }
        </>
    )
}

CouponTable.propTypes = {
    coupons: PropTypes.array,
    isCouponsLoading: PropTypes.bool.isRequired,
    handleAddCoupon: PropTypes.func.isRequired,
    handleDeleteCoupon: PropTypes.func.isRequired
}

export default CouponTable