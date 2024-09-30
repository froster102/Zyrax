import { FaWallet } from "react-icons/fa";
import { RotatingLines } from "react-loader-spinner"
import { useCreateWalletMutation, useGetWalletDetailsQuery, useTopUpWalletMutation } from "../store/api/userApiSlice"
import toast from "react-hot-toast"
import ConfirmationModal from "./ConfirmationModal"
import { useState } from "react"
import StatusChip from "./StatusChip"
import AddMoneyModal from "./AddMoneyModal"
import { formatISODate } from "@/utils/helper";

function Wallet() {
  const { data: wallet, isLoading: isWalletLoading, refetch: refetchWallet } = useGetWalletDetailsQuery()
  const [createUserWallet, { isLoading: isWalletCreating }] = useCreateWalletMutation()
  const [topUpUserWallet, { isLoading: isTopUpWalletLoading }] = useTopUpWalletMutation()
  const [openAddMoneyModal, setOpenAddMoneyModal] = useState(false)
  const [confirmModalState, setConfirmModalState] = useState({
    show: false,
    action: 'Proceed',
    onConfirm: createWallet,
    onCancel: () => {
      setConfirmModalState(prev => ({
        ...prev,
        show: false
      }))
    },
    message: ''
  })

  async function createWallet() {
    try {
      const res = await createUserWallet()
      refetchWallet()
      toast(res?.data?.message)
    } catch (error) {
      toast(error?.data?.message)
    }
  }

  async function topUpWallet({ amount }) {
    try {
      const res = await topUpUserWallet({ amount }).unwrap()
      loadRazorpayCheckout(res)
    } catch (error) {
      toast(error?.data?.message)
    }

  }

  function loadScript(src) {
    return new Promise((resolve) => {
      const script = document.createElement('script')
      script.src = src
      script.onload = () => resolve(true)
      script.onerror = () => resolve(false)
      document.body.appendChild(script)
    })
  }

  async function loadRazorpayCheckout(orderData) {
    try {
      const res = await loadScript('https://checkout.razorpay.com/v1/checkout.js')
      if (!res) {
        toast('Failed to load payment page please try again later')
        return
      }
      const options = {
        "key": import.meta.env.VITE_RAZORPAY_KEY,
        "amount": orderData.amount,
        "currency": "INR",
        "name": "The Zyrax Store",
        "description": "Proceed with your suitable payment",
        "image": "https://example.com/your_logo",
        "order_id": orderData.id,
        "callback_url": import.meta.env.VITE_RAZORPAY_WALLET_CALLBACKURL,
        "notes": {
          "address": "The Zyrax Store  Office"
        },
        "theme": {
          "color": "#3399cc"
        }

      }
      const paymentObject = new window.Razorpay(options)
      paymentObject.open()
    } catch (error) {
      toast('Failed to load payment page please try again later')
    }

  }

  return (
    <>
      <div>Wallet</div>
      <div className="border border-[#CFCBCB] rounded-md bg-neutral-50 py-4 sm:px-8 px-4 flex gap-4 w-full h-full">
        {
          isWalletLoading ?
            <div className="flex justify-center items-center">
              <RotatingLines />
            </div> : !wallet ? <div className="flex w-full justify-center items-center">
              <div className="border border-neutral-300 rounded-md px-10 py-6 bg-neutral-300">
                <p className="text-lg">You have not created your wallet</p>
                <button disabled={isWalletCreating} onClick={() => {
                  setConfirmModalState(prev => ({
                    ...prev,
                    message: 'You are about to create your wallet',
                    show: true
                  }))
                }} className="rounded-md w-full text-center py-2 mt-4 bg-neutral-900 text-white">Create Wallet</button>
              </div>
            </div>
              : <>
                <div className="h-[439px] min-w-[329px] bg-neutral-950 rounded-lg py-5 shadow-lg flex flex-col justify-between items-center">
                  <p className="text-white font-bold text-center text-4xl">Zyrax Wallet</p>
                  <div>
                    <p className="text-white font-bold text-center text-4xl pt-10">Balance</p>
                    <p className="text-white font-bold text-center text-4xl pt-4">₹{wallet?.balance}</p>
                  </div>
                  <div className="px-4 w-full">
                    <button onClick={() => setOpenAddMoneyModal(true)} className="w-full border border-neutral-200 text-center text-white rounded-lg py-2">Add money</button>
                  </div>
                </div>
                <div className="border border-neutral-300 rounded-lg overflow-hidden w-full">
                  <table className="text-sm text-left rtl:text-right text-gray-500 rounded-lg w-full" >
                    <thead className="text-xs text-gray-700 uppercase bg-neutral-300">
                      <tr>
                        <th className="px-6 py-3">
                          Transaction ID
                        </th>
                        <th>
                          Amount
                        </th>
                        <th className="px-6 py-3">
                          Transaction Type
                        </th>
                        <th className="px-6 py-3">
                          Date
                        </th>
                        <th className="px-6 py-3">
                          Status
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {wallet?.transactions.map((transaction, i) => (
                        <tr key={i} className="text-black">
                          <td className="px-6 py-4 font-medium text-black whitespace-nowrap ">
                            {transaction?.txnid}
                          </td>
                          <td className="py-4">
                            {transaction?.amount}
                          </td>
                          <td className="px-6 py-4">
                            {transaction?.type}
                          </td>
                          <td className="px-6 py-4">
                            {formatISODate(transaction?.createdAt)}
                          </td>
                          <td className="px-6 py-4">
                            <StatusChip status={transaction?.status} />
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </>
        }
      </div>
      <ConfirmationModal
        show={confirmModalState.show}
        action={confirmModalState.action}
        onCancel={confirmModalState.onCancel}
        onConfirm={confirmModalState.onConfirm}
        message={confirmModalState.message}
      />
      {openAddMoneyModal && <AddMoneyModal
        closeModal={() => setOpenAddMoneyModal(false)}
        onSumbit={topUpWallet}
      />}
    </>

  )
}

export default Wallet