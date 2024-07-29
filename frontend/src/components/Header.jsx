import React from 'react'
import Zyrax_icon from '../assets/options-list.png'
import userImg from '../assets/user.png'
import { useSelector } from 'react-redux'
import { selectUserToken } from '../features/authSlice'

function Header() {
    const user = useSelector(selectUserToken)
    return (
        <>
            <div className='flex justify-between px-[20px] pt-[20px]' >
                <img className='w-12 h-12' src={Zyrax_icon} alt="store logo" />
                <h1 className='text-4xl font-extrabold'>Zyrax.Store</h1>
                <div className='w-12 h-12'>
                    {user && <img className='w-12 h-12' src={userImg} alt="" />}
                </div>

            </div>
            <div className='border-[1px] border-b-[#CFCBCB] mt-2 mx-[20px]' ></div>
        </>
    )
}

export default Header