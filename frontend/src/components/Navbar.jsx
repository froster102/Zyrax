import React, { useEffect, useState } from 'react'
import Dropdown from './Dropdown'
import SearchBar from './SearchBar'
import { IoMdHeartEmpty } from "react-icons/io";
import { useDispatch, useSelector } from 'react-redux';
import { selectUserToken, userLogout } from '../features/authSlice';
import UserDropdown from './UserDropdown';
import 'react-toastify/dist/ReactToastify.css';
import { Link, useLocation } from 'react-router-dom';
import { toast } from 'react-toastify';
import { addToCart, addToWishlist, resetCartAndWishlist, selectCartItems, selectWishlistItems } from '../features/userSlice';
import { useGetUserWishlistItemsQuery, useGetItemsFromUserCartQuery } from '../features/userApiSlice';
import { FaShoppingCart } from "react-icons/fa";
import { BiHeart } from "react-icons/bi";
import { IoSearch } from 'react-icons/io5';

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
  const { data: userWishlistItems, isLoading: isUserWishlistItemsLoading } = useGetUserWishlistItemsQuery(undefined, { skip: !userAuth })
  const { data: userCartItems, isLoading: isUserCartItemsLoading } = useGetItemsFromUserCartQuery(undefined, { skip: !userAuth })

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
    !isUserWishlistItemsLoading && dispatch(addToWishlist(userWishlistItems?.items || []))
  }, [userWishlistItems, isUserWishlistItemsLoading, dispatch])

  useEffect(() => {
    if (!isUserCartItemsLoading) {
      const dispatchCartState = userCartItems?.items.map(item => {
        return {
          product: item.productId,
          selectedSize: item.selectedSize,
          selectedQty: item.selectedQty
        }
      })
      !isUserCartItemsLoading && dispatch(addToCart(dispatchCartState || []))
    }
  }, [userCartItems, isUserCartItemsLoading, dispatch])

  function logoutUser() {
    toast('Logged out sucessfully')
    dispatch(resetCartAndWishlist())
    dispatch(userLogout())
  }

  return (
    <>
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
              <div className='lg:hidden w-fit p-3 rounded-full h-fit flex items-center justify-items-center hover:bg-[#cacaca] transition ease-in'>
                <IoSearch size={20} />
              </div>
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

    </>
  )
}

export default Navbar