import _ from 'lodash'
import PropTypes from 'prop-types'
import { useEffect, useState } from 'react'
import { SlEye } from "react-icons/sl";
import OrderViewModal from './OrderViewModal';
import StatusChip from './StatusChip';
import { formatISODate } from '../utils/helper';
import Pagination from './Pagination';

function OrderTable({ filter, totalCount, setFilter, orders, changeOrderStatus }) {
    const [openViewModal, setOpenViewModal] = useState(false)
    const [orderDetail, setOrderDetail] = useState({})

    useEffect(()=>{
        if(orderDetail?.orderId){
            setOrderDetail(orders.find(order=>order?.orderId===orderDetail?.orderId))
        }
    },[orderDetail,orders])

    function setPage(page) {
        setFilter(prev => ({
            ...prev,
            page: page
        }))
    }

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
                            <tr key={i} onClick={() => {
                                setOrderDetail(order)
                                setOpenViewModal(true)
                            }} className="border-b border-b-neutral-300  text-black">
                                <td className="px-6 py-4 font-medium text-black whitespace-nowrap ">
                                    {order.orderId}
                                </td>
                                <td className=" py-4">
                                    {formatISODate(order.createdAt)}
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
                                    <button className='flex p-1 text-sm font-medium border border-neutral-800 items-center justify-center rounded-md gap-2'><SlEye />Preview</button>
                                </td>
                            </tr>
                        )
                    })}
                </tbody>
            </table>
            <div className="flex w-full h-fit items-center justify-between px-4 py-2">
                <p className="justify-self-start font-medium">Total {totalCount} orders</p>
                <Pagination
                    totalPages={Math.ceil(totalCount / filter.limit)}
                    currentPage={filter.page}
                    onPageChange={setPage}
                />
            </div>
            {openViewModal && <OrderViewModal
                orderDetail={orderDetail}
                onClose={() => setOpenViewModal(false)}
                changeOrderStatus={changeOrderStatus}
            />}
        </>
    )
}

OrderTable.propTypes = {
    filter: PropTypes.object,
    setFilter: PropTypes.func,
    totalCount: PropTypes.number,
    changeOrderStatus: PropTypes.func,
    orders: PropTypes.arrayOf(Object)
}

export default OrderTable

