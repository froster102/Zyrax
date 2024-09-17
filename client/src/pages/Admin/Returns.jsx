import { RotatingLines } from "react-loader-spinner"
import { useGetAllReturnsQuery } from "../../store/api/adminApiSlice"


function Returns() {
  const { data: returns, isLoading: isReturnsLoading } = useGetAllReturnsQuery()
  return (
    <div className="pl-10">
      <table className="w-full text-sm text-left rtl:text-right shadow-xl text-gray-500 bg-neutral-200">
        <thead className="text-xs text-gray-700 uppercase bg-neutral-300 ">
          <tr>
            <th className="px-6 py-3">
              Product
            </th>
            <th className="px-6 py-3">
              User
            </th>
            <th className="px-6 py-3">
              Price
            </th>
            <th className="px-6 py-3">
              Request Date
            </th>
            <th className="px-6 py-3">
              Status
            </th>
          </tr>
        </thead>
        <tbody>
          {
            isReturnsLoading && <tr className="w-full">
              <td colSpan={7} className="w-full">
                <div className="flex justify-center items-center overflow-hidden">
                  <RotatingLines visible={isReturnsLoading} strokeColor='black' strokeWidth='3' />
                </div>
              </td>
            </tr>
          }
          {!isReturnsLoading && returns.map((return_, i) => {
            return <tr key={i} className="border-b border-neutral-300">
              <td className="px-6 py-3 text-black font-medium text-base flex items-center gap-2">
                <img src={return_.productId.imageUrls[0]} className="w-12" alt="" />
              </td>
              <td className="px-6 py-4">
                {return_.user_id.email}
              </td>
              <td className="px-6 py-4">
                {/* {return_.orderId.products.find(product=>product.productId===return_.productId)} */}
              </td>
              <td className="px-6 py-4">
                {return_.createdAt}
              </td>
              <td className="px-6 py-4">
                {return_.status}
              </td>
              <td className="px-6 py-4">
                {return_.status === 'requested' && <button className="bg-black rounded-md text-white px-2 py-1">Approve</button>}
              </td>
            </tr>
          })}
        </tbody>
      </table>
    </div>
  )
}

export default Returns
