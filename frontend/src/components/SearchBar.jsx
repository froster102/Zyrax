import React from 'react'
import { IoSearchOutline } from "react-icons/io5";


function SearchBar() {
    return (
        <>
            <div className='w-full lg:block hidden'>
                <div className='flex relative w-full bg-stone-50 h-[40px] px-4 py-2 items-center rounded-[20px]'>
                    <input className='bg-transparent outline-none w-full h-full' placeholder='Search' type="text" />
                    <div className='bg-white h-[32px] w-[32px] flex items-center justify-center absolute right-[5px] rounded-full'>
                        <IoSearchOutline size={20} />
                    </div>
                </div>
            </div>

        </>
    )
}

export default SearchBar