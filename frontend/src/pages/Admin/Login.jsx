import { useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { Flip, toast, ToastContainer } from 'react-toastify'
import { useDispatch, useSelector } from 'react-redux'
import { useAdminSigninMutation } from '../../features/adminApiSlice'
import { setUserCredentials } from '../../features/authSlice'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'

const schema = z.object({
  email: z.string().trim().min(1,'Required').email('Enter a valid email'),
  password: z.string().min(1,'Required')
})

function Login() {
  const dispactch = useDispatch()
  const navigate = useNavigate()
  const [signin, { isLoading }] = useAdminSigninMutation()
  const location = useLocation()
  const redirect = location?.state?.from?.pathname || '/admin/dashboard'
  const { register, handleSubmit, formState: { errors }, reset } = useForm({
    resolver: zodResolver(schema)
  })
  async function onSubmit(data) {
    const { email, password } = data
    try {
      const res = await signin({ email, password }).unwrap()
      const { accessToken, role } = res
      dispactch(setUserCredentials({ accessToken, role }))
      navigate(redirect, { replace: true })
    } catch (err) {
      toast(err?.data?.message)
      console.log(err)
    }
  }

  return (
    <>
      <ToastContainer className='mt-10 rounded-lg font-bold text-center'
        position='top-center'
        autoClose='1000'
        theme='dark'
        hideProgressBar={true}
        transition={Flip}
      ></ToastContainer>
      <div className='bg-[#F1F1F1] flex justify-center items-center h-dvh'>
        <form action="" onSubmit={handleSubmit(onSubmit)}>
          <div className='w-fit py-4 px-6 border-[1px] border-[#CFCBCB] rounded-xl bg-white flex flex-col ml-auto mr-auto mt-16'>
            <h1 className='text-4xl text-center font-medium'>Admin Login</h1>
            <span className='block mt-4  text-xl font-medium' htmlFor="">Email</span>
            <input {...register('email')} className='block mt-2 p-2 border-[1px] h-[43px] border-black rounded-md w-full' type="text" />
            {errors.email && <span className='text-red-700 text-sm'>{errors.email?.message}</span>}
            <span className='block mt-4  text-xl font-medium' htmlFor="">Password</span>
            <input {...register('password')} className='block mt-2 p-2 h-[43px] border-[1px] border-black rounded-md w-full' type="password" />
            {errors.password && <span className='text-red-700 text-sm'>{errors.password?.message}</span>}
            <Link to='/reset-password'><p className='text-right font-semibold text-sm hover:underline mt-1'>Forgot Password</p></Link>
            <button className='bg-black text-white font-medium px-4 py-2 rounded-md w-fit self-center mt-2' >Login</button>
          </div>
        </form>
      </div>
    </>
  )
}

export default Login