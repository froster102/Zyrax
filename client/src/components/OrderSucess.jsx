import { useEffect } from 'react'
import { useSelector } from 'react-redux'
import { useLocation, useNavigate } from 'react-router-dom'
import { selectActiveGender } from '../store/slices/userSlice'
import queryString from 'query-string'
import { MdLocalShipping } from "react-icons/md";
import { useGetUserOrderDetailsQuery } from '../store/api/userApiSlice'
import _ from 'lodash'
import { format, parseISO, add } from 'date-fns'


function OrderSucess() {
    const navigate = useNavigate()
    const location = useLocation()
    const activeGender = useSelector(selectActiveGender)
    const { order_id } = queryString.parse(location.search.toString())
    const { data: orderDetails, isLoading: isOrderDetailsLoading } = useGetUserOrderDetailsQuery({ orderId: order_id })
    // useEffect(() => {
    //     if (!location?.state?.orderSucess) {
    //         navigate(`/${activeGender}`)
    //     }
    // }, [navigate, activeGender, location])

    return (
        <>
            {
                !isOrderDetailsLoading && <div>
                    <div className='w-full flex justify-center mt-24 mb-24' >
                        <div className='max-w-[524px]'>
                            <h1 className='text-4xl font-bold'><MdLocalShipping className='inline mr-2' />Thanks for your order!</h1>
                            <p className='font-medium pt-2'>Your order will be processed within 24 hours during working days. We will notify you by email once your order has been shipped.</p>
                            <button
                                onClick={() => navigate('/account/orders', { replace: true })}
                                className='rounded-md px-4 py-2 bg-neutral-800 mt-4 text-white'>Order details</button>
                            <button
                                onClick={() => navigate(`/${activeGender}`, { replace: true })}
                                className='ml-2 rounded-md px-4 py-2 bg-neutral-800 text-white'>Return to shoppping</button>
                            <div className='rounded-md p-4 mt-4 font-medium bg-neutral-300'>
                                <div className='w-full flex justify-between'>
                                    <p>Order number</p>
                                    <p className='font-bold'>#{order_id}</p>
                                </div>
                                <div className='w-full flex justify-between pt-4'>
                                    <p>Date</p>
                                    <p className='font-bold'>{format(parseISO(orderDetails.order.createdAt), 'dd MMM, yyy')}</p>
                                </div>
                                <div className='w-full flex justify-between pt-4'>
                                    <p>Payment Method</p>
                                    <p className='font-bold'>{_.startCase(orderDetails.order.payment.method)}</p>
                                </div>
                                <div className='w-full flex justify-between pt-4'>
                                    <p>Name</p>
                                    <p className='font-bold'>{_.startCase(orderDetails.order.userId.firstName)}</p>
                                </div>
                                <div className='w-full flex justify-between pt-4'>
                                    <p>Address</p>
                                    <p className='font-bold'>
                                        {_.startCase(orderDetails.order.shipping.addressId.street)}{', '}
                                        {_.startCase(orderDetails.order.shipping.addressId.city)}{', '}
                                        {_.startCase(orderDetails.order.shipping.addressId.state)}
                                    </p>
                                </div>
                                {orderDetails.order.userId.phoneNumber &&
                                    <div className='w-full flex justify-between pt-4'>
                                        <p>Phone</p>
                                        <p className='font-bold'>{orderDetails.order.userId?.phoneNumber}</p>
                                    </div>
                                }
                                <div className='w-full flex justify-between pt-4'>
                                    <p>Email</p>
                                    <p className='font-bold'>{orderDetails.order.userId.email}</p>
                                </div>
                                <div className='w-full flex justify-between pt-4'>
                                    <p>Estimated delivery date</p>
                                    <p className='font-bold text-green-600'>{format(add(parseISO(orderDetails.order.createdAt), { days: 4 }), 'dd MMM, yyy')}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div >
            }
        </>

    )
}
export default OrderSucess