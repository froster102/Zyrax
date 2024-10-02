import { Link, useLocation, useParams } from 'react-router-dom'
import { FaStar } from "react-icons/fa6";
import Size from './Size';
import { FaFacebook, FaInstagram, FaTwitter, FaWhatsapp } from 'react-icons/fa';
import { IoMdHeart, IoMdHeartEmpty } from "react-icons/io";
import Row from './Row';
import Ratings from './Ratings';
import { useAddItemsToUserCartMutation, useAddItemsToUserWishlistMutation, useGetUserWishlistItemsQuery, useRemoveItemFromUserWishlistMutation } from '../store/api/userApiSlice';
import { useEffect, useState } from 'react';
import ProductImageModal from './ProductImageModal';
import BreadCrumbs from './BreadCrumbs';
import _ from 'lodash'
import Skeleton from 'react-loading-skeleton'
import 'react-loading-skeleton/dist/skeleton.css'
import { useDispatch, useSelector } from 'react-redux';
import { addToCart, addToWishlist, removeFromWishlist, selectActiveGender, selectCartItems, selectWishlistItems } from '../store/slices/userSlice';
import { selectUserToken } from '../store/slices/authSlice';
import ProductDetailsAccordion from './ProductDetailsAccordion';
import { IoCart, IoCartOutline } from "react-icons/io5";
import Unavailable from './Unavailable';
import StockOut from './StockOut';
import { AnimatePresence } from 'framer-motion';
import { useGetProductDeatilsQuery, useGetProductsQuery } from '../store/api/productApiSlice';
import { toast } from 'react-toastify';
import { calculateDiscount } from '../utils/helper'

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
    const [selectedSize, setSelectedSize] = useState('')
    const [error, setError] = useState(false)
    const { name } = useParams()
    const { pathname } = useLocation()
    const gender = useSelector(selectActiveGender)
    const wishlistItems = useSelector(selectWishlistItems)
    const cartItems = useSelector(selectCartItems)
    const [filter, setFilter] = useState({ exclude: '', category: '', gender })
    const { data: product, isError: isProductDeatilsError, isLoading: isProductLoading, refetch: refetchProductDeatils } = useGetProductDeatilsQuery(name)
    const { data: { products: similiarProducts = [] } = {}, isLoading: isProductsLoading } = useGetProductsQuery({ filter })
    const { data: userWishlistItems, isLoading: isUserWishlistItemsLoading } = useGetUserWishlistItemsQuery()
    const [imageModal, setImageModal] = useState(false)
    const [productImgPrev, setProductImgPrev] = useState(product?.imageUrls[0])
    const [activeWishlistItem, setActiveWishlistItem] = useState(false)
    const [activeCartItem, setActiveCartItem] = useState(false)
    const dispatch = useDispatch()
    const [addToUserWishlist] = useAddItemsToUserWishlistMutation()
    const [removeFromUserWishlist] = useRemoveItemFromUserWishlistMutation()
    const [addToUserCart] = useAddItemsToUserCartMutation()
    const userAuth = useSelector(selectUserToken)

    useEffect(() => {
        setProductImgPrev(product?.imageUrls[0])
    }, [pathname, product])

    useEffect(() => {
        if (!isProductLoading) {
            setFilter(prev => ({
                ...prev,
                category: product?.category.name,
                exclude : product?.name
            }))
        }
    }, [isProductLoading, product, setFilter])

    useEffect(() => {
        window.scrollTo({ top: 0, behavior: 'smooth' })
        setSelectedSize('')
        setError(false)
        refetchProductDeatils()
    }, [pathname, refetchProductDeatils])

    useEffect(() => {
        let wishlistItemIds = []
        wishlistItemIds = wishlistItems.map(item => item?._id)
        wishlistItemIds.includes(product?._id) ? setActiveWishlistItem(true) : setActiveWishlistItem(false)
        if (cartItems.length > 0 && !isProductLoading) {
            const cartItemIds = cartItems.map(item => item?.product?._id)
            cartItemIds.includes(product?._id) ? setActiveCartItem(true) : setActiveCartItem(false)
        }
    }, [product, wishlistItems, isProductLoading, cartItems, isUserWishlistItemsLoading, userAuth, userWishlistItems])

    async function handleWishlistItems(product) {
        if (!activeWishlistItem) {
            try {
                userAuth && await addToUserWishlist({ productId: product._id }).unwrap()
                dispatch(addToWishlist({ product }))
            } catch (error) {
                ''
            }
        } else {
            userAuth && await removeFromUserWishlist({ itemId: product._id }).unwrap()
            dispatch(removeFromWishlist({ productId: product._id }))
            setActiveWishlistItem(false)
        }
    }

    async function handleCartItems(product) {
        if (!selectedSize) {
            setError(true)
            return
        }
        // const currItemQty = cartItems.find(item => item.product._id === product._id)?.selectedQty
        // console.log(currItemQty)
        if (!activeCartItem) {
            try {
                userAuth && await addToUserCart({ items: [{ productId: product._id, selectedSize }] }).unwrap()
                dispatch(addToCart({ product, selectedSize, selectedQty: 1 }))
            } catch (error) {
                toast(error?.data?.message)
            }
        }
    }

    function checkOutOfStock() {
        if (!isProductLoading) {
            const totalQty = product?.stock.reduce((total, item) => total += item.quantity, 0)
            return totalQty
        }
        return null
    }

    return (
        <>
            {
                isProductLoading ? <Skeleton width={'80px'} baseColor='#f1f1f1' /> :
                    <BreadCrumbs category={product?.category.name} name={product?.name} ></BreadCrumbs>
            }
            <div className='mt-2 text-[#383333] antialiased px-4'>
                <div className='md:flex gap-4 block'>
                    <div className='w-full'>
                        <div className='sm:h-[640px] max-w-full border border-[#CFCBCB] rounded-lg '>
                            <img
                                onClick={() => {
                                    setImageModal(true)
                                }}
                                className='sm:w-full sm:h-full sm:object-contain rounded-lg' src={productImgPrev} alt="" />
                        </div>
                        <div className='md:flex mt-4 justify-between hidden'>
                            {
                                product?.imageUrls.map((img, i) => <img
                                    onClick={() => {
                                        setProductImgPrev(img)
                                    }}
                                    key={i}
                                    className='min-w-[60px] max-h-[240px] p-2 border border-[#CFCBCB] rounded-md' src={img} alt="" />)
                            }
                        </div>
                    </div>
                    <div className='bg-white rounded-lg border border-[#CFCBCB] py-[20px] md:mt-0 mt-4 w-full'>
                        <div className='md:px-8 px-4'>
                            <h1 className='font-bold lg:text-4xl md:text-2xl text-xl'>{_.startCase(product?.name) || <Skeleton />}</h1>
                            <p className='ml-1 text-sm pt-1 font-medium text-gray-700'>{_.startCase(product?.category.name) || <Skeleton width={'100px'} />}</p>
                        </div>
                        <div className='w-full h-[1px] bg-[#CFCBCB]'></div>
                        <div className='md:px-8 px-4 mt-4'>
                            {product?.offer ? <p className='flex items-center gap-2 lg:text-2xl md:text-xl font-semibold w-full'>
                                {'₹' + parseInt(calculateDiscount(product.price, product.offer.discountPercentage))}
                                <span className='block text-sm items-end relative text-neutral-500'>
                                    ₹{product.price}
                                    <span className='block absolute top-[5px]'>-----</span>
                                    <span className='pl-2 text-lg text-green-500'>{product.offer.discountPercentage}%</span>
                                </span>
                            </p>
                                : <p className='lg:text-2xl md:text-xl font-semibold w-full'>₹ {product?.price || <Skeleton width={'50px'} />}</p>
                            }
                            <p className='font-light'>MRP incl. of all taxes</p>
                            <div className='h-[23px] bg-[#D9D9D9] w-fit rounded-lg border border-[#CFCBCB]'>
                                <div className='flex text-sm px-2 justify-center items-center font-semibold gap-2'>
                                    <p className='flex items-center justify-center'>4.0<FaStar className='inline ml-1' /></p>
                                    <p>|</p>
                                    <p>34 ratings</p>
                                    <p>|</p>
                                    <p>20 reviews</p>
                                </div>
                            </div>
                            <div className='mt-8'>
                                <p className='text-base font-semibold mt-4'>Please select a size.</p>
                                <div className='mt-4 flex gap-2 '>
                                    <Size
                                        sizes={product?.stock || []}
                                        isLoading={isProductLoading}
                                        selectedSize={selectedSize}
                                        setSelectedSize={setSelectedSize}
                                        setActiveItem={setActiveCartItem}
                                    />
                                </div>
                                {error && <div className='text-red-500 pt-2'>Please select a size</div>}
                            </div>
                            <div className='flex my-8 justify-center items-center w-fit'>

                            </div>
                            {isProductDeatilsError ? <Unavailable /> : checkOutOfStock() === 0 ? < StockOut /> : <div>
                                <div className='sm:block hidden w-full'>
                                    {activeCartItem
                                        ? <Link to={'/cart'} >
                                            <button className='md:px-4 md:py-2 md:text-base p-2 text-sm  border border-[#CFCBCB] uppercase rounded-lg font-medium text-white bg-neutral-800 inline-flex items-center justify-center'>
                                                <IoCart /> Go to cart
                                            </button>
                                        </Link>
                                        : <button onClick={() => { handleCartItems(product) }}
                                            className='md:px-4 md:py-2 md:text-base p-2 text-sm  border border-[#CFCBCB] rounded-lg font-medium text-white bg-neutral-800 inline-flex items-center justify-center uppercase'
                                        >
                                            <IoCartOutline /> Add to Cart</button>
                                    }
                                    <button onClick={() => { handleWishlistItems(product) }} className='md:px-4 md:py-2 md:text-base p-2 text-sm inline-flex  border border-[#CFCBCB] rounded-lg ml-2 font-medium items-center uppercase'>
                                        {activeWishlistItem ? <><IoMdHeart /> Added</> : <><IoMdHeartEmpty /> Add</>} to Wishlist</button>
                                </div>
                                {
                                    product && <div className='sm:hidden fixed flex w-full justify-center bottom-0 left-1/2 -translate-x-1/2 z-50 bg-neutral-100'>
                                        {activeCartItem
                                            ? <Link to={'/cart'} >
                                                <button className='p-2 text-sm sm:text-lg w-full text-nowrap border border-[#CFCBCB] rounded-lg font-medium text-white bg-neutral-800 inline-flex items-center justify-center uppercase'>
                                                    <IoCart /> Go to cart
                                                </button>
                                            </Link>
                                            : <button onClick={() => { handleCartItems(product) }}
                                                className='p-2 text-sm sm:text-lg w-full border border-[#CFCBCB] rounded-lg font-medium text-white bg-neutral-800 inline-flex items-center justify-center uppercase'
                                            >
                                                <IoCartOutline /> Add to Cart</button>
                                        }
                                        <button onClick={() => { handleWishlistItems(product) }} className='w-full text-sm inline-flex items-center justify-center  border border-[#CFCBCB] rounded-lg ml-2 font-medium uppercase'>
                                            {activeWishlistItem ? <><IoMdHeart /> Added</> : <><IoMdHeartEmpty /> Add</>} to Wishlist</button>
                                    </div>
                                }

                            </div>}
                            <div className='flex justify-center items-center w-fit my-8'>
                                <p className='text-lg'>Share</p>
                                <div className='flex ml-2 gap-2'>
                                    <FaWhatsapp size={30}></FaWhatsapp>
                                    <FaFacebook size={30}></FaFacebook>
                                    <FaTwitter size={30}></FaTwitter>
                                    <FaInstagram size={30}></FaInstagram>
                                </div>
                            </div>
                            <div className='my-8 w-fit'>
                                <p className='text-lg font-semibold'>Delivery Details</p>
                                <div className='border border-[#CFCBCB] rounded-[20px] mt-4 px-2 w-full'>
                                    <div className='flex justify-center items-center'>
                                        <input className='p-2 rounded-[20px] w-full border-none outline-none' placeholder='Enter your pincode' type="text" />
                                        <span className='md:text-sm md:px-2 md:py-1 p-1 text-sm cursor-pointer bg-[#CFCBCB] transition hover:bg-[#949090] rounded-full font-semibold'>Check</span>
                                    </div>
                                </div>
                            </div>
                            <ProductDetailsAccordion title={'Product Details'}></ProductDetailsAccordion>
                            <ProductDetailsAccordion title={'Product Description'} description={product?.description}></ProductDetailsAccordion>
                        </div>
                    </div>
                </div>
                <div className='w-full h-[1px] bg-[#CFCBCB] mt-8'></div>
                <Ratings ratings={RATINGS} customerImages={CUSTOMER_IMAGES}></Ratings>
                <Row title={'Similar Products'} isLoading={isProductsLoading} products={similiarProducts} ></Row>
                <div className='pt-[49px]'></div>
            </div>
            {
                imageModal &&
                <AnimatePresence>
                    <ProductImageModal closeModal={() => { setImageModal(false) }} image={productImgPrev}></ProductImageModal>
                </AnimatePresence>
            }
        </>
    )
}

export default ProductDetails