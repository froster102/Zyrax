import { useEffect } from 'react'
import { Link, useLocation } from 'react-router-dom';
import { useAddItemsToUserCartMutation, useAddItemsToUserWishlistMutation } from '../../store/api/userApiSlice';
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom';
import { selectUserToken, setUserCredentials } from '../../store/slices/authSlice';
import { FaGoogle } from 'react-icons/fa6';
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { selectActiveGender, selectCartItems, selectWishlistItems } from '../../store/slices/userSlice';
import { loginSchema } from '../../../ValidationSchema/loginSchema';
import toast from 'react-hot-toast'
import { RotatingLines } from 'react-loader-spinner'
import { useSigninMutation, useVerifyGoogleAuthMutation } from '../../store/api/authApiSlice';

function Login() {
    const dispatch = useDispatch()
    const [signin, { isLoading, error, reset }] = useSigninMutation()
    const [verifyGoogleAuth, { isLoading: isGoogleAuthLoading }] = useVerifyGoogleAuthMutation()
    const gender = useSelector(selectActiveGender)
    const navigate = useNavigate()
    const location = useLocation()
    const redirect = location?.state?.from?.pathname || `/${gender}`
    const user = useSelector(selectUserToken)
    const localWishlistItems = useSelector(selectWishlistItems)
    const localCartItems = useSelector(selectCartItems)
    const [addItemsToUserWislist] = useAddItemsToUserWishlistMutation()
    const [addItemsToUserCart] = useAddItemsToUserCartMutation()
    const { register, handleSubmit, formState: { errors } } = useForm({
        resolver: zodResolver(loginSchema)
    })

    useEffect(() => {
        const syncUserData = async () => {
            try {
                const ItemIds = localWishlistItems.map((item => item?._id))
                await addItemsToUserWislist({ items: ItemIds }).unwrap()

                if (localCartItems.length > 0) {
                    const items = localCartItems.map(item => (
                        {
                            productId: item?.productId._id,
                            selectedSize: item?.selectedSize,
                            selectedQty: item?.selectedQty
                        }
                    ))
                    await addItemsToUserCart({ items: items })
                }
            } catch (error) {
                ''
            }
        }
        if (user) {
            syncUserData()
            navigate(redirect, { replace: true })
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [user])

    async function onSubmit(data) {
        const { email, password } = data
        try {
            const res = await signin({ email, password }).unwrap()
            dispatch(setUserCredentials({ ...res }))
        } catch (error) {
            if (error.data?.errorType) {
                toast(error.data?.message)
            }
            reset()
        }
    }

    function signInWithGoogle() {
        const googleAuthPopup = window.open(`${import.meta.env.VITE_ENV === 'development' ? import.meta.env.VITE_DEVELOPMENT_API_URL : import.meta.env.VITE_PRODUCTION_API_URL}user/auth/google`, '_blank', 'width=600,height=600')
        const checkPopupClosed = setInterval(async () => {
            if (googleAuthPopup.closed) {
                clearInterval(checkPopupClosed)
                try {
                    const { accessToken, role } = await verifyGoogleAuth().unwrap()
                    dispatch(setUserCredentials({ accessToken, role }))
                    navigate(redirect, { replace: true })
                } catch (error) {
                    toast("Google sign in failed")
                }
            }
        }, 1000)
    }

    return (
        <>
            <form action="" onSubmit={handleSubmit(onSubmit)}>
                <div className='w-fit py-4 px-6 border-[1px] border-[#CFCBCB] rounded-xl bg-white flex flex-col ml-auto mr-auto mt-16'>
                    <h1 className='text-4xl text-center font-medium'>Login</h1>
                    <div className='w-full bg-black rounded-md mt-2 text-white flex items-center justify-center py-2' onClick={signInWithGoogle}>Sign in with google<FaGoogle className='inline ml-2' /></div>
                    <span className='block mt-2  text-xl font-medium' htmlFor="">Email</span>
                    <input {...register('email')} className='block mt-2 p-2 border-[1px] h-[43px] border-black rounded-md w-full' type="text" />
                    {error && !error.data?.errorType && <span className='text-red-700 text-sm'>{error?.data?.message}</span>}
                    {errors.email && <span className='text-red-700 text-sm'>{errors.email?.message}</span>}
                    <span className='block mt-4  text-xl font-medium' htmlFor="">Password</span>
                    <input {...register('password')} className='block mt-2 p-2 h-[43px] border-[1px] border-black rounded-md w-full' type="password" />
                    {error && !error.data?.errorType && <span className='text-red-700 text-sm'>{error?.data?.message}</span>}
                    {errors.password && <span className='text-red-700 text-sm'>{errors.password?.message}</span>}
                    <Link to='/forgot-password'><p className='text-right font-semibold text-sm hover:underline mt-1'>Forgot Password</p></Link>
                    <button disabled={isLoading || isGoogleAuthLoading} className='bg-black text-white font-medium px-4 py-2 rounded-md w-fit self-center mt-2 flex items-center gap-1' > {isLoading || isGoogleAuthLoading ? <RotatingLines strokeColor='white' width='20' /> : 'Login'}</button>
                    <p className='text-sm font-semibold text-right mt-2'>Dont have a account ? <span className='hover:underline'><Link to='/register'>Register</Link></span></p>
                </div>
            </form>
        </>
    )
}

export default Login