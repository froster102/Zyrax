import { RotatingLines } from "react-loader-spinner"
import { useApproveReturnMutation, useGetAllReturnsQuery } from "../../store/api/adminApiSlice"
import toast from "react-hot-toast"
import { formatISODate } from '../../utils/helper'

function Returns() {
  const { data: returns, isLoading: isReturnsLoading } = useGetAllReturnsQuery()
  const [approveReturn] = useApproveReturnMutation()

  async function handleApproveReturn({ productId, orderId }) {
    try {
      const res = await approveReturn({ productId, orderId }).unwrap()
      toast(res?.message)
    } catch (error) {
      toast(error?.data?.message)
    }
  }

  return (
    <>
      <div className='border border-black w-full ml-4 rounded-lg bg-neutral-50 shadow-inner pt-[40px] px-[20px] pb-10'>
        <h1 className='text-3xl font-semibold'>Returns</h1>
        <div className="relative overflow-x-auto bg-neutral-200 mt-4 shadow-lg rounded-lg">
          <div className="">
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
                    Amount
                  </th>
                  <th className="px-6 py-3">
                    Request Date
                  </th>
                  <th className="px-6 py-3">
                    Approved Date
                  </th>
                  <th className="px-6 py-3">
                    Status
                  </th>
                  <th className="px-6 py-3">
                    Action
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
                  const returnProduct = return_.orderId.products.find(product => product.productId === return_.productId._id)
                  return <tr key={i} className="border-b border-neutral-300 text-black font-medium">
                    <td className="px-6 py-3 text-black font-medium text-base flex items-center gap-2">
                      <img src={return_.productId.imageUrls[0]} className="w-10" alt="" />
                    </td>
                    <td className="px-6 py-4">
                      {return_.user_id.email}
                    </td>
                    <td className="px-6 py-4">
                      {returnProduct.orderPrice}
                    </td>
                    <td className="px-6 py-4">
                      {formatISODate(return_.createdAt)}
                    </td>
                    <td className="px-6 py-4">
                      {return_.approvedAt && formatISODate(return_?.approvedAt)}
                    </td>
                    <td className="px-6 py-4">
                      {return_.status}
                    </td>
                    <td className="px-6 py-4">
                      {return_.status === 'requested' && <button onClick={() => { handleApproveReturn({ productId: return_.productId._id, orderId: return_.orderId._id }) }} className="bg-black rounded-md text-white px-2 py-1">Approve</button>}
                    </td>
                  </tr>
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </>

  )
}

export default Returns
