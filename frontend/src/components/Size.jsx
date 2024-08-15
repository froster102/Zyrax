import React, { useState } from 'react'
import Skeleton from 'react-loading-skeleton'

function Size({ sizes, isLoading, selectedSize, setSelectedSize, setActiveItem }) {
    const [defaultSizes, setDefaultSizes] = useState(['XS', 'S', 'M', 'L', 'XL', 'XXL', 'XXXL'])
    return (
        <>
            {
                isLoading ? [...Array(4)].map((e, i) => {
                    return <Skeleton key={i} className='w-[48px] h-[28px] border border-[#CFCBCB] rounded-full  flex items-center justify-center text-sm' />
                })
                    :
                    defaultSizes.map((size) => (
                        sizes.includes(size) ? (
                            <div key={size} onClick={() => {
                                setSelectedSize(size)
                                setActiveItem ? setActiveItem(false) : ''
                            }} className={`w-[48px] h-[28px] border border-[#CFCBCB] rounded-full  flex items-center justify-center text-sm ${size === selectedSize ? 'bg-black text-white' : ''}`} >
                                <p>{size}</p>
                            </div>
                        ) : (
                            <div key={size} className='w-[48px] h-[28px] border border-[#CFCBCB] bg-[#CFCBCB] rounded-full flex items-center justify-center text-sm'>
                                <p>{size}</p>
                            </div>
                        )
                    ))
            }
        </>
    )
}

export default Size