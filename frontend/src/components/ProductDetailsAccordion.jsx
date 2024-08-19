import React, { useEffect, useState } from 'react'
import { IoIosArrowDown } from 'react-icons/io'
import Skeleton from 'react-loading-skeleton'

function ProductDetailsAccordion({ title, description }) {
    const [accordionOpen, setAccordinOpen] = useState(false)
    const useCase = title.split(' ')[1].toLowerCase()

    return (
        <>
            <div className='w-full py-2'>
                <div onClick={() => setAccordinOpen(!accordionOpen)} className="flex justify-between items-center cursor-pointer">
                    <p className='font-semibold text-lg'>{title}</p>
                    <IoIosArrowDown className={`${accordionOpen?'rotate-180':'rotate-0'} transition-all ease-in`} size={20} />
                </div>
                <div className='w-full h-[1px] bg-[#CFCBCB] mt-2'></div>
                <div className={`grid overflow-hidden transition-all ease-in-out duration-300 ${accordionOpen ? 'max-h-screen opacity-100' : 'max-h-0 opacity-0'}`}>
                    {useCase === 'details' && <>  <div>
                        <p className='font-semibold'>Material & Care:</p>
                        <div className='my-2 font-light'>
                            <p>100% Cotton</p>
                            <p>Machine Wash</p>
                        </div>
                        <p className='font-semibold'>Country of origin: <span className='font-light'>India</span> </p>
                    </div>
                        <p className='font-semibold my-4'>Manufactured & Sold by:</p>
                        <p className='w-[176px] text-wrap font-light'>
                            Zyrax Store Pvt. Ltd.
                            224, 123 second street
                            Underworld City
                            Lower Parel (E)
                            Detroit - 11
                            connect@zyraxstore.com
                        </p> </>}
                    {
                        useCase === 'description' && <>
                            <p className='w-full text-wrap font-light'>
                                {description || <Skeleton count={5} />}
                            </p>
                        </>
                    }
                </div>
            </div>
        </>
    )
}

export default ProductDetailsAccordion