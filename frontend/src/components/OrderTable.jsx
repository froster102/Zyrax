import _ from 'lodash'
import PropTypes from 'prop-types'
import React, { useState } from 'react'
import { IoIosArrowDown } from "react-icons/io";

function OrderTable({ orders, changeOrderStatus }) {
    const [expandedRow, setExpandedRow] = useState(null)

    function toggleExpand(orderId) {
        setExpandedRow(expandedRow === orderId ? null : orderId)
    }

    // console.log(orders)

    return (
        <>
            <table className="w-full text-sm text-left rtl:text-right text-gray-500">
                <thead className="text-xs text-gray-700 uppercase bg-neutral-300">
                    <tr>
                        <th className="px-6 py-3">
                            Order ID
                        </th>
                        <th>
                            Created At
                        </th>
                        <th className="px-6 py-3">
                            Order Amount
                        </th>
                        {/* <th className="px-6 py-3">
                            Order Status
                        </th> */}
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
                                <tr onClick={() => toggleExpand(order._id)} className="border-b border-b-[#e7e0e0] text-black">
                                    <td className="px-6 py-4 font-medium text-black whitespace-nowrap ">
                                        {order._id}
                                    </td>
                                    <td className=" py-4">
                                        {order.createdAt}
                                    </td>
                                    <td className="px-6 py-4">
                                        {order.totalAmount}
                                    </td>
                                    {/* <td className="px-6 py-4">
                                        <p className='px-2 py-1 rounded-md text-white bg-stone-800 text-center w-20'>
                                            {order.status}
                                        </p>
                                    </td> */}
                                    <td className="px-6 py-4">
                                        {order.payment.status}
                                    </td>
                                    <td className="pl-6 py-4">
                                        {_.startCase(order.payment.method)}
                                    </td>
                                    <td className="">
                                        <IoIosArrowDown size={20} />
                                    </td>
                                </tr>
                                {expandedRow === order._id &&
                                    <tr className='w-full'>
                                        <td colSpan={7} className='w-full'>
                                            <div className='flex justify-center rounded-sm p-4 w-full'>
                                                <div className='border border-stone-300 rounded-md bg-stone-300'>
                                                    <table className="text-sm text-left rtl:text-right text-gray-500" >
                                                        <thead className="text-xs text-gray-700 uppercase">
                                                            <tr>
                                                                <th className="px-6 py-3">
                                                                    Product
                                                                </th>
                                                                <th>
                                                                    Quantity
                                                                </th>
                                                                <th className="px-6 py-3">
                                                                    Size
                                                                </th>
                                                                <th className="px-6 py-3">
                                                                    Unit Price
                                                                </th>
                                                                <th className="px-6 py-3">
                                                                    Total Price
                                                                </th>
                                                                <th className="px-6 py-3">
                                                                    Status
                                                                </th>

                                                            </tr>
                                                        </thead>
                                                        <tbody>
                                                            {order.products.map((product, i) => {
                                                                return (
                                                                    <tr key={i} className="border-b border-b-[#e7e0e0] text-black">
                                                                        <td className="px-6 py-4 font-medium text-black whitespace-nowrap ">
                                                                            <div className='flex items-center'>
                                                                                <img src={product.productId.imageUrls[0]} className='w-12' alt="" />
                                                                                <p className='pl-2'>{_.startCase(product.productId.name)}</p>
                                                                            </div>
                                                                        </td>
                                                                        <td className=" py-4">
                                                                            {product.quantity}
                                                                        </td>
                                                                        <td className="px-6 py-4">
                                                                            {product.size}
                                                                        </td>
                                                                        <td className="px-6 py-4">
                                                                            {product.unitPrice}
                                                                        </td>
                                                                        <td className="px-6 py-4">
                                                                            {product.totalPrice}
                                                                        </td>
                                                                        <td className="px-6 py-4">
                                                                            <select
                                                                                className='px-2 py-1 rounded-md text-white bg-stone-800'
                                                                                value={product.status} onChange={(e) => {
                                                                                    changeOrderStatus({ orderId: order._id, productId: product.productId._id, status: e.target.value })
                                                                                }}>
                                                                                <option value="pending">Pending</option>
                                                                                <option value="confirmed">Confirmed</option>
                                                                                <option value="shipped">Shipped</option>
                                                                                <option value="delivered">Delivered</option>
                                                                                <option value="cancelled">Cancelled</option>
                                                                            </select>
                                                                        </td>
                                                                    </tr>
                                                                )
                                                            })}
                                                        </tbody>
                                                    </table>
                                                </div>

                                            </div>

                                        </td>
                                    </tr>
                                }
                            </React.Fragment>
                        )
                    })}
                </tbody>
            </table>
        </>
    )
}

OrderTable.propTypes = {
    changeOrderStatus: PropTypes.func,
    orders: PropTypes.arrayOf(Object)
}

export default OrderTable

