import _ from 'lodash'
import PropTypes from 'prop-types'
import React, { useEffect, useState } from 'react'
import { SlEye } from "react-icons/sl";
import { format, parseISO } from 'date-fns'
import OrderViewModal from './OrderViewModal';
import StatusChip from './StatusChip';


function OrderTable({ orders, changeOrderStatus }) {
    const [openViewModal, setOpenViewModal] = useState(false)
    const [orderDetail, setOrderDetail] = useState({})

    useEffect(() => {
        const order = orders.find((order => order.orderId === orderDetail?.orderId))
        setOrderDetail(order)
    }, [orders, orderDetail])

    return (
        <>
            <table className="w-full text-sm text-left rtl:text-right text-gray-500">
                <thead className="text-xs text-gray-700 uppercase bg-neutral-300">
                    <tr>
                        <th className="px-6 py-3">
                            Order ID
                        </th>
                        <th>
                            Order Date
                        </th>
                        <th className="px-6 py-3">
                            Order Amount
                        </th>
                        <th className="px-6 py-3">
                            Payment Status
                        </th>
                        <th className="pl-6 py-3">
                            Payment Method
                        </th>
                        <th className="pl-2">

                        </th>

                    </tr>
                </thead>
                <tbody>
                    {orders.map((order, i) => {
                        return (
                            <React.Fragment key={i}>
                                <tr onClick={() => {
                                    setOrderDetail(order)
                                    setOpenViewModal(true)
                                }} className="border-b border-b-[#e7e0e0] text-black">
                                    <td className="px-6 py-4 font-medium text-black whitespace-nowrap ">
                                        {order.orderId}
                                    </td>
                                    <td className=" py-4">
                                        {format(parseISO(order.createdAt), 'dd MMM, yyy')}
                                    </td>
                                    <td className="px-6 py-4">
                                        {order.totalAmount}
                                    </td>
                                    <td className="px-6 py-4">
                                        <StatusChip status={order.payment.status} />
                                    </td>
                                    <td className="pl-6 py-4">
                                        {_.startCase(order.payment.method)}
                                    </td>
                                    <td className="">
                                        <button className='flex px-4 py-2 border border-neutral-800 items-center justify-center rounded-md gap-2'><SlEye />Preview</button>
                                    </td>
                                </tr>

                            </React.Fragment>
                        )
                    })}
                </tbody>
            </table>
            {openViewModal && <OrderViewModal
                orderDetail={orderDetail}
                onClose={() => setOpenViewModal(false)}
                changeOrderStatus={changeOrderStatus}
            />}
        </>
    )
}

OrderTable.propTypes = {
    changeOrderStatus: PropTypes.func,
    orders: PropTypes.arrayOf(Object)
}

export default OrderTable

