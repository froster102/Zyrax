import _ from "lodash"
import { useLocation, useNavigate } from "react-router-dom"
import { useCancelOrderMutation } from "../features/userApiSlice"
import toast from "react-hot-toast"

function OrderDetails() {
    const location = useLocation()
    const { product, orderDate, orderId } = location.state
    const navigate = useNavigate()
    const [cancelUserOrder] = useCancelOrderMutation()

    async function cancelOrder({ orderId, productId }) {
        try {
            const res = await cancelUserOrder({ orderId, productId }).unwrap()
            navigate('/account/orders')
            toast(res?.message)

        } catch (error) {
            toast('Failed to canel order please try after some time')
        }
    }

    return (
        <>
            <div className="border border-stone-300 bg-stone-200 w-full h-full rounded-md mt-4">
                <div className="bg-stone-300 rounded-t-md p-2 text-sm flex justify-between">
                    <p>{product.productId._id}</p>
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
                                product.status !== 'delivered' && product.status !== 'cancelled' ? <button
                                    onClick={() => {
                                        cancelOrder({ orderId, productId: product.productId._id })
                                    }}
                                    className="mt-4 px-2 py-1 border border-stone-500 rounded-md text-sm hover:bg-stone-900 hover:text-white transition ease-in" >Cancel
                                </button>
                                    : <div>
                                        Product has been cancelled
                                    </div>
                            }

                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}

export default OrderDetails