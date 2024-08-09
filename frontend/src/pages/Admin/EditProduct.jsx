import { useState } from 'react'
import { RiStore3Fill } from "react-icons/ri";
import { FaCheckCircle } from "react-icons/fa";
import { IoMdAddCircleOutline } from "react-icons/io";
import AddImageModal from '../../components/AddImageModal';
import { toast, ToastContainer } from 'react-toastify';
import { useEditProductMutation } from '../../features/adminApiSlice'
import { BeatLoader, MoonLoader } from 'react-spinners'
import { useLocation } from 'react-router-dom';


function EditProduct() {
    const location = useLocation()
    const initialProduct = location.state?.product
    const [product, setProduct] = useState(initialProduct || {
        name: '',
        description: '',
        sizes: [],
        gender: '',
        price: '',
        stock: '',
        discount: '',
        images: [],
        category: ''
    })
    const [catergories, setCatergories] = useState([])
    const [modalOpen, setModalOpen] = useState(false)
    const [preview, setPreview] = useState(null)

    const [editProduct, { isLoading }] = useEditProductMutation()
    async function updateProduct() {
        // const imageBlobs = product.images.map(({ name, data }) => {
        //     const blob = dataUrlToBlob(data)
        //     return { name: name, data: blob }
        // })
        // const productData = new FormData()
        // for (const key in product) {
        //     if (key !== 'images') productData.append(key, product[key])
        // }

        // imageBlobs.forEach((imageBlob) => {
        //     productData.append('images[]', imageBlob.data, imageBlob.name)
        // })
        // console.log(...productData)
        try {
            const res = await editProduct(product).unwrap()
            console.log(res)
            toast(res?.message)
        } catch (error) {
            toast(error?.data?.message)
        }
    }

    function dataUrlToBlob(dataUrl) {
        const [header, base64Data] = dataUrl.split(',')
        const mimeType = header.match(/:(.*?);/)[1]
        const binaryString = atob(base64Data)
        const n = binaryString.length
        const bytes = new Uint8Array(n)
        for (let i = 0; i < n; i++) {
            bytes[i] = binaryString.charCodeAt(i)
        }
        return new Blob([bytes], { type: mimeType })
    }

    const SIZES = ['XS', 'S', 'M', 'L', 'XL', 'XXL', 'XXXL']

    return (
        <>
            <img src="" alt="" />
            <div className='border-[1px] border-black w-full ml-4 rounded-lg bg-[#F1F1F1] shadow-inner py-[40px] px-[20px]'>
                <div className='flex justify-between items-center'>
                    <div className='flex items-center w-fit mt-4'>
                        <RiStore3Fill size={30} />
                        <h2 className='text-2xl font-medium ml-2'>Edit your product</h2>
                    </div>
                    <button className="bg-black text-white font-medium rounded-3xl text-nowrap w-fit h-fit px-8 py-4 flex justify-center items-center" onClick={updateProduct} >{isLoading ? <BeatLoader color='white' loading={isLoading} /> : 'Update'}<FaCheckCircle className='inline ml-2' /></button>
                </div>
                <div className='grid grid-cols-2 grid-rows-2 gap-[20px] w-fit mt-6'>
                    <div className='col-start-1 w-[649px] shadow-md rounded-md border bg-white py-[40px] px-[40px]' >
                        <h1 className='text-xl font-semibold'>General Information</h1>
                        <div className='mt-2'>
                            <p>Product Name</p>
                            <input className='bg-[#D9D9D9] w-[472px] h-[42px] px-2 hover:border-none outline-none rounded-lg mt-1' type="text" value={product.name} onChange={(e) => {
                                setProduct((prev) => ({ ...prev, name: e.target.value }))
                            }} />
                        </div>
                        <div className='mt-2'>
                            <p>Product Description</p>
                            <textarea className='bg-[#D9D9D9] w-[472px] h-[160px] px-2 py-2 hover:border-none outline-none rounded-lg mt-1 scrollbar-hide' value={product.description} onChange={(e) => {
                                setProduct((prev) => ({ ...prev, description: e.target.value }))
                            }}></textarea>
                        </div>
                        <div className='flex justify-between'>
                            <div className='mt-4'>
                                <h1 className='text-xl font-semibold'>Size</h1>
                                <p className='font-extralight'>Select available sizes</p>
                                <div className='mt-1 flex gap-2'>
                                    {SIZES.map((size) => {

                                        return (
                                            <div key={size}
                                                onClick={() => {
                                                    setProduct((prev) => {
                                                        let sizes = prev.sizes
                                                        if (sizes.includes(size)) {
                                                            sizes = sizes.filter((selectedSize) => {
                                                                return selectedSize !== size
                                                            })
                                                            return { ...prev, sizes }
                                                        } else {
                                                            return { ...prev, sizes: [...sizes, size] }
                                                        }
                                                    })

                                                }}
                                                className={`w-[46px] h-[46px] rounded-md ${product.sizes.includes(size) ? 'bg-black text-white' : 'bg-[#D9D9D9]'} transition ease-in flex justify-center items-center border-[1px] border-black`}>
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
                                            setProduct((prev) => ({ ...prev, gender: prev.gender === 'male' ? '' : 'male' }))
                                        }} checked={product.gender === 'male' ? true : false} onChange={() => { }} className='rounded-full' type="checkbox" />
                                        <p className='ml-2'>Male</p>
                                    </div>
                                    <div className='flex ml-2'>
                                        <input onClick={() => {
                                            setProduct((prev) => ({ ...prev, gender: prev.gender === 'female' ? '' : 'female' }))
                                        }} checked={product.gender === 'female' ? true : false} onChange={() => { }} className='rounded-full' type="checkbox" />
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
                            {product.imageUrls.map((imageUrl, i) => {
                                return <div
                                    key={i}
                                    onClick={() => {
                                        setPreview(imageUrl)
                                    }}
                                    className='w-[114px] h-[100px] bg-[#D9D9D9] rounded-md p-2'>
                                    <img className='w-full h-full object-contain' src={imageUrl} alt="" />
                                </div>
                            })}
                            <div onClick={() => {
                                if (product.images.length === 4) {
                                    console.log(product.images.length)
                                    toast('Maximum number of images of four')
                                } else {
                                    setModalOpen(true)
                                }
                            }}
                                className='w-[114px] h-[100px] bg-[#D9D9D9] rounded-md flex justify-center items-center'><IoMdAddCircleOutline size={60} /></div>
                        </div>
                    </div>
                    <div className='col-start-1 w-[649px] h-[264px] border shadow-md  rounded-md bg-white py-[10px] px-[40px]'>
                        <h1 className='text-xl font-semibold'>Add Pricing and Stock</h1>
                        <div className='flex justify-between items-center'>
                            <div className='mt-4'>
                                <p>Base Pricing</p>
                                <input className='rounded-lg p-2 bg-[#D9D9D9] h-[42px] mt-2' type="text" value={product.price} onChange={(e) => {
                                    setProduct((prev) => ({ ...prev, price: e.target.value }))
                                }} />
                            </div>
                            <div className='mt-4'>
                                <p>Stock</p>
                                <input className='rounded-lg p-2 bg-[#D9D9D9] h-[42px] mt-2' type="text" value={product.stockQty} onChange={(e) => {
                                    setProduct((prev) => ({ ...prev, stockQty: e.target.value }))
                                }} />
                            </div>
                        </div>
                        <div className='mt-4'>
                            <p>Discount</p>
                            <select className='rounded-lg bg-[#D9D9D9] h-[42px] mt-2 p-2 focus:border-none outline-none w-60' value={product.discount} onChange={(e) => {
                                setProduct((prev) => ({ ...prev, discount: e.target.value }))
                            }} type="text">
                                <option value="">Select discount type</option>
                                <option value="Monsoon discount">Monsoon discount</option>
                                <option value="Monsoon discount">Monsoon discount</option>
                                <option value="Once in a while discount">Once in a while discount</option>
                            </select>
                        </div>
                    </div>
                    <div className='col-start-2 w-[649px] h-[264px] border shadow-md  rounded-md bg-white py-[10px] px-[40px]'>
                        <div className='flex justify-between items-center'>
                            <h1 className='text-xl font-semibold'>category </h1>
                            <button className='bg-black text-white font-medium px-8 py-4 mt-4 rounded-full'>Manage category</button>
                        </div>
                        <div className='mt-4'>
                            <p>Category</p>
                            <select className=' rounded-lg bg-[#D9D9D9] h-[42px] mt-2 p-2 focus:border-none outline-none w-60' value={product.category} onChange={(e) => {
                                setProduct((prev) => ({ ...prev, category: e.target.value }))
                            }}>
                                <option value="">Select a category</option>
                                <option value="topwears">Topwears</option>
                                <option value="Bottomwears">Bottomwears</option>
                                <option value="Shorts">Shorts</option>
                            </select>
                        </div>
                    </div>
                </div>

            </div >
            {modalOpen && <AddImageModal setProduct={setProduct} closeModal={() => { setModalOpen(false) }} />
            }

        </>
    )
}

export default EditProduct