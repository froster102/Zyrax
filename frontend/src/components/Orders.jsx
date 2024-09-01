import { useFetchUserOrdersQuery } from "../features/userApiSlice"

function Orders() {
  const { data: orders, isLoading: isOrderLoading } = useFetchUserOrdersQuery()
  if(!isOrderLoading){
    // console.log(orders)
  }
  return (
    <>
      <div className="border max-w-[824px] h-full p-4 rounded-md ">
        {
          !isOrderLoading && <div className="border border-stone-300 bg-stone-200 w-full min-h-[124px] rounded-md">
            <div className="w-44">
                {/* {orders?.products?.} */}
            </div>
          </div>
        }
      </div>
    </>
  )
}

export default Orders