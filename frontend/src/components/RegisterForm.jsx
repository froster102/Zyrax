import React from 'react'
import Socialbutton from './Socialbutton'
import { AiFillGoogleCircle, AiFillTwitterCircle } from 'react-icons/ai'
import { FaFacebook, FaMobileAlt } from 'react-icons/fa'
import { Link } from 'react-router-dom'

function RegisterForm() {
  return (
    <>
      <div className='w-[348px] py-4 px-6 border-[1px] border-[#CFCBCB] rounded-xl bg-white flex flex-col ml-auto mr-auto mt-16'>
        <h1 className='text-4xl text-center font-medium'>Register</h1>
        <div className='flex gap-4 mt-4 items-center justify-center'>
          <Socialbutton icon={<AiFillGoogleCircle size={35}></AiFillGoogleCircle>}></Socialbutton>
          <Socialbutton icon={<FaFacebook size={35}></FaFacebook>}></Socialbutton>
          <Socialbutton icon={<AiFillTwitterCircle size={35}></AiFillTwitterCircle>}></Socialbutton>
          <Socialbutton icon={<FaMobileAlt size={35}></FaMobileAlt>}></Socialbutton>
        </div>
        <span className='block text-center text-lg mt-1'>Or</span>
        <div className='flex'>
          <div>
            <span className='block mt-4  text-xl font-medium' htmlFor="">First Name</span>
            <input className='mt-2 p-1 border-[1px] h-[43px] border-black rounded-md w-full' type="text" />
          </div>
          <div className='ml-2'>
            <span className='block mt-4  text-xl font-medium' htmlFor="">Last Name</span>
            <input className='mt-2 p-1 h-[43px] border-[1px] border-black rounded-md w-full' type="text" />
          </div>
        </div>
        <div className='mt-4'>
          <span className='block text-xl font-medium' htmlFor="">Email</span>
          <input className='mt-2 p-2 h-[43px] border-[1px] border-black rounded-md w-full' type="text" />
        </div>
        <div className='mt-4'>
          <span className='block text-xl font-medium' htmlFor="">Password</span>
          <input className='mt-2 p-2 h-[43px] border-[1px] border-black rounded-md w-full' type="password" />
        </div>
        <div className='mt-4'>
          <span className='block text-xl font-medium' htmlFor="">Confirm Password</span>
          <input className='mt-2 p-2 h-[43px] border-[1px] border-black rounded-md w-full' type="password" />
        </div>
        <button className='bg-black text-white font-medium px-4 py-2 rounded-md w-fit self-center mt-2' >Sign up</button>
        <p className='text-sm font-semibold text-right mt-2'>Already have a account ? <span className='hover:underline'><Link to='/login' >Login</Link></span></p>
      </div>
    </>
  )
}

export default RegisterForm