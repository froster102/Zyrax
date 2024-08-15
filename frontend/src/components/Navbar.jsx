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
import { addToCart, addToWishlist, resetCartAndWishlist, selectWishlistItems } from '../features/userSlice';
import { useGetUserWishlistItemsQuery, useGetItemsFromUserCartQuery } from '../features/userApiSlice';
import { FaShoppingCart } from "react-icons/fa";
import { BiHeart } from "react-icons/bi";

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
      <div className={`${hideNav ? 'hidden' : 'block'}`} >
        <div className={`px-[20px] ${sticky ? 'fixed w-full top-0 z-50 drop-shadow-xl' : 'mt-2'} transition ease-in`} onScroll={() => { setSticky(true) }}>
          <div className='bg-white w-full h-[60px] rounded-[20px] p-2 flex gap-4 items-center'>
            <Dropdown title='Topwears' options={topwears} ></Dropdown>
            <Dropdown title={'Bottomwear'} options={bottomwears}></Dropdown>
            <SearchBar></SearchBar>
            <Dropdown title={'Accessories'} options={accessories}></Dropdown>
            <Dropdown title={'Bestsellers'} options={bestsellers}></Dropdown>
            <UserDropdown user={userAuth} logoutUser={logoutUser}></UserDropdown>
            <Link to={'/cart'}><div className='w-fit p-2 rounded-full h-fit border-[1px] border-gray-500 flex items-center justify-items-center hover:bg-[#cacaca] transition ease-in'>
              <FaShoppingCart size={20}/>
            </div></Link>
            <Link to={'/wishlist'} ><div className='w-fit p-2 rounded-full h-fit border-[1px] border-gray-500 flex items-center justify-items-center hover:bg-[#cacaca] transition ease-in'>
              <BiHeart  size={20}/>
            </div></Link>
          </div>
        </div>
      </div>
    </>
  )
}

export default Navbar