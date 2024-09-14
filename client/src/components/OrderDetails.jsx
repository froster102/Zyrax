import _ from "lodash"
import { useLocation, useNavigate } from "react-router-dom"
import { useCancelOrderMutation, useGetWalletDetailsQuery, useReturnOrderMutation } from "../features/userApiSlice"
import toast from "react-hot-toast"
import { useState } from "react"
import ReturnRequestModal from "./ReturnRequestModal"

function OrderDetails() {
    const location = useLocation()
    const [openReturnRequestModal, setOpenReturnRequestModal] = useState(false)
    const [returnReason, setReturnReason] = useState('')
    const [additionalRemark, setAdditionalRemark] = useState('')
    const { product, orderDate, orderId } = location.state
    const navigate = useNavigate()
    const [cancelUserOrder] = useCancelOrderMutation()
    const [returnUserOrder] = useReturnOrderMutation()
    const { data: wallet, isLoading: isWalletLoading } = useGetWalletDetailsQuery()

    async function cancelOrder({ orderId, productId }) {
        try {
            const res = await cancelUserOrder({ orderId, productId }).unwrap()
            navigate('/account/orders')
            toast(res?.message)
        } catch (error) {
            toast('Failed to canel order please try after some time')
        }
    }

    async function returnOrder({ productId, orderId, additionalRemarks, reason }) {
        if (!isWalletLoading && !wallet) {
            toast('Wallet is should be created before a return request for the refund amount to be credited')
            navigate('/account/wallet')
            return
        }
        try {
            const res = await returnUserOrder({ productId, orderId, additionalRemarks, reason }).unwrap()
            toast(res?.message)
        } catch (error) {
            toast(error?.data?.message)
        }
    }

    return (
        <>
            <div className="border border-stone-300 bg-stone-200 w-full h-full rounded-md mt-4">
                <div className="bg-stone-300 rounded-t-md p-2 text-sm flex justify-between">
                    <p>{orderId}</p>
                    <p>{orderDate}</p>
                </div>
                <div className="p-5">
                    <div className="flex">
                        <img className="w-24 rounded-md" src={product.productId.imageUrls[0]} alt="" />
                        <div className="pl-4" >
                            <p>{_.startCase(product.productId.name)}</p>
                            <div className="flex py-1">
                                <p className="text-xs font-light">Size : {_.startCase(product.size)}</p>
                                <p className="text-xs font-light px-2">|</p>
                                <p className="text-xs font-light">Qty : {_.startCase(product.quantity)}</p>
                            </div>
                            <p className="">₹ {_.startCase(product.totalPrice)}</p>
                            {
                                product.status === 'delivered' ? <button
                                    onClick={() => {
                                        setOpenReturnRequestModal(true)
                                    }}
                                    className="mt-4 px-2 py-1 border border-stone-500 rounded-md text-sm hover:bg-stone-900 hover:text-white transition ease-in" >Return order
                                </button>
                                    : product.status === 'cancelled' ? <div>
                                        Product has been cancelled
                                    </div>
                                        : product.status === 'return requested' ?
                                            <div>
                                                Product has been requested for a return
                                            </div>
                                            : <button
                                                onClick={() => {
                                                    cancelOrder({ orderId, productId: product.productId._id })
                                                }}
                                                className="mt-4 px-2 py-1 border border-stone-500 rounded-md text-sm hover:bg-stone-900 hover:text-white transition ease-in" >Cancel
                                            </button>
                            }
                        </div>
                    </div>
                </div>
                <div className="border border-stone-300"></div>
                <div>

                </div>
            </div>
            {openReturnRequestModal && <ReturnRequestModal
                reason={returnReason}
                setReason={setReturnReason}
                additionalRemark={additionalRemark}
                setAdditionalRemark={setAdditionalRemark}
                onSubmit={() => returnOrder({ orderId, productId: product.productId._id, reason: returnReason, additionalRemarks: additionalRemark })}
                onClose={() => setOpenReturnRequestModal(false)} />}
        </>
    )
}

export default OrderDetails