import { RotatingLines } from "react-loader-spinner"
import { useFetchUserOrdersQuery } from "../store/api/userApiSlice"
import _ from "lodash"
import { useNavigate } from "react-router-dom"
import { format, parseISO } from 'date-fns'
import StatusChip from './StatusChip'
import { useEffect } from "react"
import { useSelector } from "react-redux"
import { selectDefaultDeliveryAddress } from "@/store/slices/userSlice"
import { pdf } from "@react-pdf/renderer"
import Invoice from "./Invoice"

function Orders() {
  const { data: orders, isLoading: isOrderLoading, refetch: refetchOrders } = useFetchUserOrdersQuery()
  const navigate = useNavigate()
  const defaultDeliveryAddress = useSelector(selectDefaultDeliveryAddress)

  useEffect(() => {
    refetchOrders()
  }, [refetchOrders])

  async function generateInvoice(order) {
    const blob = await pdf(<Invoice order={order} />).toBlob()
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `OD${order.orderId}.pdf`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  return (
    <>
      {isOrderLoading ? <div className='flex w-full justify-center items-center'>
        <RotatingLines strokeColor='black' width='100' strokeWidth='2' />
      </div>
        : orders.map((order, i) => (
          <div key={i}>
            <div className="border border-neutral-300 max-w-[824px] pb-4 rounded-md mt-4 relative">
              <div className="bg-neutral-200 rounded-t-md p-2 flex justify-between">
                <div className="flex gap-4">
                  <p className="text-sm">Order ID: {order.orderId}</p>
                  <p onClick={() => generateInvoice(order)} className="text-sm text-blue-900 cursor-pointer">Invoice</p>
                </div>
                <div className="flex justify-center items-center gap-2">
                  <p className="text-sm">{format(parseISO(order.createdAt), 'dd MMM, yyy')}</p>
                  {
                    order.status === 'failed' && <button
                      onClick={() => {
                        if (defaultDeliveryAddress) {
                          navigate('/checkout', { state: { from: 'orders', mode: 'retry', orderId: order.orderId } })
                        } else {
                          navigate('/select-address', { state: { from: 'orders', mode: 'retry', orderId: order.orderId } })
                        }
                      }}
                      className="px-4 py-2 rounded-lg text-sm bg-neutral-800 text-white">Retry Payment</button>
                  }
                </div>
              </div>
              {
                order.products.map((product, i) => (
                  <div key={i} className="px-4">
                    <div onClick={() => navigate(`/account/orders/details?orderId=${order.orderId}&productId=${product.productId._id}`)} className="border border-neutral-300 bg-neutral-200 w-full min-h-[124px] rounded-md p-4 mt-4">
                      <div className="flex">
                        <img className="w-20" src={product.productId.imageUrls[0]} alt="" />
                        <div className="pl-4">
                          <p className="font-normal">{_.startCase(product.productId.name)}</p>
                          <div className="flex items-center py-2">
                            <p className="text-xs font-light">Size : {_.startCase(product.size)}</p>
                            <p className="text-xs font-light px-2">|</p>
                            <p className="text-xs font-light">Qty : {_.startCase(product.quantity)}</p>
                          </div>
                          <StatusChip status={product.status} />
                        </div>
                      </div>
                    </div>
                  </div>
                ))
              }
            </div >
          </div>

        ))
      }
    </>
  )
}

export default Orders