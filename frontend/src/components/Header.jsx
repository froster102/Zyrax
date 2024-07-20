import React from 'react'
import Zyrax_icon from '../assets/options-list.png'
import user from '../assets/user.png'

export default function Header() {
    return (
        <>
            <div className='flex justify-between' >
                <img className='w-12 h-12' src={Zyrax_icon} alt="store logo" />
                <h1 className='text-4xl font-extrabold'>Zyrax.Store</h1>
                <img className='w-12 h-12' src={user} alt="user profile" />
            </div>
            <div className='border-[1px] border-b-[#CFCBCB] mt-2' ></div>
        </>
    )
}
