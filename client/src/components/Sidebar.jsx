import { GrAnalytics } from "react-icons/gr";
import { FaBox, FaToggleOff, FaUsers } from "react-icons/fa";
import { RiCoupon3Fill, RiShoppingBag3Line } from "react-icons/ri";
import { GiVerticalBanner } from "react-icons/gi";
import { MdPayments } from "react-icons/md";
import { RiRefund2Line } from "react-icons/ri";
import { MdAssignmentReturn } from "react-icons/md";
import { IoNotifications } from "react-icons/io5";
import { IoMdSettings } from "react-icons/io";
import { Link, useLocation } from "react-router-dom";
import { useDispatch } from "react-redux";
import { userLogout } from "../store/slices/authSlice";
import { useAdminLogoutMutation } from "../store/api/adminApiSlice";
import { BeatLoader } from "react-spinners";
import toast from "react-hot-toast";
import { BiSolidCategory, BiSolidOffer } from "react-icons/bi";
import { useEffect } from "react";

function Sidebar() {
    const dispatch = useDispatch()
    const [logout, { isLoading }] = useAdminLogoutMutation()
    const { pathname } = useLocation()

    useEffect(() => {
        const tabs = pathname.split('')
        console.log(tabs)
    }, [pathname])

    async function adminLogout() {
        try {
            const res = await logout()
            dispatch(userLogout())
            toast(res?.message)
        } catch (error) {
            toast(error?.data?.message)
        }
    }

    return (
        <>
            <div className='py-10 pb-12 px-[40px] border-[1px] border-neutral-600 w-fit rounded-lg bg-[#F1F1F1]'>
                <div>
                    <h1 className='font-bold'>
                        Main Menu
                    </h1>
                    <ul className='ml-4 pt-4'>
                        <Link to='/admin/dashboard/'><li className='text-lg flex items-center font-normal'><GrAnalytics className="mr-2 " />Overview</li></Link>
                        <Link to='/admin/dashboard/products'><li className='text-lg flex items-center font-normal pt-4'><FaBox className="mr-2" />Products</li></Link>
                        <Link to='/admin/dashboard/users'><li className='text-lg flex items-center font-normal pt-4'><FaUsers className="mr-2" />Users</li></Link>
                        <Link to='/admin/dashboard/orders' ><li className='text-lg flex items-center font-normal pt-4'><RiShoppingBag3Line className="mr-2" />Orders</li></Link>
                        <Link to='/admin/dashboard/category' ><li className='text-lg flex items-center font-normal pt-4'><BiSolidCategory className="mr-2" />Category</li></Link>
                        <Link to='/admin/dashboard/offers'><li className='text-lg flex items-center font-normal pt-4'><BiSolidOffer className="mr-2" />Offer</li></Link>
                        <Link to='/admin/dashboard/coupons' ><li className='text-lg flex items-center font-normal pt-4'><RiCoupon3Fill className="mr-2" />Coupons</li></Link>
                        <Link to='/admin/dashboard/banners' ><li className='text-lg flex items-center font-normal pt-4'><GiVerticalBanner className="mr-2" />Banner</li></Link>
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
                        <Link to='/admin/dashboard/settings' ><li className='text-lg flex items-center font-normal mt-4'><IoMdSettings className="mr-2" />Settings</li></Link>
                        <li onClick={() => {

                        }} className='text-lg flex items-center font-normal mt-4'><FaToggleOff className="mr-2" />Dark mode</li>
                    </ul>
                </div>
                <div className="w-full flex justify-center">
                    <button onClick={adminLogout} className=" w-full py-2 bg-black text-white rounded-3xl font-medium mt-4 flex justify-center items-center    ">{isLoading ? <BeatLoader color="white" /> : 'Logout'}</button>
                </div>
            </div>
        </>
    )
}

export default Sidebar