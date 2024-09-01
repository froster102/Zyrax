import _ from 'lodash'
import PropTypes from 'prop-types'

function OrderTable({ orders, changeOrderStatus }) {
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
                        <th className="px-6 py-3">
                            Order Status
                        </th>
                        <th className="px-6 py-3">
                            Payment Status
                        </th>
                        <th className="px-6 py-3">
                            Payment Method
                        </th>

                    </tr>
                </thead>
                <tbody>
                    {orders.map((order, i) => {
                        return (
                            <tr key={i} className="border-b border-b-[#e7e0e0] text-black">
                                <td className="px-6 py-4 font-medium text-black whitespace-nowrap ">
                                    {order._id}
                                </td>
                                <td className=" py-4">
                                    {order.createdAt}
                                </td>
                                <td className="px-6 py-4">
                                    {order.totalAmount}
                                </td>
                                <td className="px-6 py-4">
                                    <select
                                        className='px-2 py-1 rounded-md text-white bg-stone-800'
                                        value={order.status} onChange={(e) => { changeOrderStatus({ orderId: order._id, status: e.target.value }) }}>
                                        <option value="pending">Pending</option>
                                        <option value="confirmed">Confirmed</option>
                                        <option value="shipped">Shipped</option>
                                        <option value="delivered">Delivered</option>
                                        <option value="cancelled">Cancelled</option>
                                    </select>
                                </td>
                                <td className="px-6 py-4">
                                    {order.payment.status}
                                </td>
                                <td className="px-6 py-4">
                                    {_.startCase(order.payment.method)}
                                </td>
                            </tr>
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