import React from 'react'
import Dropdown from './Dropdown'
import SearchBar from './SearchBar'
import { IoBagHandleOutline } from "react-icons/io5";
import { IoMdHeartEmpty } from "react-icons/io";
import { FaRegUser } from "react-icons/fa";
import { useSelector } from 'react-redux';
import { selectUserToken } from '../features/authSlice';
import UserDropdown from './UserDropdown';
import { Link } from 'react-router-dom'

const topwears = ['Shirts', 'Pollos', 'Oversized shirts', 'All T-shirts', 'Jackets']
const bottomwears = ['Jeans', 'Pants', 'Joggers', 'Oversized joggers', 'Track pants']
const accessories = ['Perfumes', 'Wallets', 'Watches']
const bestsellers = ['Top 20 t-shirts', 'Top 20 shirts', 'Top 20 joggers']

function Navbar() {
  const user = useSelector(selectUserToken)

  return (
    <>
      <div className='px-[20px]'>
        <div className='bg-white w-full h-[60px] rounded-[20px] mt-4 p-2 flex gap-4 items-center'>
          <Dropdown title='Topwears' options={topwears} ></Dropdown>
          <Dropdown title={'Bottomwear'} options={bottomwears}></Dropdown>
          <SearchBar></SearchBar>
          <Dropdown title={'Accessories'} options={accessories}></Dropdown>
          <Dropdown title={'Bestsellers'} options={bestsellers}></Dropdown>
          <UserDropdown user={user}></UserDropdown>
          <div className='w-fit p-2 rounded-full h-fit border-[1px] border-gray-500 flex items-center justify-items-center hover:bg-[#cacaca] transition ease-in'>
            <IoBagHandleOutline size={20}></IoBagHandleOutline>
          </div>
          <div className='w-fit p-2 rounded-full h-fit border-[1px] border-gray-500 flex items-center justify-items-center hover:bg-[#cacaca] transition ease-in'>
            <IoMdHeartEmpty size={20}></IoMdHeartEmpty>
          </div>
        </div>
      </div>

    </>
  )
}

export default Navbar