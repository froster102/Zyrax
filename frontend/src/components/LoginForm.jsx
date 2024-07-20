import React from 'react'
import Socialbutton from './Socialbutton'
import { AiFillGoogleCircle } from "react-icons/ai";
import { FaFacebook } from "react-icons/fa";
import { FaMobileAlt } from "react-icons/fa";
import { AiFillTwitterCircle } from "react-icons/ai";
import { Link } from 'react-router-dom';
import Footer from './Footer';

function LoginForm() {
    return (
        <>
            <div className='w-fit py-4 px-6 border-[1px] border-[#CFCBCB] rounded-xl bg-white flex flex-col ml-auto mr-auto mt-16'>
                <h1 className='text-4xl text-center font-medium'>Login</h1>
                <div className='flex gap-4 mt-4 items-center justify-center'>
                    <Socialbutton icon={<AiFillGoogleCircle size={35}></AiFillGoogleCircle>}></Socialbutton>
                    <Socialbutton icon={<FaFacebook size={35}></FaFacebook>}></Socialbutton>
                    <Socialbutton icon={<AiFillTwitterCircle size={35}></AiFillTwitterCircle>}></Socialbutton>
                    <Socialbutton icon={<FaMobileAlt size={35}></FaMobileAlt>}></Socialbutton>
                </div>
                <span className='block mt-4  text-xl font-medium' htmlFor="">Email</span>
                <input className='block mt-2 p-2 border-[1px] h-[43px] border-black rounded-md w-full' type="text" />
                <span className='block mt-4  text-xl font-medium' htmlFor="">Password</span>
                <input className='block mt-2 p-2 h-[43px] border-[1px] border-black rounded-md w-full' type="password" />
                <p className='text-right font-semibold text-sm hover:underline mt-1'>Forgot Password</p>
                <button className='bg-black text-white font-medium px-4 py-2 rounded-md w-fit self-center mt-2' >Login</button>
                <p className='text-sm font-semibold text-right mt-2'>Don't have a account ? <span className='hover:underline'><Link to='/register'>Register</Link></span></p>
            </div>
            <Footer></Footer>
        </>
    )
}

export default LoginForm