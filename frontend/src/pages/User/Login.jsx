import { useEffect, useState } from 'react'
import Socialbutton from '../../components/Socialbutton'
import { AiFillGoogleCircle } from "react-icons/ai";
import { FaFacebook } from "react-icons/fa";
import { FaMobileAlt } from "react-icons/fa";
import { AiFillTwitterCircle } from "react-icons/ai";
import { Link, useLocation } from 'react-router-dom';
import { ToastContainer, toast, Flip } from 'react-toastify';
import { useSigninMutation } from '../../features/userApiSlice';
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom';
import { setUserCredentials } from '../../features/authSlice';

function Login() {
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const dispatch = useDispatch()
    const [signin, { isLoading }] = useSigninMutation()
    const navigate = useNavigate()
    const location = useLocation()
    const redirect = location?.state?.from?.pathname || '/'

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

    async function handleSubmit(e) {
        e.preventDefault()
        const regex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/
        if (email.length === 0 || password.length === 0) {
            toast('Fields should not be empty')
        } else if (!regex.test(email)) {
            toast('Enter a valid email')
        } else {
            try {
                const res = await signin({ email, password }).unwrap()
                console.log(res)
                dispatch(setUserCredentials({ token: res?.accessToken }))
                navigate('/', { replace: true })
            } catch (error) {
                toast(error?.data?.message)
            }
        }
    }

    function signInWithGoogle() {
        window.open('http://localhost:3000/api/user/auth/google', '_blank', 'width=600,height=600')
    }

    function handleAuth({ accessToken }) {
        dispatch(setUserCredentials({ token: accessToken }))
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
            <form action="" onSubmit={handleSubmit}>
                <div className='w-fit py-4 px-6 border-[1px] border-[#CFCBCB] rounded-xl bg-white flex flex-col ml-auto mr-auto mt-16'>
                    <h1 className='text-4xl text-center font-medium'>Login</h1>
                    <div className='flex gap-4 mt-4 items-center justify-center'>
                        <div onClick={signInWithGoogle}><Socialbutton icon={<AiFillGoogleCircle size={35}></AiFillGoogleCircle>}></Socialbutton></div>
                        <div><Socialbutton icon={<FaFacebook size={35}></FaFacebook>}></Socialbutton></div>
                        <div><Socialbutton icon={<AiFillTwitterCircle size={35}></AiFillTwitterCircle>}></Socialbutton></div>
                        <Link to='/mobile-signin' ><Socialbutton icon={<FaMobileAlt size={35}></FaMobileAlt>}></Socialbutton></Link>
                    </div>
                    <span className='block mt-4  text-xl font-medium' htmlFor="">Email</span>
                    <input className='block mt-2 p-2 border-[1px] h-[43px] border-black rounded-md w-full' value={email} onChange={(e) => setEmail(e.target.value)} type="text" />
                    <span className='block mt-4  text-xl font-medium' htmlFor="">Password</span>
                    <input className='block mt-2 p-2 h-[43px] border-[1px] border-black rounded-md w-full' value={password} onChange={(e) => setPassword(e.target.value)} type="password" />
                    <Link to='/reset-password'><p className='text-right font-semibold text-sm hover:underline mt-1'>Forgot Password</p></Link>
                    <button className='bg-black text-white font-medium px-4 py-2 rounded-md w-fit self-center mt-2' >Login</button>
                    <p className='text-sm font-semibold text-right mt-2'>Don't have a account ? <span className='hover:underline'><Link to='/register'>Register</Link></span></p>
                </div>
            </form>
        </>
    )
}

export default Login