import { useEffect } from 'react'
import { Link, useLocation } from 'react-router-dom';
import { useAddItemsToUserCartMutation, useAddItemsToUserWishlistMutation, useGetItemsFromUserCartQuery, useGetUserWishlistItemsQuery, useSigninMutation } from '../../features/userApiSlice';
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom';
import { selectUserToken, setUserCredentials } from '../../features/authSlice';
import { FaGoogle } from 'react-icons/fa6';
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { selectActiveGender, selectCartItems, selectWishlistItems } from '../../features/userSlice';
import { loginSchema } from '../../../ValidationSchema/loginSchema';
import toast from 'react-hot-toast'
import { RotatingLines } from 'react-loader-spinner'

function Login() {
    const dispatch = useDispatch()
    const [signin, { isLoading, error, reset }] = useSigninMutation()
    const gender = useSelector(selectActiveGender)
    const navigate = useNavigate()
    const location = useLocation()
    const redirect = location?.state?.from?.pathname || `/${gender}`
    const user = useSelector(selectUserToken)
    const localWishlistItems = useSelector(selectWishlistItems)
    const localCartItems = useSelector(selectCartItems)
    const [addItemsToUserWislist] = useAddItemsToUserWishlistMutation()
    const [addItemsToUserCart] = useAddItemsToUserCartMutation()
    const { refetch: refetchWishlist } = useGetUserWishlistItemsQuery(undefined,{skip:!user})
    const { refetch: refetchCart } = useGetItemsFromUserCartQuery(undefined,{skip:!user})
    const { register, handleSubmit, formState: { errors } } = useForm({
        resolver: zodResolver(loginSchema)
    })

    useEffect(() => {
        const syncUserData = async () => {
            try {
                if (localWishlistItems.length > 0) {
                    const items = localWishlistItems.map((item => item?._id))
                    await addItemsToUserWislist({ items: items }).unwrap()
                    refetchWishlist()
                }
                if (localCartItems.length > 0) {
                    const items = localCartItems.map(item => (
                        {
                            productId: item?.product._id,
                            selectedSize: item?.selectedSize,
                            selectedQty: item?.selectedQty
                        }
                    ))
                    await addItemsToUserCart({ items: items })
                    refetchCart()
                }
            } catch (error) {
                console.log(error)
            }
        }
        if (user) {
            syncUserData()
            navigate(redirect, { replace: true })
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [user])

    useEffect(() => {
        function handleAuthMsg(e) {
            if (e.origin !== 'http://localhost:3000') return
            handleAuth(e.data)
        }
        window.addEventListener('message', handleAuthMsg)

        function handleAuth({ accessToken, role, error }) {
            if (error) {
                return toast(error)
            }
            dispatch(setUserCredentials({ accessToken, role }))
            navigate(redirect, { replace: true })
        }

        return () => {
            window.removeEventListener('message', handleAuthMsg)
        }
    }, [dispatch, navigate, redirect])

    async function onSubmit(data) {
        const { email, password } = data
        try {
            const res = await signin({ email, password }).unwrap()
            dispatch(setUserCredentials({ ...res }))
        } catch (error) {
            reset()
        }
    }

    function signInWithGoogle() {
        window.open('http://localhost:3000/api/v1/users/auth/google', '_blank', 'width=600,height=600')
    }

    return (
        <>
            <form action="" onSubmit={handleSubmit(onSubmit)}>
                <div className='w-fit py-4 px-6 border-[1px] border-[#CFCBCB] rounded-xl bg-white flex flex-col ml-auto mr-auto mt-16'>
                    <h1 className='text-4xl text-center font-medium'>Login</h1>
                    <div className='w-full bg-black rounded-md mt-2 text-white flex items-center justify-center py-2' onClick={signInWithGoogle}>Sign in with google<FaGoogle className='inline ml-2' /></div>
                    <span className='block mt-2  text-xl font-medium' htmlFor="">Email</span>
                    <input {...register('email')} className='block mt-2 p-2 border-[1px] h-[43px] border-black rounded-md w-full' type="text" />
                    {error && <span className='text-red-700 text-sm'>{error?.data?.message}</span>}
                    {errors.email && <span className='text-red-700 text-sm'>{errors.email?.message}</span>}
                    <span className='block mt-4  text-xl font-medium' htmlFor="">Password</span>
                    <input {...register('password')} className='block mt-2 p-2 h-[43px] border-[1px] border-black rounded-md w-full' type="password" />
                    {error && <span className='text-red-700 text-sm'>{error?.data?.message}</span>}
                    {errors.password && <span className='text-red-700 text-sm'>{errors.password?.message}</span>}
                    <Link to='/reset-password'><p className='text-right font-semibold text-sm hover:underline mt-1'>Forgot Password</p></Link>
                    <button disabled={isLoading} className='bg-black text-white font-medium px-4 py-2 rounded-md w-fit self-center mt-2 flex items-center gap-1' > {isLoading ? <RotatingLines strokeColor='white' width='20' /> : 'Login'}</button>
                    <p className='text-sm font-semibold text-right mt-2'>Dont have a account ? <span className='hover:underline'><Link to='/register'>Register</Link></span></p>
                </div>
            </form>
        </>
    )
}

export default Login