import { useEffect, useState } from 'react'
import Dropdown from './Dropdown'
import SearchBar from './SearchBar'
import { useDispatch, useSelector } from 'react-redux';
import { selectUserToken, userLogout } from '../store/slices/authSlice';
import UserDropdown from './UserDropdown';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { resetCartAndWishlist, selectCartItems, selectWishlistItems, selectActiveGender } from '../store/slices/userSlice';
import { useGetAllCategoriesQuery } from '../store/api/productApiSlice';
import { useGetItemsFromUserCartQuery, useGetUserWishlistItemsQuery } from '../store/api/userApiSlice';
import { FaRegUser, FaShoppingCart } from "react-icons/fa";
import { BiHeart } from "react-icons/bi";
import { IoMenu } from "react-icons/io5";
import toast, { Toaster } from 'react-hot-toast';
import { motion } from 'framer-motion';
import Zyrax_icon from '../assets/options-list.png'
import SidebarAccordion from './SidebarAccordion';
import _ from 'lodash';
import { useLogoutUserMutation } from '../store/api/authApiSlice';
import { apiSlice } from '@/store/api/apiSlice';

function Navbar() {
  const [sticky, setSticky] = useState(false)
  const [hideNav, setHideNav] = useState(false)
  const [openListIndex, setOpenListIndex] = useState(null)
  const [openSideBar, setSidebarOpen] = useState(false)
  const { pathname } = useLocation()
  const activeGender = useSelector(selectActiveGender)
  const dispatch = useDispatch()
  const userAuth = useSelector(selectUserToken)
  const localCartItems = useSelector(selectCartItems)
  const localWishlistItems = useSelector(selectWishlistItems)
  const [userSignOut] = useLogoutUserMutation()
  const { data: categories, isLoading: isCategoriesLoading } = useGetAllCategoriesQuery()
  const { data: { userCartItems = [] } = {} } = useGetItemsFromUserCartQuery(undefined, { skip: !userAuth })
  const { data: { userWishlistItems = [] } = {} } = useGetUserWishlistItemsQuery(undefined, { skip: !userAuth })
  const navigate = useNavigate()

  useEffect(() => {
    pathname === '/cart' || pathname === '/checkout' ? setHideNav(true) : setHideNav(false)
  }, [pathname])

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 60) {
        setSticky(true)
      } else {
        setSticky(false)
      }
    }
    window.addEventListener('scroll', handleScroll)

    return () => {
      window.removeEventListener('scroll', handleScroll)
    }

  }, [])

  const wishlistItems = userAuth ? userWishlistItems : localWishlistItems
  const cartItems = userAuth ? userCartItems : localCartItems

  async function logoutUser() {
    try {
      await userSignOut().unwrap()
      toast('Logged out sucessfully')
      dispatch(resetCartAndWishlist())
      dispatch(userLogout())
      dispatch(apiSlice.util.resetApiState())
    } catch (error) {
      toast(error?.data?.message)
    }
  }

  return (
    <>
      <Toaster
        position="top-right"
        toastOptions={{
          style: {
            backgroundColor: 'black',
            color: 'white',
          },
          duration: 2000
        }}
      />
      <div className='lg:max-w-[1600px] lg:block m-auto hidden transition-all ease-in duration-500'>
        <div className={`${hideNav ? 'hidden' : 'block'}`} >
          <div className={`px-[20px] ${sticky ? 'fixed w-full top-0 z-50 drop-shadow-xl' : 'mt-2'} transition ease-in`} onScroll={() => { setSticky(true) }}>
            <div className='bg-neutral-200 max-w-[1600px] h-[60px] rounded-[20px] p-2 flex gap-4 items-center justify-between'>
              {!isCategoriesLoading && categories?.map((category, i) => {
                if (category.parent === null) {
                  return <Dropdown key={i} title={_.startCase(category.name)} subCategories={category.children} />
                }
              })}
              <SearchBar></SearchBar>
              <UserDropdown user={userAuth} logoutUser={logoutUser}></UserDropdown>
              <Link to={'/cart'}><div className='w-fit p-3 rounded-full h-fit flex items-center justify-items-center hover:bg-[#cacaca] transition ease-in relative'>
                {cartItems.length > 0 && <div className='absolute top-0 right-0 h-[14px] rounded-full w-[14px] bg-black text-white flex items-center justify-center p-2 text-xs'>{cartItems.length}</div>}
                <FaShoppingCart size={20} />
              </div></Link>
              <Link to={'/wishlist'} ><div className='w-fit p-2 rounded-full h-fit flex items-center justify-items-center hover:bg-[#cacaca] transition ease-in relative'>
                {
                  wishlistItems.length > 0 && <div className='absolute top-0 right-0 h-[14px] rounded-full w-[14px] bg-black text-white flex items-center justify-center p-2 text-xs'>
                    {wishlistItems.length}
                  </div>
                }
                <BiHeart size={25} />
              </div></Link>
            </div>
          </div>
        </div>
      </div>
      <div className='lg:hidden'>
        <div className={`${hideNav ? 'hidden' : 'block'}`} >
          <div className={`${sticky ? 'fixed w-full top-0 z-50 drop-shadow-xl' : 'mt-2'} transition ease-in`} onScroll={() => { setSticky(true) }}>
            <div className='bg-neutral-200 h-[40px] px-2 flex items-center justify-between'>
              <IoMenu size={30} onClick={() => { setSidebarOpen(!openSideBar) }} />
              <div className='flex gap-1 items-center'>
                <Link to='/account/profile' >
                  <div className='w-[35px] h-[35px] flex items-center justify-center'>
                    <FaRegUser size={20} />
                  </div>
                </Link>
                <Link to={'/cart'}><div className='w-[35px] h-[35px] flex items-center justify-items-center relative'>
                  {cartItems.length > 0 && <div className='absolute top-0 right-0 h-[14px] rounded-full w-[14px] bg-black text-white flex items-center justify-center p-2 text-xs'>{cartItems.length}</div>}
                  <FaShoppingCart size={20} />
                </div></Link>
                <Link to={'/wishlist'}><div className='w-[35px] h-[35px] flex items-center justify-items-center relative'>
                  {
                    cartItems.length > 0 && <div className='absolute top-0 right-0 h-[14px] rounded-full w-[14px] bg-black text-white flex items-center justify-center p-2 text-xs'>
                      {cartItems.length}
                    </div>
                  }
                  <BiHeart size={20} />
                </div></Link>
              </div>
            </div>
          </div>
        </div>
      </div>
      {openSideBar &&
        <>
          <div onClick={() => { setSidebarOpen(!openSideBar) }} className="fixed inset-0 bg-neutral-900 bg-opacity-75 transition-all backdrop-blur-sm z-50"></div>
          <motion.div
            initial={{ x: '-100%' }}
            animate={{ x: 0 }}
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
            className='fixed top-0 left-0 z-50 bg-neutral-300 w-[80%] h-screen p-4'>
            <div className='flex items-center'>
              <img className='w-10 h-10' src={Zyrax_icon} alt="" />
              <h1 className='text-2xl font-bold'>Zyrax.Store</h1>
              <div>
                {
                  !userAuth ? <button className='ml-2 py-1 px-2 text-sm border border-neutral-900 rounded-lg'>Login/Register</button> : <p></p>
                }
              </div>
            </div>
            <div className='flex gap-2 w-full justify-center items-center mt-2'>
              <button onClick={() => {
                navigate('/men')
                setSidebarOpen(false)
              }} className={`px-6 py-2 text-sm rounded-lg ${activeGender === 'men' ? 'bg-black text-white' : 'bg-neutral-200 shadow-md'}`}>Men</button>
              <button onClick={() => {
                navigate('/women')
                setSidebarOpen(false)
              }} className={`px-6 py-2 text-sm rounded-lg ${activeGender === 'women' ? 'bg-black text-white' : 'bg-neutral-200 shadow-md'}`}>Women</button>
            </div>
            <div className='mt-4 w-full'>
              {categories.map((category, i) => {
                if (category.parent === null) {
                  return <SidebarAccordion
                    key={i}
                    title={category.name}
                    index={i} isOpen={openListIndex === i}
                    subCategories={category.children}
                    toggle={(index) => { setOpenListIndex(openListIndex === index ? null : index) }}
                    closeSideBar={() => { setSidebarOpen(false) }}
                  />
                }
              })}
            </div>
          </motion.div>
        </>}
    </>
  )
}

export default Navbar