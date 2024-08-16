import React from 'react'
import ManageNav from '../../components/ManageNav'
import Category from './Category';
import { Route, Routes } from 'react-router-dom';
import Discount from '../../components/Discount';

function Manage() {
    return (
        <>
            <div className='border-[1px] border-black w-full ml-4 rounded-lg bg-[#F1F1F1] shadow-inner pt-[40px] px-[20px]'>
                <h1 className='text-3xl font-semibold'>Manage</h1>
                <div className='flex'>
                    <ManageNav></ManageNav>
                    <div className='h-96 bg-[#CFCBCB] w-[1px] ml-10' ></div>
                    <Routes>
                        <Route path='category' element={<Category/>} ></Route>
                        <Route path='discount' element={<Discount />} ></Route>
                    </Routes>

                </div>
            </div>
        </>
    )
}

export default Manage