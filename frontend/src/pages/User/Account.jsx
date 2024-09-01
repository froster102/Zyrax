import { Routes, Route, Link } from "react-router-dom"
import { useLogoutUserMutation } from "../../features/userApiSlice"
import { userLogout } from '../../features/authSlice'
import Orders from "../../components/Orders"
import Profile from '../../components/Profile'
import { useDispatch } from "react-redux"
import toast from "react-hot-toast"
import { resetCartAndWishlist } from "../../features/userSlice"
import Address from "../../components/Address"

function Account() {
  const [logoutUser] = useLogoutUserMutation()
  const dispatch = useDispatch()

  async function logout() {
    try {
      await logoutUser()
      dispatch(userLogout())
      dispatch(resetCartAndWishlist())
      toast('User logged out sucessfully')
    } catch (error) {
      toast(error?.data?.message)
    }
  }

  return (
    <div className="lg:flex w-full gap-4 px-[20px] py-10">
      <div className="max-w-[325px] w-full h-fit hidden lg:block">
        <div className="w-full bg-stone-50 rounded-md border border-[#CFCBCB]">
          <ul className="font-semibold">
            <Link to={'orders'} ><li className="border-b border-b-[#CFCBCB] px-4 py-2">Orders</li></Link>
            <li className="border-b border-b-[#CFCBCB] px-4 py-2">Wallet</li>
            <Link to={'profile'} ><li className="border-b border-b-[#CFCBCB] px-4 py-2">Profile</li></Link>
            <li className="px-4 py-2"> {'FAQs'} </li>
          </ul>
        </div>
        <button className="px-4 py-2 w-full rounded-md bg-stone-900 text-white mt-2" >Delete My Account</button>
        <button onClick={logout} className="px-4 py-2 w-full rounded-md bg-stone-900 text-white mt-2" >Logout</button>
      </div>
      <div className="w-full font-medium">
        <Routes>
          <Route path="orders" element={<Orders />} ></Route>
          <Route path="profile" element={<Profile />}></Route>
          <Route path="profile-address" element={<Address />}></Route>
        </Routes>
      </div>
    </div>
  )
}

export default Account