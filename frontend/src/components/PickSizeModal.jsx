import React from 'react'
import Size from './Size'
import { IoMdClose } from 'react-icons/io'

function PickSizeModal({ closeModal, selectedSize, setSelectedSize, sizes, proceed }) {
    return (
        <div className="relative z-10 h-screen">
            <div className="fixed inset-0 bg-[#f1f1f1] bg-opacity-75 transition-all backdrop-blur-sm"></div>
            <div className="fixed inset-0 z-10 w-screen overflow-y-auto">
                <div className="flex w-full h-full justify-center items-center px-2 py-12 text-center ">
                    <div className='relative w-fit text-left lg:p-10 py-10 px-4 rounded-2xl bg-[#D9D9D9]'>
                        <div className=" flex justify-center text-black `">
                            <button
                                className="rounded-md p-1 inline-flex items-center justify-center text-black hover:bg-black hover:text-white transition ease-in duration-75 focus:outline-none absolute top-2 right-2"
                                onClick={closeModal} >
                                <IoMdClose size={20} />
                            </button>
                            <Size sizes={sizes} selectedSize={selectedSize} setSelectedSize={setSelectedSize} />
                        </div>
                        {!selectedSize && <p className='text-center font-medium pt-4'>Please select a size</p>}
                        {selectedSize &&
                            <div className='flex justify-center items-center pt-4'>
                                <button onClick={() => {
                                    proceed()
                                    closeModal()
                                }} className='bg-black rounded-[20px] text-white font-medium px-2 py-1'>Proceed</button>
                            </div>
                        }
                    </div>

                </div>
            </div>
        </div>
    )
}

export default PickSizeModal