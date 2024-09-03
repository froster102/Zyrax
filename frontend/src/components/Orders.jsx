import { useFetchUserOrdersQuery } from "../features/userApiSlice"
import OrdersCard from "./OrdersCard"

function Orders() {
  const { data: orders, isLoading: isOrderLoading } = useFetchUserOrdersQuery()
  if (!isOrderLoading) {
    console.log(orders)
  }
  return (
    <>
      <div className="border max-w-[824px] h-full p-4 rounded-md ">
        {
          !isOrderLoading && <OrdersCard />
        }
      </div>
    </>
  )
}

export default Orders