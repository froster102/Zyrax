import toast, { Toaster } from "react-hot-toast"
import { useChangeOrderStatusMutation, useFetchOrdersQuery } from "../../features/adminApiSlice"
import OrderTable from "../../components/OrderTable"

function Orders() {
  const { data: orders, isLoading: isOrderLoading, refetch } = useFetchOrdersQuery()
  const [changeUserOrderStatus] = useChangeOrderStatusMutation()

  async function changeOrderStatus({ orderId, status }) {
    try {
      const res = await changeUserOrderStatus({ orderId, status }).unwrap()
      refetch()
      toast(res?.message)
    } catch (error) {
      ''
    }
  }

  return (
    <>
      <Toaster
        position="top-center"
        toastOptions={{
          style: {
            backgroundColor: 'black',
            color: 'white',
          },
          duration: 2000
        }}
      />
      <div className='border-[1px] border-black w-full ml-4 rounded-lg bg-neutral-50 shadow-inner pt-[40px] px-[20px]'>
        <h1 className='text-3xl font-semibold'>Orders</h1>
        <div className="relative overflow-x-auto shadow-xl mt-4 bg-neutral-200 rounded-lg">
          {
            !isOrderLoading && <OrderTable
              orders={orders}
              changeOrderStatus={changeOrderStatus}
            />
          }
        </div>
      </div>
    </>
  )
}

export default Orders