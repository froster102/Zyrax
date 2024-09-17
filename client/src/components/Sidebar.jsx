import { GrAnalytics } from "react-icons/gr";
import { IoMdAnalytics } from "react-icons/io";
import { FaBox, FaUsers } from "react-icons/fa";
import { RiShoppingBag3Line } from "react-icons/ri";
import { MdManageHistory } from "react-icons/md";
import { MdPayments } from "react-icons/md";
import { RiRefund2Line } from "react-icons/ri";
import { MdAssignmentReturn } from "react-icons/md";
import { IoNotifications } from "react-icons/io5";
import { IoMdSettings } from "react-icons/io";
import { Link } from "react-router-dom";
import { useDispatch } from "react-redux";
import { userLogout } from "../store/slices/authSlice";
import { useAdminLogoutMutation } from "../store/api/adminApiSlice";
import { BeatLoader } from "react-spinners";



function Sidebar() {
    const dispatch = useDispatch()
    const [logout, { isLoading }] = useAdminLogoutMutation()

    async function adminLogout() {
        try {
            const res = await logout()
            dispatch(userLogout())
            console.log(res)
        } catch (error) {
        }
    }

    return (
        <>
            <div className='pt-24 pb-12 px-[40px] border-[1px] border-black w-fit rounded-lg bg-[#F1F1F1]'>
                <div>
                    <h1 className='font-bold'>
                        Main Menu
                    </h1>
                    <ul className='ml-4 mt-4'>
                        <Link to='/admin/dashboard/'><li className='text-lg flex items-center font-normal mt-4'><GrAnalytics className="mr-2 " />Overview</li></Link>
                        <Link to='/admin/dashboard/analytics' ><li className='text-lg flex items-center font-normal mt-4'><IoMdAnalytics className="mr-2" />Analytics</li></Link>
                        <Link to='/admin/dashboard/products'><li className='text-lg flex items-center font-normal mt-4'><FaBox className="mr-2" />Products</li></Link>
                        <Link to='/admin/dashboard/users'><li className='text-lg flex items-center font-normal mt-4'><FaUsers className="mr-2" />Users</li></Link>
                        <Link to='/admin/dashboard/orders' ><li className='text-lg flex items-center font-normal mt-4'><RiShoppingBag3Line className="mr-2" />Orders</li></Link>
                        <Link to='/admin/dashboard/manage'><li className='text-lg flex items-center font-normal mt-4'><MdManageHistory className="mr-2" />Manage</li></Link>
                    </ul>
                </div>
                <div className="mt-4">
                    <h1 className='font-bold'>Transaction</h1>
                    <ul>
                        <ul className='ml-4 mt-4'>
                            <Link to='/admin/dashboard/payments' ><li className='text-lg flex items-center font-normal mt-4'><MdPayments className="mr-2 " />Payments</li></Link>
                            <Link to='/admin/dashboard/refunds' ><li className='text-lg flex items-center font-normal mt-4'><RiRefund2Line className="mr-2" />Refunds</li></Link>
                            <Link to='/admin/dashboard/returns' ><li className='text-lg flex items-center font-normal mt-4'><MdAssignmentReturn className="mr-2" />Returns</li></Link>
                        </ul>
                    </ul>
                </div>
                <div className="mt-4">
                    <h1 className='font-bold'>
                        General
                    </h1>
                    <ul className='ml-4 mt-4'>
                        <Link to='/admin/dashboard/notifications' ><li className='text-lg flex items-center font-normal mt-4'><IoNotifications className="mr-2 " />Notifications</li></Link>
                        <Link to='/admin/dashboard/settings' ><li className='text-lg flex items-center font-normal mt-4'><IoMdAnalytics className="mr-2" />Settings</li></Link>
                        <li onClick={() => {

                        }} className='text-lg flex items-center font-normal mt-4'><IoMdSettings className="mr-2" />Dark mode</li>
                    </ul>
                </div>
                <div className="w-full flex justify-center">
                    <button onClick={adminLogout} className=" w-full py-2 bg-black text-white rounded-3xl font-medium mt-20 flex justify-center items-center    ">{isLoading ? <BeatLoader color="white" /> : 'Logout'}</button>
                </div>
            </div>
        </>
    )
}

export default Sidebar