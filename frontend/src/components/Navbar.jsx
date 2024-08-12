import React, { useEffect } from 'react'
import Dropdown from './Dropdown'
import SearchBar from './SearchBar'
import { IoBagHandleOutline } from "react-icons/io5";
import { IoMdHeartEmpty } from "react-icons/io";
import { useDispatch, useSelector } from 'react-redux';
import { selectUserToken, userLogout } from '../features/authSlice';
import UserDropdown from './UserDropdown';
import 'react-toastify/dist/ReactToastify.css';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import { addToWishlist, resetCartAndWishlist, selectWishlistItems } from '../features/userSlice';
import { useAddItemsToUserWishlistMutation, useGetUserWishlistItemsQuery } from '../features/userApiSlice';

const topwears = ['Shirts', 'Pollos', 'Oversized shirts', 'All T-shirts', 'Jackets']
const bottomwears = ['Jeans', 'Pants', 'Joggers', 'Oversized joggers', 'Track pants']
const accessories = ['Perfumes', 'Wallets', 'Watches']
const bestsellers = ['Top 20 t-shirts', 'Top 20 shirts', 'Top 20 joggers']

function Navbar() {
  const dispatch = useDispatch()
  const userAuth = useSelector(selectUserToken)
  const loacalWishlistItems = useSelector(selectWishlistItems)
  const { data: userWishlistItems, isLoading: isUserWishlistItemsLoading } = useGetUserWishlistItemsQuery({}, { skip: !userAuth })
    useEffect(() => {
    console.log(userWishlistItems?.items)
    dispatch(addToWishlist(userWishlistItems?.items || []))
    if (userWishlistItems?.items > 0) {
    }
  }, [userWishlistItems,isUserWishlistItemsLoading])


  function logoutUser() {
    toast('Logged out sucessfully')
    dispatch(resetCartAndWishlist())
    dispatch(userLogout())
  }

  return (
    <>
      <div className='px-[20px]'>
        <div className='bg-white w-full h-[60px] rounded-[20px] mt-4 p-2 flex gap-4 items-center'>
          <Dropdown title='Topwears' options={topwears} ></Dropdown>
          <Dropdown title={'Bottomwear'} options={bottomwears}></Dropdown>
          <SearchBar></SearchBar>
          <Dropdown title={'Accessories'} options={accessories}></Dropdown>
          <Dropdown title={'Bestsellers'} options={bestsellers}></Dropdown>
          <UserDropdown user={userAuth} logoutUser={logoutUser}></UserDropdown>
          <Link to={'/cart'}><div className='w-fit p-2 rounded-full h-fit border-[1px] border-gray-500 flex items-center justify-items-center hover:bg-[#cacaca] transition ease-in'>
            <IoBagHandleOutline size={20}></IoBagHandleOutline>
          </div></Link>
          <Link to={'/wishlist'} ><div className='w-fit p-2 rounded-full h-fit border-[1px] border-gray-500 flex items-center justify-items-center hover:bg-[#cacaca] transition ease-in'>
            <IoMdHeartEmpty size={20}></IoMdHeartEmpty>
          </div></Link>
        </div>
      </div>
    </>
  )
}

export default Navbar