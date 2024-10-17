import toast from "react-hot-toast"
import { useChangeOrderStatusMutation, useFetchOrdersQuery } from "../../store/api/adminApiSlice"
import OrderTable from "../../components/OrderTable"
import { useState } from "react"

function Orders() {
  const [changeUserOrderStatus] = useChangeOrderStatusMutation()
  const [filter, setFilter] = useState({
    limit: 10,
    page: 1
  })
  const { data: { orders = [], totalCount = 0 } = {}, isLoading: isOrderLoading, refetch } = useFetchOrdersQuery({ filter })

  async function changeOrderStatus({ orderId, itemId, status }) {
    try {
      const res = await changeUserOrderStatus({ orderId, itemId, status }).unwrap()
      refetch()
      toast(res?.message)
    } catch (error) {
      ''
    }
  }

  return (
    <>
      <div className='border-[1px] border-black w-full ml-4 rounded-lg bg-neutral-50 shadow-inner pt-[40px] px-[20px]'>
        <h1 className='text-3xl font-semibold'>Orders</h1>
        <div className="relative overflow-x-auto shadow-xl mt-4 bg-neutral-200 rounded-lg">
          {
            !isOrderLoading && <OrderTable
              orders={orders}
              changeOrderStatus={changeOrderStatus}
              filter={filter}
              setFilter={setFilter}
              totalCount={totalCount}
            />
          }
        </div>
      </div>
    </>
  )
}

export default Orders