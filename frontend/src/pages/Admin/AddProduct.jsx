import React, { useState } from 'react'
import { RiStore3Fill } from "react-icons/ri";
import { FaCheckCircle } from "react-icons/fa";
import { IoMdAddCircleOutline } from "react-icons/io";
import AddImageModal from '../../components/AddImageModal';
import { Flip, toast, ToastContainer } from 'react-toastify';


function AddProduct() {
    const [selectedSizes, setSelectedSizes] = useState([])
    const [gender, setGender] = useState()
    const [modalOpen, setModalOpen] = useState(false)
    const [images, setImages] = useState([])
    const [preview, setPreview] = useState(null)
    console.log(preview)

    function addImage() {
        if (images.length === 4) {
            toast('Maximum number of images is four')
            return
        }
        setModalOpen(true)
    }

    const sizes = ['S', 'M', 'L', 'XL', 'XXL', 'XXXL']
    return (
        <>
            <ToastContainer className='mt-10 rounded-lg font-semibold text-center'
                position='top-center'
                autoClose='1000'
                theme='dark'
                hideProgressBar={true}
                transition={Flip}
            ></ToastContainer>
            <div className='border-[1px] border-black w-full ml-4 rounded-lg bg-[#F1F1F1] shadow-inner py-[40px] px-[20px]'>
                <h1 className='text-3xl font-semibold'>Products</h1>
                <div className='flex justify-between items-center'>
                    <div className='flex items-center w-fit mt-4'>
                        <RiStore3Fill size={30} />
                        <h2 className='text-2xl font-medium ml-2'>Add New Product</h2>
                    </div>
                    <button className="bg-black text-white font-medium rounded-3xl text-nowrap w-fit h-fit px-8 py-4">Add Product <FaCheckCircle className='inline' /></button>
                </div>
                <div className='grid grid-cols-2 grid-rows-2 gap-[20px] w-fit mt-6'>
                    <div className='col-start-1 w-[649px] shadow-md rounded-md border bg-white py-[40px] px-[40px]' >
                        <h1 className='text-xl font-semibold'>General Information</h1>
                        <div className='mt-2'>
                            <p>Product Name</p>
                            <input className='bg-[#D9D9D9] w-[472px] h-[42px] px-2 hover:border-none outline-none rounded-lg mt-1' type="text" />
                        </div>
                        <div className='mt-2'>
                            <p>Product Description</p>
                            <textarea className='bg-[#D9D9D9] w-[472px] h-[160px] px-2 py-2 hover:border-none outline-none rounded-lg mt-1  '></textarea>
                        </div>
                        <div className='flex justify-between'>
                            <div className='mt-4'>
                                <h1 className='text-xl font-semibold'>Size</h1>
                                <p className='font-extralight'>Select available sizes</p>
                                <div className='mt-1 flex gap-2'>
                                    {sizes.map((size) => {
                                        return (
                                            <div key={size}
                                                onClick={() => {
                                                    setSelectedSizes((prev) => {
                                                        return [...prev, size]
                                                    })
                                                }}
                                                className={`w-[46px] h-[46px] rounded-md ${selectedSizes.includes(size) ? 'bg-black text-white' : 'bg-[#D9D9D9]'} transition ease-in flex justify-center items-center border-[1px] border-black`}>
                                                <p className='text-lg font-medium'>{size}</p>
                                            </div>
                                        )
                                    })}
                                </div>
                            </div>
                            <div className='mt-4'>
                                <h1 className='text-xl font-semibold'>Gender</h1>
                                <div className='flex mt-4'>
                                    <div className='flex'>
                                        <input onClick={() => {
                                            setGender(prev => prev === 'Male' ? '' : 'Male')
                                        }} checked={gender === 'Male' ? true : false} onChange={() => { }} className='rounded-full' type="checkbox" />
                                        <p className='ml-2'>Male</p>
                                    </div>
                                    <div className='flex ml-2'>
                                        <input onClick={() => {
                                            setGender(prev => prev === 'Female' ? '' : 'Female')
                                        }} checked={gender === 'Female' ? true : false} onChange={() => { }} className='rounded-full' type="checkbox" />
                                        <p className='ml-2'>Female</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className='col-start-2 w-[649px]  border shadow-md  rounded-md bg-white py-[10px] px-[40px]'>
                        <h1 className='text-xl font-semibold'>Upload Image</h1>
                        <div className='w-full h-[330px] bg-[#D9D9D9] mt-4 rounded-md py-2'>
                            {preview && <img src={preview} className='w-full h-full object-contain' alt="" />}
                        </div>
                        <div className='flex mt-4 gap-2'>
                            {images.map((image, i) => {
                                return <div
                                    key={i}
                                    onClick={() => {
                                        setPreview(image)
                                    }}
                                    className='w-[114px] h-[100px] bg-[#D9D9D9] rounded-md p-2'>
                                    <img className='w-full h-full' style={{ aspectRatio: 'auto 683/911' }} src={image} alt="" />
                                </div>
                            })}
                            <div onClick={addImage}
                                className='w-[114px] h-[100px] bg-[#D9D9D9] rounded-md flex justify-center items-center'><IoMdAddCircleOutline size={60} /></div>
                        </div>
                    </div>
                    <div className='col-start-1 w-[649px] h-[264px] border shadow-md  rounded-md bg-white py-[10px] px-[40px]'>
                        <h1 className='text-xl font-semibold'>Add Pricing and Stock</h1>
                        <div className='flex justify-between items-center'>
                            <div className='mt-4'>
                                <p>Base Pricing</p>
                                <input className='rounded-lg bg-[#D9D9D9] h-[42px] mt-2' type="text" />
                            </div>
                            <div className='mt-4'>
                                <p>Stock</p>
                                <input className='rounded-lg bg-[#D9D9D9] h-[42px] mt-2' type="text" />
                            </div>
                        </div>
                        <div className='mt-4'>
                            <p>Discount</p>
                            <input className='rounded-lg bg-[#D9D9D9] h-[42px] mt-2' type="text" />
                        </div>
                    </div>
                    <div className='col-start-2 w-[649px] h-[264px] border shadow-md  rounded-md bg-white py-[10px] px-[40px]'>
                        <div className='flex justify-between items-center'>
                            <h1 className='text-xl font-semibold'>Catergory </h1>
                            <button className='bg-black text-white font-medium px-8 py-4 mt-4 rounded-full'>Manage Catergory</button>
                        </div>
                        <div className='mt-4'>
                            <p>Select Category</p>
                            <select className='rounded-lg bg-[#D9D9D9] h-[42px] mt-2 p-2 focus:border-none outline-none w-60' type="text">
                                <option value="">Select a catergory</option>
                                <option value="topwears">Topwears</option>
                                <option value="Bottomwears">Bottomwears</option>
                                <option value="Shorts">Shorts</option>
                            </select>
                        </div>
                    </div>
                </div>

            </div>
            {modalOpen && <AddImageModal addImage={setImages} closeModal={() => { setModalOpen(false) }} />}

        </>
    )
}

export default AddProduct