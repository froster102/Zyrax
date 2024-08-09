import { useEffect, useState } from 'react'
import { Link, useLocation } from 'react-router-dom';
import { ToastContainer, toast, Flip } from 'react-toastify';
import { useSigninMutation } from '../../features/userApiSlice';
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom';
import { selectUserToken, setUserCredentials } from '../../features/authSlice';
import { FaGoogle } from 'react-icons/fa6';
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'

const schema = z.object({
    email: z.string().trim().email('Enter a valid email'),
    password: z.string().min(1,'Required')
})

function Login() {
    const dispatch = useDispatch()
    const [signin, { isLoading }] = useSigninMutation()
    const navigate = useNavigate()
    const location = useLocation()
    const redirect = location?.state?.from?.pathname || '/'
    const user = useSelector(selectUserToken)
    const { register, handleSubmit, formState: { errors }, reset } = useForm({
        resolver: zodResolver(schema)
    })

    useEffect(() => {
        if (user) {
            navigate(redirect, { replace: true })
        }
    }, [])

    useEffect(() => {
        function handleAuthMsg(e) {
            if (e.origin !== 'http://localhost:3000') return
            handleAuth(e.data)
        }
        window.addEventListener('message', handleAuthMsg)

        return () => {
            window.removeEventListener('message', handleAuthMsg)
        }
    }, [])

    async function onSubmit(data) {
        const { email, password } = data
        try {
            const res = await signin({ email, password }).unwrap()
            console.log(res)
            dispatch(setUserCredentials({ ...res }))
            navigate(redirect, { replace: true })
        } catch (error) {
            toast(error?.data?.message)
        }
    }

    function signInWithGoogle() {
        window.open('http://localhost:3000/api/v1/users/auth/google', '_blank', 'width=600,height=600')
    }

    function handleAuth({ accessToken, role, error }) {
        if (error) {
            return toast(error)
        }
        dispatch(setUserCredentials({ accessToken, role }))
        navigate(redirect, { replace: true })
    }

    return (
        <>
            <ToastContainer className='mt-10 rounded-lg font-semibold text-center'
                position='top-center'
                autoClose='1000'
                theme='dark'
                hideProgressBar={true}
                transition={Flip}
            ></ToastContainer>
            <form action="" onSubmit={handleSubmit(onSubmit)}>
                <div className='w-fit py-4 px-6 border-[1px] border-[#CFCBCB] rounded-xl bg-white flex flex-col ml-auto mr-auto mt-16'>
                    <h1 className='text-4xl text-center font-medium'>Login</h1>
                    <div className='w-full bg-black rounded-md mt-2 text-white flex items-center justify-center py-2' onClick={signInWithGoogle}>Sign in with google<FaGoogle className='inline ml-2' /></div>
                    <span className='block mt-2  text-xl font-medium' htmlFor="">Email</span>
                    <input {...register('email')} className='block mt-2 p-2 border-[1px] h-[43px] border-black rounded-md w-full' type="text" />
                    {errors.email && <span className='text-red-700 text-sm'>{errors.email?.message}</span>}
                    <span className='block mt-4  text-xl font-medium' htmlFor="">Password</span>
                    <input {...register('password')} className='block mt-2 p-2 h-[43px] border-[1px] border-black rounded-md w-full' type="password" />
                    {errors.password && <span className='text-red-700 text-sm'>{errors.password?.message}</span>}
                    <Link to='/reset-password'><p className='text-right font-semibold text-sm hover:underline mt-1'>Forgot Password</p></Link>
                    <button className='bg-black text-white font-medium px-4 py-2 rounded-md w-fit self-center mt-2' >Login</button>
                    <p className='text-sm font-semibold text-right mt-2'>Don't have a account ? <span className='hover:underline'><Link to='/register'>Register</Link></span></p>
                </div>
            </form>
        </>
    )
}

export default Login