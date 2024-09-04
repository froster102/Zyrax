import { RotatingLines } from "react-loader-spinner"
import { useFetchUserOrdersQuery } from "../features/userApiSlice"
import _ from "lodash"
import { useEffect } from "react"
import { useNavigate } from "react-router-dom"

function Orders() {
  const { data: orders, isLoading: isOrderLoading, refetch } = useFetchUserOrdersQuery()
  const navigate = useNavigate()

  useEffect(() => {
    refetch()
  }, [refetch])

  return (
    <>
      {isOrderLoading ? <div className='flex w-full justify-center items-center'>
        <RotatingLines strokeColor='black' width='100' strokeWidth='2' />
      </div>
        : orders.map((order, i) => (
          <div key={i} className="border border-stone-300 max-w-[824px]  pb-4 rounded-md mt-4">
            <div className="bg-stone-200 rounded-t-md p-2 flex justify-between">
              <p className="text-xs">Order ID: {order._id}</p>
              <p className="text-xs">{order.createdAt.split(':')[0].split('T')[0].split('-').reverse().join('-')}</p>
            </div>
            {
              order.products.map((product, i) => (
                <div key={i} className="px-4">
                  <div onClick={() => navigate(`/account/orders/details/${product.productId._id}`, { state: { product: product, orderId: order._id, orderDate: order.createdAt.split(':')[0].split('T')[0].split('-').reverse().join('-') } })} className="border border-stone-300 bg-stone-200 w-full min-h-[124px] rounded-md p-4 mt-4">
                    <div className="flex">
                      <img className="w-20" src={product.productId.imageUrls[0]} alt="" />
                      <div className="pl-4">
                        <p className="font-normal">{_.startCase(product.productId.name)}</p>
                        <div className="flex items-center py-2">
                          <p className="text-xs font-light">Size : {_.startCase(product.size)}</p>
                          <p className="text-xs font-light px-2">|</p>
                          <p className="text-xs font-light">Qty : {_.startCase(product.quantity)}</p>
                        </div>
                        <p className="font-semibold text-sm">{_.startCase(product.status)}</p>
                      </div>
                    </div>
                  </div>
                </div>
              ))
            }
          </div >
        ))
      }
    </>
  )
}

export default Orders