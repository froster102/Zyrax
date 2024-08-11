import { useLocation, useNavigate, useParams } from 'react-router-dom'
import { FaStar } from "react-icons/fa6";
import Size from './Size';
import { FaFacebook, FaInstagram, FaTwitter, FaWhatsapp } from 'react-icons/fa';
import { IoIosArrowDown } from "react-icons/io";
import Row from './Row';
import Ratings from './Ratings';
import { useGetProductDeatilsQuery, useGetProductsQuery } from '../features/userApiSlice';
import { useEffect, useState } from 'react';
import ProductImageModal from './ProductImageModal';
import BreadCrumbs from './BreadCrumbs';
import _ from 'lodash'
import Skeleton from 'react-loading-skeleton'
import 'react-loading-skeleton/dist/skeleton.css'
import { useSelector } from 'react-redux';
import { selected_gender } from '../features/userSlice';

const RATINGS = [
    {
        rating: 4.0,
        ratings: 34,
        reviewTotal: 20,
        reviews: {
            username: 'John Doe',
            review: 'Awesome product loved it',
            date: '27/02/2024',
            images: []
        }
    }
]

const CUSTOMER_IMAGES = []

function ProductDetails() {
    const { name } = useParams()
    const { pathname } = useLocation()
    const gender = useSelector(selected_gender)
    const { data: productDetails, isLoading: isProductDetailsLoading } = useGetProductDeatilsQuery(name)
    const { data: similiarProducts, error, isLoading: isProductsLoading } = useGetProductsQuery({ category: productDetails?.category.name, exclude: productDetails?.name, gender })
    const [imageModal, setImageModal] = useState(false)
    const [previewImg, setPreviewImg] = useState('')
    const navigate = useNavigate()

    useEffect(() => {
        console.log('render')
        window.scrollTo({ top: 0, behavior: 'smooth' })
    }, [pathname])

    console.log('render')

    // useEffect(() => {
    //     if (!productDetails && !isProductsLoading) {
    //         navigate('/')
    //     }
    // }, [error])

    return (
        <>
            {
                isProductDetailsLoading ? <Skeleton width={'80px'} baseColor='#f1f1f1' /> :
                    <BreadCrumbs category={productDetails?.category.name} name={productDetails?.name} ></BreadCrumbs>
            }
            <div className='mx-[200px] mt-8 text-[#383333]'>
                <div className='flex'>
                    {
                        isProductDetailsLoading ? <div className='flex gap-4 h-fit w-fit flex-wrap'>
                            {[...Array(4)].map((imageUrl, i) => {
                                return <Skeleton key={i} className='w-[325px] h-[455px] border border-[#CFCBCB] rounded-md' />
                            })}
                        </div> : <div className='flex gap-4 h-fit w-fit flex-wrap'>
                            {productDetails?.imageUrls?.map((imageUrl, i) => {
                                return <img key={i} onClick={() => {
                                    setPreviewImg(imageUrl)
                                    setImageModal(true)
                                }} className='w-[325px] h-[455px] border border-[#CFCBCB] rounded-md' src={imageUrl} alt="" />
                            })}
                        </div>
                    }
                    <div className='bg-white w-full rounded-[20px] border border-[#CFCBCB] py-[20px]'>
                        <div className='px-[40px]'>

                            <h1 className='font-bold text-4xl '>{_.startCase(productDetails?.name) || <Skeleton width={'400px'} />}</h1>
                            <p className='ml-1 text-sm pt-1 font-medium text-gray-700'>{_.startCase(productDetails?.category.name) || <Skeleton width={'300px'} />}</p>
                        </div>
                        <div className='w-full h-[1px] bg-[#CFCBCB] mt-4'></div>
                        <div className='p-[40px]'>
                            <p className='text-2xl font-semibold w-full'>₹ {productDetails?.price || <Skeleton width={'50px'} />}</p>
                            <p className='font-light'>MRP incl. of all taxes</p>
                            <div className='h-[23px] bg-[#D9D9D9] w-fit rounded-lg border border-[#CFCBCB] my-8'>
                                <div className='flex text-sm px-2 justify-center items-center font-semibold gap-2'>
                                    <p className='flex items-center justify-center'>4.0<FaStar className='inline ml-1' /></p>
                                    <p>|</p>
                                    <p>34 ratings</p>
                                    <p>|</p>
                                    <p>20 reviews</p>
                                </div>
                            </div>
                            <div className='my-8'>
                                <p className='text-base font-semibold mt-4'>Please select a size.</p>
                                <div className='mt-4 flex gap-2 '>
                                    <Size sizes={productDetails?.sizes || []} isLoading={isProductDetailsLoading}></Size>
                                </div>
                            </div>
                            <div className='flex my-8 justify-center items-center w-fit'>
                                <p>Quantity</p>
                                <select className='ml-2 border-none outline-none text-black w-[35px] h-[21px] border border-[#CFCBCB] bg-[#D9D9D9] rounded-md m-0 p-0' name="quantity" id="">
                                    <option value="1">1</option>
                                    <option value="2">2</option>
                                    <option value="3">3</option>
                                    <option value="4">4</option>
                                </select>
                            </div>
                            <div>
                                <button className='px-10 py-2 border border-[#CFCBCB] rounded-full text-xl font-medium text-white bg-black'>Add to Cart</button>
                                <button className='px-10 py-2 border border-[#CFCBCB] rounded-full ml-2 text-xl font-medium '>Add to Wishlist</button>
                            </div>
                            <div className='flex justify-center items-center w-fit my-8'>
                                <p className='text-lg'>Share</p>
                                <div className='flex ml-2 gap-2'>
                                    <FaWhatsapp size={30}></FaWhatsapp>
                                    <FaFacebook size={30}></FaFacebook>
                                    <FaTwitter size={30}></FaTwitter>
                                    <FaInstagram size={30}></FaInstagram>
                                </div>
                            </div>
                            <div className='mt-8 w-fit'>
                                <p className='text-lg font-semibold'>Delivery Details</p>
                                <div className='border border-[#CFCBCB] rounded-[20px] mt-4 px-2'>
                                    <input className='p-2 rounded-[20px] border-none outline-none' placeholder='Enter your pincode' type="text" />
                                    <span className='text-sm px-2 py-1 cursor-pointer bg-[#CFCBCB] transition hover:bg-[#949090] rounded-full font-semibold'>Check</span>
                                </div>
                            </div>
                            <div className='w-[504px] mt-8'>
                                <div className='flex justify-between'>
                                    <p className='font-semibold text-lg'>Product Details</p>
                                    <IoIosArrowDown size={30} />
                                </div>
                                <div className='w-full h-[1px] bg-[#CFCBCB] mt-2'></div>
                                <div>
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
                                </p>
                            </div>
                            <div className='w-[504px] mt-8'>
                                <div className='flex justify-between'>
                                    <p className='font-semibold text-lg'>Product Description</p>
                                    <IoIosArrowDown size={30} />
                                </div>
                                <div className='w-full h-[1px] bg-[#CFCBCB] mt-2'></div>
                                <p className='w-full text-wrap font-light'>
                                    {productDetails?.description || <Skeleton count={5} />}
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
                <div className='w-full h-[1px] bg-[#CFCBCB] my-8'></div>
                <Ratings ratings={RATINGS} customerImages={CUSTOMER_IMAGES}></Ratings>
                {!error && <Row title={'Similar Products'} isLoading={isProductsLoading} products={similiarProducts} ></Row>}
            </div>
            {
                imageModal && <ProductImageModal closeModal={() => { setImageModal(false) }} image={[previewImg]}></ProductImageModal>
            }
        </>
    )
}

export default ProductDetails