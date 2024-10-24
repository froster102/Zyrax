import { useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { selectUserToken, setUserCredentials } from '../../store/slices/authSlice'
import { FaGoogle } from "react-icons/fa6";
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import registerSchema from '../../../ValidationSchema/registerSchema'
import toast from 'react-hot-toast'
import { selectActiveGender } from '../../store/slices/userSlice'
import { RotatingLines } from 'react-loader-spinner'
import { useGoogleSigninMutation, useSignupMutation } from '../../store/api/authApiSlice';
import { useGoogleLogin } from '@react-oauth/google';

function Register() {
  const dispatch = useDispatch()
  const [signup, { isLoading }] = useSignupMutation()
  const navigate = useNavigate()
  const userAuth = useSelector(selectUserToken)
  const activeGender = useSelector(selectActiveGender)
  const [googleSignin, { isLoading: isGoogleAuthLoading }] = useGoogleSigninMutation()

  const { register, handleSubmit, formState: { errors }, reset } = useForm({
    resolver: zodResolver(registerSchema)
  })

  useEffect(() => {
    if (userAuth) {
      navigate(`/${activeGender}`)
    }
  }, [navigate, userAuth, activeGender])

  const signInWithGoogle = useGoogleLogin({
    onSuccess: (authResponse) => handleGoogleSignin(authResponse),
    flow: 'auth-code',
    scope: 'email profile'
  })

  async function onSubmit(data) {
    const { firstName, lastName, email, password } = data
    try {
      const res = await signup({ firstName, lastName, email, password }).unwrap()
      toast(res?.message, {
        position: 'top-center',
        duration: 3000
      })
      reset()
      navigate('/login')
    } catch (error) {
      toast(error?.data?.message, {
        position: 'top-center',
        duration: 3000
      })
      reset()
    }
  }

  async function handleGoogleSignin(authResponse) {
    try {
      if (authResponse?.code) {
        const res = await googleSignin({ authCode: authResponse.code }).unwrap()
        dispatch(setUserCredentials({ ...res }))
      } else {
        throw new Error('Google authorization failed')
      }
    } catch (error) {
      toast(error?.data?.message)
    }
  }

  return (
    <>
      <form action="" onSubmit={handleSubmit(onSubmit)}>
        <div className='w-[348px] py-4 px-6 border-[1px] border-[#CFCBCB] rounded-xl bg-white flex flex-col ml-auto mr-auto mt-16'>
          <h1 className='text-4xl text-center font-medium'>Register</h1>
          <div className='w-full bg-black rounded-md mt-2 text-white flex items-center justify-center py-2' onClick={signInWithGoogle}>Sign in with google<FaGoogle className='inline ml-2' /></div>
          <div className='flex'>
            <div>
              <span className='block mt-4  text-xl font-medium' htmlFor="">First Name</span>
              <input {...register('firstName')} className='mt-2 p-2 border-[1px] h-[43px] border-black rounded-md w-full' type="text" />
              {errors.firstName && <span className='text-red-700 text-sm'>{errors.firstName?.message}</span>}
            </div>
            <div className='ml-2'>
              <span className='block mt-4  text-xl font-medium' htmlFor="">Last Name</span>
              <input {...register('lastName')} className='mt-2 p-2 h-[43px] border-[1px] border-black rounded-md w-full' type="text" />
              {errors.firstName && <span className='text-red-700 text-sm'>{errors.firstName?.message}</span>}
            </div>
          </div>
          <div className='mt-4'>
            <span className='block text-xl font-medium' htmlFor="">Email</span>
            <input {...register('email')} className='mt-2 p-2 h-[43px] border-[1px] border-black rounded-md w-full' type="text" />
            {errors.email && <span className='text-red-700 text-sm'>{errors.email?.message}</span>}
          </div>
          <div className='mt-4'>
            <span className='block text-xl font-medium' htmlFor="">Password</span>
            <input {...register('password')} className='mt-2 p-2 h-[43px] border-[1px] border-black rounded-md w-full' type="password" />
            {errors.password && <span className='text-red-700 text-sm'>{errors.password?.message}</span>}
          </div>
          <div className='mt-4'>
            <span className='block text-xl font-medium' htmlFor="">Confirm Password</span>
            <input {...register('confirmPassword')} className='mt-2 p-2 h-[43px] border-[1px] border-black rounded-md w-full' type="password" />
            {errors.confirmPassword && <span className='text-red-700 text-sm'>{errors.confirmPassword?.message}</span>}
          </div>
          <button disabled={isLoading} className='bg-black text-white font-medium px-4 py-2 rounded-md w-fit self-center mt-2' >{isLoading || isGoogleAuthLoading ? <RotatingLines strokeColor='white' width='20' /> : 'Signup'}</button>
          <p className='text-sm font-semibold text-right mt-2'>Already have a account ? <span className='hover:underline'><Link to='/login' >Login</Link></span></p>
        </div>
      </form>
    </>
  )
}

export default Register