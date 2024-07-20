import React from 'react'
import Header from '../components/Header'
import LookingEmoji from '../assets/lookingEmoji.png'
import Navbar from '../components/Navbar'

function NotFound() {
    return (
        <>
            <Header></Header>
            <Navbar></Navbar>
            <div className='w-full flex justify-center' >
                <div className='w-96 bg-black p-10 rounded-lg mt-52 flex' >
                    <img className=' w-32' src={LookingEmoji} alt="" />
                    <h1 className=' text-white font-extrabold text-2xl ml-4' >Can't find the page you are looking for !</h1>
                </div>
            </div>
        </>
    )
}

export default NotFound