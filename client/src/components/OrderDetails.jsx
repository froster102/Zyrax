import _ from "lodash"
import { useLocation, useNavigate } from "react-router-dom"
import { useCancelOrderMutation, useGetUserOrderDetailsQuery, useGetWalletDetailsQuery, useReturnOrderMutation } from "../store/api/userApiSlice"
import toast from "react-hot-toast"
import { useState } from "react"
import ReturnRequestModal from "./ReturnRequestModal"
import { RotatingLines } from "react-loader-spinner"
import { format, parseISO } from 'date-fns'
import queryString from 'query-string'
import { FaCheckCircle } from "react-icons/fa";

function OrderDetails() {
    const location = useLocation()
    const [openReturnRequestModal, setOpenReturnRequestModal] = useState(false)
    const [returnReason, setReturnReason] = useState('')
    const [additionalRemark, setAdditionalRemark] = useState('')
    const navigate = useNavigate()
    const [cancelUserOrder] = useCancelOrderMutation()
    const [returnUserOrder] = useReturnOrderMutation()
    const { orderId, productId } = queryString.parse(location.search)

    const { data: wallet, isLoading: isWalletLoading } = useGetWalletDetailsQuery()
    const { data: orderDetails, isLoading: isOrderDetailsLoading } = useGetUserOrderDetailsQuery({ orderId, productId })

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
            {
                isOrderDetailsLoading ? <div>
                    <RotatingLines strokeColor="black" strokeWidth="3" />
                </div>
                    : <div>
                        <div className="border border-stone-300 bg-stone-200 w-full h-full rounded-md mt-4">
                            <div className="bg-stone-300 rounded-t-md p-2 text-sm flex justify-between">
                                <p>Order id: {orderDetails.order.orderId}</p>
                                <p>{format(parseISO(orderDetails.order.createdAt), 'dd MMM, yyy')}</p>
                            </div>
                            <div className="p-5">
                                <div className="flex">
                                    <img className="w-24 rounded-md" src={orderDetails.orderItem.productId.imageUrls[0]} alt="" />
                                    <div className="pl-4" >
                                        <p>{_.startCase(orderDetails.orderItem.productId.name)}</p>
                                        <div className="flex py-1">
                                            <p className="text-xs font-light">Size : {_.startCase(orderDetails.orderItem.size)}</p>
                                            <p className="text-xs font-light px-2">|</p>
                                            <p className="text-xs font-light">Qty : {_.startCase(orderDetails.orderItem.quantity)}</p>
                                        </div>
                                        <p className="">₹ {_.startCase(orderDetails.orderItem.totalPrice)}</p>
                                        {
                                            orderDetails.orderItem.status === 'delivered' ? <button
                                                onClick={() => {
                                                    setOpenReturnRequestModal(true)
                                                }}
                                                className="mt-4 px-2 py-1 border border-stone-500 rounded-md text-sm hover:bg-stone-900 hover:text-white transition ease-in" >Return order
                                            </button>
                                                : orderDetails.orderItem.status === 'cancelled' ? <div>
                                                    Product has been cancelled
                                                </div>
                                                    : orderDetails.orderItem.status === 'return requested' ?
                                                        <div>
                                                            Product has been requested for a return
                                                        </div>
                                                        : <button
                                                            onClick={() => {
                                                                cancelOrder({ orderId: orderDetails.order.orderId, productId: orderDetails.orderItem.productId._id })
                                                            }}
                                                            className="mt-4 px-2 py-1 border border-stone-500 rounded-md text-sm hover:bg-stone-900 hover:text-white transition ease-in" >Cancel
                                                        </button>
                                        }
                                    </div>
                                </div>
                            </div>
                            {/* <hr className="border border-stone-300"/> */}
                            <div className="p-5">
                                <div className="px-4">
                                    <div className="flex gap-2 items-start">
                                        <FaCheckCircle className="mt-1" />
                                        <div>
                                            <p>{format(parseISO(orderDetails.order.createdAt), 'dd MMM, yyy, h:mm a')}</p>
                                            <p> Order Placed</p>
                                        </div>
                                    </div>
                                    {
                                        orderDetails.orderItem.shippingDate && <div className="flex gap-2 items-start mt-8">
                                            <FaCheckCircle className="mt-1" />
                                            <div>
                                                <p>{format(parseISO(orderDetails.orderItem.shippingDate), 'dd MMM, yyy, h:mm a')}</p>
                                                <p> Order cancelled</p>
                                            </div>
                                        </div>
                                    }
                                    {
                                        orderDetails.orderItem.cancelledDate && <div className="flex gap-2 items-start mt-8">
                                            <FaCheckCircle className="mt-1" />
                                            <div>
                                                <p>{format(parseISO(orderDetails.orderItem.cancelledDate), 'dd MMM, yyy, h:mm a')}</p>
                                                <p> Order cancelled</p>
                                            </div>
                                        </div>
                                    }

                                </div>
                            </div>
                            <div className="p-5">
                                <p>Shipping To</p>
                                <div className="pl-2">
                                    <p>{_.startCase(orderDetails.order.shipping.addressId.firstName + ' ' + orderDetails.order.shipping.addressId.lastName)}</p>
                                    <p>{_.startCase(orderDetails.order.shipping.addressId.street)}</p>
                                    <p>{_.startCase(orderDetails.order.shipping.addressId.city)}</p>
                                    <p>{_.startCase(orderDetails.order.shipping.addressId.state)} {orderDetails.order.shipping.addressId.pincode}</p>
                                    <p>{_.startCase(orderDetails.order.shipping.addressId?.phoneNumber)}</p>
                                </div>
                            </div>
                        </div>
                        {openReturnRequestModal && <ReturnRequestModal
                            reason={returnReason}
                            setReason={setReturnReason}
                            additionalRemark={additionalRemark}
                            setAdditionalRemark={setAdditionalRemark}
                            onSubmit={() => returnOrder({ orderId: orderDetails.order.orderId, productId: orderDetails.orderItem.productId._id, reason: returnReason, additionalRemarks: additionalRemark })}
                            onClose={() => setOpenReturnRequestModal(false)} />}
                    </div>
            }
        </>
    )
}

export default OrderDetails