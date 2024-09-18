import PropTypes from 'prop-types'
import { IoMdClose } from 'react-icons/io'
import { format, add, parseISO } from 'date-fns'
import _ from 'lodash'
import ConfirmationModal from './ConfirmationModal'
import { useState } from 'react'

function OrderViewModal({ orderDetail, onClose, changeOrderStatus }) {
    const [confirmModalState, setConfirmModalState] = useState({
        show: false,
        action: '',
        message: '',
        onConfirm: () => { },
        onCancel: () => {
            setConfirmModalState(prev => ({
                ...prev,
                show: false
            }))
        }
    })

    return (
        <div className="relative z-10" aria-labelledby="view category">
            <div onClick={onClose} className="fixed inset-0 bg-[#f1f1f1] bg-opacity-75 transition-all backdrop-blur-sm"></div>
            <div className="fixed inset-0 z-10 w-screen overflow-y-auto">
                <div className="flex min-h-full justify-center items-center px-2 py-12 text-center ">
                    <div className="relative max-w-[624px] w-full text-left rounded-2xl bg-[#D9D9D9] text-black p-10">
                        <button
                            className="rounded-md p-1 inline-flex items-center justify-center text-black hover:bg-black hover:text-white transition ease-in duration-75 focus:outline-none absolute top-2 right-2"
                            onClick={onClose} >
                            <IoMdClose size={20} />
                        </button>
                        <div className='w-full'>
                            <div className='w-full flex justify-center' >
                                <div className='max-w-[524px] w-full'>
                                    <p className='font-semibold text-xl'>Order Details</p>
                                    <div className='w-full flex justify-between pt-2'>
                                        <p>Order number</p>
                                        <p className='font-bold'>#{orderDetail.orderId}</p>
                                    </div>
                                    <div className='w-full flex justify-between pt-4'>
                                        <p>Date</p>
                                        <p className='font-bold'>{format(parseISO(orderDetail.createdAt), 'dd MMM, yyy')}</p>
                                    </div>
                                    <div className='w-full flex justify-between pt-4'>
                                        <p>Payment Method</p>
                                        <p className='font-bold'>{_.startCase(orderDetail.payment.method)}</p>
                                    </div>
                                    <div className='w-full flex justify-between pt-4'>
                                        <p>Name</p>
                                        <p className='font-bold'>{_.startCase(orderDetail.userId.firstName)}</p>
                                    </div>
                                    <div className='w-full flex justify-between pt-4'>
                                        <p>Address</p>
                                        <p className='font-bold'>
                                            {_.startCase(orderDetail.shipping.addressId.street)}{', '}
                                            {_.startCase(orderDetail.shipping.addressId.city)}{', '}
                                            {_.startCase(orderDetail.shipping.addressId.state)}
                                        </p>
                                    </div>
                                    {orderDetail.userId.phoneNumber &&
                                        <div className='w-full flex justify-between pt-4'>
                                            <p>Phone</p>
                                            <p className='font-bold'>{orderDetail.userId?.phoneNumber}</p>
                                        </div>
                                    }
                                    <div className='w-full flex justify-between pt-4'>
                                        <p>Email</p>
                                        <p className='font-bold'>{orderDetail.userId.email}</p>
                                    </div>
                                    <div className='w-full flex justify-between pt-4'>
                                        <p>Estimated delivery date</p>
                                        <p className='font-bold text-green-600'>{format(add(parseISO(orderDetail.createdAt), { days: 4 }), 'dd MMM, yyy')}</p>
                                    </div>
                                    <p className='font-semibold text-xl pt-4'>Order Items</p>
                                    {orderDetail.products.map((product, i) => (
                                        <div key={i} className='pt-2'>
                                            <div>
                                                <div className='flex justify-between pt-2'>
                                                    <p>Name:</p>
                                                    <p className='font-bold'>{_.startCase(product.productId.name)}</p>
                                                </div>
                                                <div className='flex justify-between pt-2'>
                                                    <p>Quantity:</p>
                                                    <p className='font-bold'>{product.quantity}</p>
                                                </div>
                                                <div className='flex justify-between pt-2'>
                                                    <p>Size:</p>
                                                    <p className='font-bold'>{product.size}</p>
                                                </div>
                                                <div className='flex justify-between pt-2'>
                                                    <p>Delivery status</p>
                                                    <select
                                                        className='ml-4 px-2 py-1 rounded-md text-white bg-neutral-800'
                                                        value={product.status} onChange={(e) => {
                                                            const status = e.target.value
                                                            setConfirmModalState(prev => ({
                                                                ...prev,
                                                                show: true,
                                                                action: 'Change',
                                                                message: `Are you sure you want to change status from ${product.status} to ${e.target.value}`,
                                                                onConfirm: () => changeOrderStatus({ orderId: orderDetail._id, itemId: product._id, status: status })
                                                            }))
                                                        }}>
                                                        <option value="pending">Pending</option>
                                                        <option value="confirmed">Confirmed</option>
                                                        <option value="shipped">Shipped</option>
                                                        <option value="delivered">Delivered</option>
                                                        <option value="cancelled">Cancelled</option>
                                                        <option value="return requested">Return requested</option>
                                                    </select>
                                                </div>
                                            </div>
                                            
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div >

                    </div>
                </div>
            </div>
            <ConfirmationModal
                show={confirmModalState.show}
                action={confirmModalState.action}
                onCancel={confirmModalState.onCancel}
                onConfirm={confirmModalState.onConfirm}
                message={confirmModalState.message}
            />
        </div>
    )
}

OrderViewModal.propTypes = {
    orderDetail: PropTypes.object,
    onClose: PropTypes.func,
    changeOrderStatus: PropTypes.func
}

export default OrderViewModal