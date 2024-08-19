import { useEffect, useRef, useState } from 'react'
import { RiStore3Fill } from "react-icons/ri";
import { FaCheckCircle } from "react-icons/fa";
import AddImageModal from '../../components/AddImageModal';
import { useAddProductMutation, useEditProductMutation, useFetchProductQuery, useFetchProductsQuery, useGetCategoriesQuery } from '../../features/adminApiSlice'
import { BeatLoader } from 'react-spinners'
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm, } from 'react-hook-form'
import SizeSelector from '../../components/SizeSelector';
import ImageSelector from '../../components/ImageSelector';
import { Link, useLocation, useParams } from 'react-router-dom';
import toast, { Toaster } from 'react-hot-toast';

const imageSchema = z.object({
    name: z.string(),
    data: z.string()
})

const imageUrlSchema = z.string().url('Invalid url')

const imagesSchema = z.array(
    z.union([
        imageSchema,
        imageUrlSchema
    ])
).length(4, { message: 'At least 4 images should be uploaded' })

const schema = z.object({
    name: z.string().trim().min(5, 'Required'),
    description: z.string().min(1, 'Required').transform(val => val.split(' ')).refine(words => words.length >= 10, { message: 'Description should have a minimum of 10 words' })
        .transform(val => val.join(' ')),
    sizes: z.array(z.string()).min(1, 'Minimun one size should be selected'),
    gender: z.enum(['men', 'women'], { message: 'Select a valid gender' }),
    price: z.string().transform(val => parseInt(val)).pipe(z.number().min(100, 'Price must number at least 100 or greater')),
    stock: z.string().transform(val => parseInt(val)).pipe(z.number().min(10, 'Stock must be at least 10 or greater')),
    discount: z.string().optional(),
    category: z.string().min(1, 'Please select one category'),
    images: imagesSchema
})

function AddProduct({ mode }) {
    const [modalOpen, setModalOpen] = useState(false)
    const [preview, setPreview] = useState(null)
    const { data: categories, isLoading: isCategoriesLoading } = useGetCategoriesQuery()
    const [addProduct, { isLoading: isUploading }] = useAddProductMutation()
    const [editProduct, { isLoading: isUpdating }] = useEditProductMutation()
    const { id } = useParams()
    const { data: product, isLoading: isProductLoading, refetch } = useFetchProductQuery({ id }, { skip: !id })
    const { control, register, handleSubmit, getValues, setValue, formState: { errors, isDirty }, reset } = useForm(
        {
            resolver: zodResolver(schema)
        }
    )
    const formRef = useRef(null)

    useEffect(() => {
        if (mode === 'edit' && product && !isProductLoading) {
            reset({
                name: product.name,
                description: product.description,
                sizes: product.sizes,
                gender: product.gender,
                price: String(product.price),
                stock: String(product.stockQty),
                discount: product.discount,
                category: product.category?._id,
                images: product.imageUrls
            })
        }
    }, [product, reset, isProductLoading, mode])

    function onSubmit(data) {
        uploadProduct(data)
    }

    function addImage(newImage) {
        const currentImages = getValues('images')
        const updatedImages = [...currentImages, newImage]
        setValue('images', updatedImages)
    }

    async function uploadProduct(data) {
        const imageBlobs = data.images.map((image) => {
            if (typeof image === 'object' && image.data) {
                const blob = dataUrlToBlob(image.data)
                return { name: image.name, data: blob }
            }
            return null
        }).filter(image => image !== null)
        const productData = new FormData()
        for (const key in data) {
            if (key === 'sizes') {
                if (Array.isArray(data[key])) {
                    data[key].forEach((item) => {
                        productData.append(`${key}[]`, item)
                    })
                }
            }
            else if (key !== 'images' && key !== 'sizes') productData.append(key, data[key])
        }

        data.images.forEach((image) => {
            if (typeof (image) === 'string') {
                productData.append('images[]', image)
            } else if (typeof (image) === 'object') {
                const { name, data } = imageBlobs.find(img => img.name === image.name)
                productData.append('images', data, name)
            }
        })
        try {
            let res = ''
            mode === 'edit' ? res = await editProduct({ id: product._id, productData }).unwrap() : res = await addProduct(productData).unwrap()
            reset()
            refetch()
            setPreview(null)
            toast(res?.message)
            setPreview(null)
        } catch (error) {
            console.log(error?.data?.message)
            toast(error?.data?.message)
            setPreview(null)
            reset()
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

    return (
        <>
            <Toaster
                position="top-center"
                toastOptions={{
                    style: {
                        backgroundColor: 'black',
                        color: 'white',
                    },
                    duration: 3000
                }}
            />
            <img src="" alt="" />
            <div className='border-[1px] border-black w-full ml-4 rounded-lg bg-[#F1F1F1] shadow-inner py-[40px] px-[20px]'>
                <h1 className='text-3xl font-semibold'>Products</h1>
                <div className='flex justify-between items-center'>
                    <div className='flex items-center w-fit mt-4'>
                        <RiStore3Fill size={30} />
                        <h2 className='text-2xl font-medium ml-2'>Add New Product</h2>
                    </div>
                    {mode === 'edit' ? <button disabled={!isDirty || isUpdating} className={`${isDirty ? 'bg-[black]' : 'bg-[#b4b3b3]'} text-white font-medium rounded-3xl text-nowrap w-fit h-fit px-8 py-4 flex justify-center items-center`}
                        onClick={() => {
                            formRef.current.requestSubmit()
                        }} >{isUpdating ? <BeatLoader color='white' loading={isUpdating} /> : 'Update Product'}<FaCheckCircle className='inline ml-2' /></button>
                        : <button disabled={isUploading} className="bg-black text-white font-medium rounded-3xl text-nowrap w-fit h-fit px-8 py-4 flex justify-center items-center"
                            onClick={() => {
                                formRef.current.requestSubmit()
                            }} >{isUploading ? <BeatLoader color='white' loading={isUploading} /> : 'Add Product'}<FaCheckCircle className='inline ml-2' /></button>}
                </div>
                <form ref={formRef} onSubmit={handleSubmit(onSubmit)}>
                    <div className='grid grid-cols-2 grid-rows-2 gap-[20px] w-fit mt-6'>
                        <div className='col-start-1 w-[649px] shadow-md rounded-md border bg-white py-[40px] px-[40px]' >
                            <h1 className='text-xl font-semibold'>General Information</h1>
                            <div className='mt-2'>
                                <p>Product Name</p>
                                <input {...register('name')} className='bg-[#D9D9D9] w-[472px] h-[42px] px-2 hover:border-none outline-none rounded-lg mt-1' type="text" />
                                {errors.name && <span className='text-red-700 text-sm block'>{errors.name?.message}</span>}
                            </div>
                            <div className='mt-2'>
                                <p>Product Description</p>
                                <textarea {...register('description')} className='bg-[#D9D9D9] w-[472px] h-[160px] px-2 py-2 hover:border-none outline-none rounded-lg mt-1 scrollbar-hide' ></textarea>
                                {errors.description && <span className='text-red-700 text-sm block'>{errors.description?.message}</span>}
                            </div>
                            <div className='flex justify-between'>
                                <div className='mt-4'>
                                    <h1 className='text-xl font-semibold'>Size</h1>
                                    <p className='font-extralight'>Select available sizes</p>
                                    <SizeSelector control={control} />
                                    {errors.sizes && <span className='text-red-700 text-sm block'>{errors.sizes?.message}</span>}
                                </div>
                                <div className='mt-4'>
                                    <h1 className='text-xl font-semibold'>Gender</h1>
                                    <div className='mt-4'>
                                        <select {...register('gender')} className=' rounded-lg bg-[#D9D9D9] h-[42px] mt-2 p-2 focus:border-none outline-none px-4' type="text">
                                            <option key={' '} value=''>Select gender</option>
                                            <option key={'men'} value="men">Men</option>
                                            <option key={'women'} value="women">Women</option>
                                        </select>
                                        {errors.gender && <span className='text-red-700 text-sm block'>{errors.gender?.message}</span>}
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className='col-start-2 w-[649px]  border shadow-md  rounded-md bg-white py-[10px] px-[40px]'>
                            <h1 className='text-xl font-semibold'>Upload Image</h1>
                            <div className='w-full h-[330px] bg-[#D9D9D9] mt-4 rounded-md py-2'>
                                {preview && <img src={preview} className='w-full h-full object-contain' alt="" />}
                            </div>
                            <ImageSelector control={control} setPreview={setPreview} setModalOpen={setModalOpen} mode={mode} />
                            {errors.images && <span className='text-red-700 text-sm block'>{errors.images?.message}</span>}
                        </div>
                        <div className='col-start-1 w-[649px] h-[264px] border shadow-md  rounded-md bg-white py-[10px] px-[40px]'>
                            <h1 className='text-xl font-semibold'>Add Pricing and Stock</h1>
                            <div className='flex justify-between items-center'>
                                <div className='mt-4'>
                                    <p>Base Pricing</p>
                                    <input {...register('price')} className='rounded-lg p-2 bg-[#D9D9D9] h-[42px] mt-2' type="number" />
                                    {errors.price && <span className='text-red-700 text-sm block'>{errors.price?.message}</span>}
                                </div>
                                <div className='mt-4'>
                                    <p>Stock</p>
                                    <input {...register('stock')} className='rounded-lg p-2 bg-[#D9D9D9] h-[42px] mt-2' type="number" />
                                    {errors.stock && <span className='text-red-700 text-sm block'>{errors.stock?.message}</span>}
                                </div>
                            </div>
                            <div className='mt-4'>
                                <p>Discount</p>
                                <select {...register('discount')} className='rounded-lg bg-[#D9D9D9] h-[42px] mt-2 p-2 focus:border-none outline-none w-60' type="text">
                                    <option value="">Select discount type</option>
                                    <option value="Monsoon discount">Monsoon discount</option>
                                    <option value="Monsoon discount">Monsoon discount</option>
                                    <option value="Once in a while discount">Once in a while discount</option>
                                </select>
                                {errors.discount && <span className='text-red-700 text-sm block'>{errors.discount?.message}</span>}
                            </div>
                        </div>
                        <div className='col-start-2 w-[649px] h-[264px] border shadow-md  rounded-md bg-white py-[10px] px-[40px]'>
                            <div className='flex justify-between items-center'>
                                <h1 className='text-xl font-semibold'>Category </h1>
                                <Link to='/admin/dashboard/manage/category' ><button className='bg-black text-white font-medium px-8 py-4 mt-4 rounded-full'>Manage category</button></Link>
                            </div>
                            <div className='mt-4'>
                                <p>Select Category</p>
                                <select {...register('category')} className=' rounded-lg bg-[#D9D9D9] h-[42px] mt-2 p-2 focus:border-none outline-none w-60' type="text">
                                    <option value="">Select a category</option>
                                    {!isCategoriesLoading && categories.map((category) => {
                                        return <option key={category.name} value={category?._id}>{category.name}</option>
                                    })}
                                </select>
                                {errors.category && <span className='text-red-700 text-sm block'>{errors.category?.message}</span>}
                            </div>
                        </div>
                    </div>
                </form>

            </div >
            {modalOpen && <AddImageModal addImage={addImage} closeModal={() => { setModalOpen(false) }} />}
        </>
    )
}

export default AddProduct