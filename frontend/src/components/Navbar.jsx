import React from 'react'
import Dropdown from './Dropdown'
import SearchBar from './SearchBar'
import { FaShoppingCart, FaHeart } from "react-icons/fa";

const topwears = ['Shirts', 'Pollos', 'Oversized shirts', 'All T-shirts', 'Jackets']
const bottomwears = ['Jeans','Pants','Joggers','Oversized joggers','Track pants']
const accessories = ['Perfumes','Wallets','Watches']
const bestsellers  = ['Top 20 t-shirts','Top 20 shirts','Top 20 joggers']

function Navbar() {
  return (
    <>
      <div className='bg-white w-full h-[60px] rounded-[20px] mt-4 p-2 flex gap-4'>
        <Dropdown title='Topwears' options={topwears} ></Dropdown>
        <Dropdown title={'Bottomwear'} options={bottomwears}></Dropdown>
        <SearchBar></SearchBar>
        <Dropdown title={'Accessories'} options={accessories}></Dropdown>
        <Dropdown title={'Bestsellers'} options={bestsellers}></Dropdown>
        <div className='w-fit p-2 rounded-full h-fit border-[1px] border-black flex items-center justify-center'>
          <FaShoppingCart size={20}></FaShoppingCart>
        </div>
        <div className='w-fit p-2 rounded-full h-fit border-[1px] border-black flex items-center justify-center'>
          <FaHeart size={20}></FaHeart>
        </div>
      </div>
    </>
  )
}

export default Navbar