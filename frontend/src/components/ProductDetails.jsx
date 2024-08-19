import { Link, useLocation, useNavigate, useParams } from 'react-router-dom'
import { FaStar } from "react-icons/fa6";
import Size from './Size';
import { FaFacebook, FaInstagram, FaTwitter, FaWhatsapp } from 'react-icons/fa';
import { IoIosArrowDown, IoMdHeart, IoMdHeartEmpty } from "react-icons/io";
import Row from './Row';
import Ratings from './Ratings';
import { useAddItemsToUserCartMutation, useAddItemsToUserWishlistMutation, useGetProductDeatilsQuery, useGetProductsQuery, useRemoveItemFromUserCartMutation, useRemoveItemFromUserWishlistMutation } from '../features/userApiSlice';
import { useEffect, useState } from 'react';
import ProductImageModal from './ProductImageModal';
import BreadCrumbs from './BreadCrumbs';
import _ from 'lodash'
import Skeleton from 'react-loading-skeleton'
import 'react-loading-skeleton/dist/skeleton.css'
import { useDispatch, useSelector } from 'react-redux';
import { addToCart, addToWishlist, removeFromCart, removeFromWishlist, selectActiveGender, selectCartItems, selectWishlistItems } from '../features/userSlice';
import { selectUserToken } from '../features/authSlice';
import ProductDetailsAccordion from './ProductDetailsAccordion';
import { IoCart, IoCartOutline } from "react-icons/io5";
import Unavailable from './Unavailable';
import StockOut from './StockOut';


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
    const [selectedQty, setSelectedQty] = useState(1)
    const [error, setError] = useState(false)
    const { name } = useParams()
    const { pathname } = useLocation()
    const gender = useSelector(selectActiveGender)
    const wishlistItems = useSelector(selectWishlistItems)
    const cartItems = useSelector(selectCartItems)
    const { data: product, isError: isProductDeatilsError, isLoading: isProductLoading } = useGetProductDeatilsQuery(name)
    const { data: similiarProducts, isError: isSimilarProductsError, isLoading: isProductsLoading } = useGetProductsQuery({ category: product?.category.name, exclude: product?.name, gender })
    const [imageModal, setImageModal] = useState(false)
    const [previewImg, setPreviewImg] = useState('')
    const [productImgPrev, setProductImgPrev] = useState(product?.imageUrls[0])
    const [activeWishlistItem, setActiveWishlistItem] = useState(false)
    const [activeCartItem, setActiveCartItem] = useState(false)
    const navigate = useNavigate()
    const dispatch = useDispatch()
    const [addToUserWishlist, { isLoading }] = useAddItemsToUserWishlistMutation()
    const [removeFromUserWishlist] = useRemoveItemFromUserWishlistMutation()
    const [addToUserCart] = useAddItemsToUserCartMutation()
    const [removeUserFromCart] = useRemoveItemFromUserCartMutation()
    const userAuth = useSelector(selectUserToken)

    useEffect(() => {
        setProductImgPrev(product?.imageUrls[0])
    }, [isProductLoading])

    useEffect(() => {
        window.scrollTo({ top: 0, behavior: 'smooth' })
        setSelectedSize('')
        setError(false)
    }, [pathname])

    useEffect(() => {
        if (wishlistItems.length > 0 && !isProductLoading) {
            const wishlistItemIds = wishlistItems.map(item => item?._id)
            wishlistItemIds.includes(product._id) ? setActiveWishlistItem(true) : setActiveWishlistItem(false)
        }
        if (cartItems.length > 0 && !isProductLoading) {
            const cartItemIds = cartItems.map(item => item?.product?._id)
            cartItemIds.includes(product?._id) ? setActiveCartItem(true) : setActiveCartItem(false)
        }
    }, [product, wishlistItems, cartItems])

    async function handleWishlistItems(product) {
        if (!activeWishlistItem) {
            dispatch(addToWishlist([product]))
            try {
                userAuth && await addToUserWishlist({ items: [product._id] }).unwrap()
            } catch (error) {
            }
        } else {
            console.log(product)
            dispatch(removeFromWishlist(product))
            setActiveWishlistItem(false)
            try {
                userAuth && await removeFromUserWishlist({ item: product._id }).unwrap()
            } catch (error) {
            }
        }
    }
    
    async function handleCartItems(product) {
        if (!selectedSize) {
            setError(true)
            return
        }
        if (!activeCartItem) {
            dispatch(addToCart({ product, selectedSize, selectedQty }))
            try {
                userAuth && await addToUserCart({ items: [{ productId: product._id, selectedSize, selectedQty }] }).unwrap()
            } catch (error) {
            }
        }
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
                        <div className='h-[640px] max-w-full border border-[#CFCBCB] rounded-lg '>
                            <img
                                onClick={() => {
                                    setImageModal(true)
                                    setPreviewImg(productImgPrev)
                                }}
                                className='w-full h-full object-contain' src={productImgPrev} alt="" />
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
                            <h1 className='font-bold text-4xl '>{_.startCase(product?.name) || <Skeleton width={'400px'} />}</h1>
                            <p className='ml-1 text-sm pt-1 font-medium text-gray-700'>{_.startCase(product?.category.name) || <Skeleton width={'300px'} />}</p>
                        </div>
                        <div className='w-full h-[1px] bg-[#CFCBCB]'></div>
                        <div className='md:px-8 px-4 mt-4'>
                            <p className='text-2xl font-semibold w-full'>₹ {product?.price || <Skeleton width={'50px'} />}</p>
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
                                        sizes={product?.sizes || []}
                                        isLoading={isProductLoading}
                                        selectedSize={selectedSize}
                                        setSelectedSize={setSelectedSize}
                                        setActiveItem={setActiveCartItem}
                                    />
                                </div>
                                {error && <div className='text-red-500 pt-2'>Please select a size</div>}
                            </div>
                            <div className='flex my-8 justify-center items-center w-fit'>
                                <p>Quantity</p>
                                <select
                                    className='ml-2 border-none outline-none text-black w-[35px] h-[21px] border border-[#CFCBCB] bg-[#D9D9D9] rounded-md m-0 p-0' name="quantity" id=""
                                    value={selectedQty}
                                    onChange={(e) => {
                                        setSelectedQty(e.target.value)
                                        setActiveCartItem(false)
                                    }}
                                >
                                    <option value="1">1</option>
                                    <option value="2">2</option>
                                    <option value="3">3</option>
                                    <option value="4">4</option>
                                </select>
                            </div>
                            {isProductDeatilsError ? <Unavailable /> : product?.stockQty === 0 ? < StockOut /> : <div>
                                <div className='sm:block hidden w-full'>
                                    {activeCartItem
                                        ? <Link to={'/cart'} >
                                            <button className='md:px-4 md:py-2 md:text-lg p-2 text-sm  border border-[#CFCBCB] uppercase rounded-lg font-medium text-white bg-stone-800 inline-flex items-center justify-center'>
                                                <IoCart /> Go to cart
                                            </button>
                                        </Link>
                                        : <button onClick={() => { handleCartItems(product) }}
                                            className='md:px-4 md:py-2 md:text-lg p-2 text-sm  border border-[#CFCBCB] rounded-lg font-medium text-white bg-stone-800 inline-flex items-center justify-center uppercase'
                                        >
                                            <IoCartOutline /> Add to Cart</button>
                                    }
                                    <button onClick={() => { handleWishlistItems(product) }} className='md:px-4 md:py-2 md:text-lg p-2 text-sm inline-flex  border border-[#CFCBCB] rounded-lg ml-2 font-medium items-center uppercase'>
                                        {activeWishlistItem ? <><IoMdHeart /> Added</> : <><IoMdHeartEmpty /> Add</>} to Wishlist</button>

                                </div>
                                <div className='sm:hidden fixed flex w-full justify-center bottom-0 left-1/2 -translate-x-1/2 z-50 bg-stone-100'>
                                    {activeCartItem
                                        ? <Link to={'/cart'} >
                                            <button className='p-2 text-sm sm:text-lg w-full text-nowrap border border-[#CFCBCB] rounded-lg font-medium text-white bg-stone-800 inline-flex items-center justify-center uppercase'>
                                                <IoCart /> Go to cart
                                            </button>
                                        </Link>
                                        : <button onClick={() => { handleCartItems(product) }}
                                            className='p-2 text-sm sm:text-lg w-full border border-[#CFCBCB] rounded-lg font-medium text-white bg-stone-800 inline-flex items-center justify-center uppercase'
                                        >
                                            <IoCartOutline /> Add to Cart</button>
                                    }
                                    <button onClick={() => { handleWishlistItems(product) }} className='w-full text-sm inline-flex items-center justify-center  border border-[#CFCBCB] rounded-lg ml-2 font-medium uppercase'>
                                        {activeWishlistItem ? <><IoMdHeart /> Added</> : <><IoMdHeartEmpty /> Add</>} to Wishlist</button>
                                </div>
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
                                <div className='border border-[#CFCBCB] rounded-[20px] mt-4 px-2'>
                                    <input className='p-2 rounded-[20px] border-none outline-none' placeholder='Enter your pincode' type="text" />
                                    <span className='text-sm px-2 py-1 cursor-pointer bg-[#CFCBCB] transition hover:bg-[#949090] rounded-full font-semibold'>Check</span>
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
                imageModal && <ProductImageModal closeModal={() => { setImageModal(false) }} image={[previewImg]}></ProductImageModal>
            }
        </>
    )
}

export default ProductDetails