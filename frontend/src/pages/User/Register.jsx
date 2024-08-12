import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Flip, toast, ToastContainer } from 'react-toastify'
import { useDispatch } from 'react-redux'
import { useSignupMutation } from '../../features/userApiSlice'
import { setUserCredentials } from '../../features/authSlice'
import { FaGoogle } from "react-icons/fa6";
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'


const schema = z.object({
  firstName: z.string().trim().min(1, 'Required').min(3, 'Must be minimum of 3 characters'),
  lastName: z.string().trim().min(1, 'Required').min(3, 'Must be minimum of 3 characters'),
  email: z.string().trim().email('Enter a valid email').min(1, 'Required'),
  password: z.string().min(6, 'Must be minimum of 6 characters').regex(/^(?=.*[A-Za-z])(?=.*\d)(?=.*[\W_])[A-Za-z\d\W_]{6,}$/, 'Must contain a letter,number,a special character'),
  confirmPassword: z.string().min(1, 'Required')
}).refine((data) => data.password === data.confirmPassword, {
  message: 'Password do not match',
  path: ['confirmPassword']
})


function Register() {
  const dispatch = useDispatch()
  const [signup, { isLoading }] = useSignupMutation()
  const navigate = useNavigate()

  const { register, handleSubmit, formState: { errors }, reset } = useForm({
    resolver: zodResolver(schema)
  })



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

  function signInWithGoogle() {
    window.open('http://localhost:3000/api/v1/users/auth/google', '_blank', 'width=600,height=600')
  }

  async function onSubmit(data) {
    const { firstName, lastName, email, password } = data
    try {
      const res = await signup({ firstName, lastName, email, password }).unwrap()

      reset()
    } catch (error) {
      toast(error?.data?.message)
      reset()
    }
  }


  function handleAuth({ accessToken, role }) {
    dispatch(setUserCredentials({ accessToken, role }))
    navigate('/', { replace: true })
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
          <button className='bg-black text-white font-medium px-4 py-2 rounded-md w-fit self-center mt-2' >Sign up</button>
          <p className='text-sm font-semibold text-right mt-2'>Already have a account ? <span className='hover:underline'><Link to='/login' >Login</Link></span></p>
        </div>
      </form>
    </>
  )
}

export default Register