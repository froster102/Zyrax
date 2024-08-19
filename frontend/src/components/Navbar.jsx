import React, { useEffect, useState } from 'react'
import Dropdown from './Dropdown'
import SearchBar from './SearchBar'
import { useDispatch, useSelector } from 'react-redux';
import { selectUserToken, userLogout } from '../features/authSlice';
import UserDropdown from './UserDropdown';
import { Link, useLocation } from 'react-router-dom';
import { syncWishlist, syncCart, resetCartAndWishlist, selectCartItems, selectWishlistItems } from '../features/userSlice';
import { useGetUserWishlistItemsQuery, useGetItemsFromUserCartQuery, useLogoutUserMutation } from '../features/userApiSlice';
import { FaRegUser, FaShoppingCart } from "react-icons/fa";
import { BiHeart } from "react-icons/bi";
import { IoMenu } from "react-icons/io5";
import toast, { Toaster } from 'react-hot-toast';


const topwears = ['Shirts', 'Pollos', 'Oversized shirts', 'All T-shirts', 'Jackets']
const bottomwears = ['Jeans', 'Pants', 'Joggers', 'Oversized joggers', 'Track pants']
const accessories = ['Perfumes', 'Wallets', 'Watches']
const bestsellers = ['Top 20 t-shirts', 'Top 20 shirts', 'Top 20 joggers']

function Navbar() {
  const [sticky, setSticky] = useState(false)
  const [hideNav, setHideNav] = useState(false)
  const { pathname } = useLocation()
  const dispatch = useDispatch()
  const userAuth = useSelector(selectUserToken)
  const localCartItems = useSelector(selectCartItems)
  const localWishlistItems = useSelector(selectWishlistItems)
  const [userSignOut] = useLogoutUserMutation()
  const { data: userWishlistItems, isLoading: isUserWishlistItemsLoading, refetch: refetchWishlist } = useGetUserWishlistItemsQuery(undefined, { skip: !userAuth })
  const { data: userCartItems, isLoading: isUserCartItemsLoading, refetch: refetchCart } = useGetItemsFromUserCartQuery(undefined, { skip: !userAuth })
  // const 

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

  useEffect(() => {
    if (userAuth) {
      refetchCart()
      refetchWishlist()
    }
  }, [userAuth, refetchCart, refetchWishlist])

  useEffect(() => {
    !isUserWishlistItemsLoading && userWishlistItems?.items && userAuth && dispatch(syncWishlist(userWishlistItems.items))
  }, [userWishlistItems, isUserWishlistItemsLoading, dispatch])

  useEffect(() => {
    if (!isUserCartItemsLoading && userCartItems?.items && userAuth) {
      const dispatchCartState = userCartItems.items.map(item => {
        return {
          product: item.productId,
          selectedSize: item.selectedSize,
          selectedQty: item.selectedQty
        }
      })
      dispatch(syncCart(dispatchCartState))
    }
  }, [userCartItems, isUserCartItemsLoading, dispatch])

  async function logoutUser() {
    try {
      await userSignOut().unwrap()
      toast('Logged out sucessfully')
      dispatch(resetCartAndWishlist())
      dispatch(userLogout())
    } catch (error) {
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
      <div className='lg:max-w-[1600px] lg:block m-auto hidden'>
        <div className={`${hideNav ? 'hidden' : 'block'}`} >
          <div className={`px-[20px] ${sticky ? 'fixed w-full top-0 z-50 drop-shadow-xl' : 'mt-2'} transition ease-in`} onScroll={() => { setSticky(true) }}>
            <div className='bg-stone-200 max-w-[1600px] h-[60px] rounded-[20px] p-2 flex gap-4 items-center justify-between'>
              <Dropdown title='Topwears' options={topwears} ></Dropdown>
              <Dropdown title={'Bottomwear'} options={bottomwears}></Dropdown>
              <SearchBar></SearchBar>
              <Dropdown title={'Accessories'} options={accessories}></Dropdown>
              <Dropdown title={'Bestsellers'} options={bestsellers}></Dropdown>
              <UserDropdown user={userAuth} logoutUser={logoutUser}></UserDropdown>
              <Link to={'/cart'}><div className='w-fit p-3 rounded-full h-fit flex items-center justify-items-center hover:bg-[#cacaca] transition ease-in relative'>
                {localCartItems.length > 0 && <div className='absolute top-0 right-0 h-[14px] rounded-full w-[14px] bg-black text-white flex items-center justify-center p-2 text-xs'>{localCartItems.length}</div>}
                <FaShoppingCart size={20} />
              </div></Link>
              <Link to={'/wishlist'} ><div className='w-fit p-2 rounded-full h-fit flex items-center justify-items-center hover:bg-[#cacaca] transition ease-in relative'>
                {localWishlistItems.length > 0 && <div className='absolute top-0 right-0 h-[14px] rounded-full w-[14px] bg-black text-white flex items-center justify-center p-2 text-xs'>{localWishlistItems.length}</div>}
                <BiHeart size={25} />
              </div></Link>
            </div>
          </div>
        </div>
      </div>
      <div className='lg:hidden'>
        <div className={`${hideNav ? 'hidden' : 'block'}`} >
          <div className={`${sticky ? 'fixed w-full top-0 z-50 drop-shadow-xl' : 'mt-2'} transition ease-in`} onScroll={() => { setSticky(true) }}>
            <div className='bg-stone-200 h-[40px] px-2 flex items-center justify-between'>
              <IoMenu size={30} />
              <div className='flex gap-1 items-center'>
                <Link to='/profile' >
                  <div className='w-[35px] h-[35px] flex items-center justify-center'>
                    <FaRegUser size={20} />
                  </div>
                </Link>
                <Link to={'/cart'}><div className='w-[35px] h-[35px] flex items-center justify-items-center relative'>
                  {localCartItems.length > 0 && <div className='absolute top-0 right-0 h-[14px] rounded-full w-[14px] bg-black text-white flex items-center justify-center p-2 text-xs'>{localCartItems.length}</div>}
                  <FaShoppingCart size={20} />
                </div></Link>
                <Link to={'/wishlist'}><div className='w-[35px] h-[35px] flex items-center justify-items-center relative'>
                  {localWishlistItems.length > 0 && <div className='absolute top-0 right-0 h-[14px] rounded-full w-[14px] bg-black text-white flex items-center justify-center p-2 text-xs'>{localWishlistItems.length}</div>}
                  <BiHeart size={20} />
                </div></Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export default Navbar