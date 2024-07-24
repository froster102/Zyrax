import  { useState } from 'react'
import Socialbutton from '../../components/Socialbutton'
import { AiFillGoogleCircle, AiFillTwitterCircle } from 'react-icons/ai'
import { FaFacebook, FaMobileAlt } from 'react-icons/fa'
import { Link } from 'react-router-dom'
import { Flip, toast, ToastContainer } from 'react-toastify'

function Register() {
  const [firstName, setFirstName] = useState('')
  const [lastName, setLastName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')

  function handleSubmit(e) {
    e.preventDefault()
    const regex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/
    if (!firstName || !lastName || !email || !password || !confirmPassword) {
      toast('All field should completed')
    } else if (!regex.test(email)) {
      toast('Enter a valid email')
    } else if (password.length !== 6) {
      toast('Password must be at least 6 character long')
    } else if (password !== confirmPassword) {
      toast('Password do not match')
    } else {
      toast('Sucess')
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
      <form action="" onSubmit={handleSubmit}>
        <div className='w-[348px] py-4 px-6 border-[1px] border-[#CFCBCB] rounded-xl bg-white flex flex-col ml-auto mr-auto mt-16'>
          <h1 className='text-4xl text-center font-medium'>Register</h1>
          <div className='flex gap-4 mt-4 items-center justify-center'>
            <Socialbutton icon={<AiFillGoogleCircle size={35}></AiFillGoogleCircle>}></Socialbutton>
            <Socialbutton icon={<FaFacebook size={35}></FaFacebook>}></Socialbutton>
            <Socialbutton icon={<AiFillTwitterCircle size={35}></AiFillTwitterCircle>}></Socialbutton>
            <Link to='/mobile-signin' ><Socialbutton icon={<FaMobileAlt size={35}></FaMobileAlt>}></Socialbutton></Link>
          </div>
          <span className='block text-center text-lg mt-1'>Or</span>
          <div className='flex'>
            <div>
              <span className='block mt-4  text-xl font-medium' htmlFor="">First Name</span>
              <input className='mt-2 p-1 border-[1px] h-[43px] border-black rounded-md w-full' value={firstName} onChange={(e) => { setFirstName(e.target.value) }} type="text" />
            </div>
            <div className='ml-2'>
              <span className='block mt-4  text-xl font-medium' htmlFor="">Last Name</span>
              <input className='mt-2 p-1 h-[43px] border-[1px] border-black rounded-md w-full' value={lastName} onChange={(e) => { setLastName(e.target.value) }} type="text" />
            </div>
          </div>
          <div className='mt-4'>
            <span className='block text-xl font-medium' htmlFor="">Email</span>
            <input className='mt-2 p-2 h-[43px] border-[1px] border-black rounded-md w-full' value={email} onChange={(e) => { setEmail(e.target.value) }} type="text" />
          </div>
          <div className='mt-4'>
            <span className='block text-xl font-medium' htmlFor="">Password</span>
            <input className='mt-2 p-2 h-[43px] border-[1px] border-black rounded-md w-full' value={password} onChange={(e) => { setPassword(e.target.value) }} type="password" />
          </div>
          <div className='mt-4'>
            <span className='block text-xl font-medium' htmlFor="">Confirm Password</span>
            <input className='mt-2 p-2 h-[43px] border-[1px] border-black rounded-md w-full' value={confirmPassword} onChange={(e) => { setConfirmPassword(e.target.value) }} type="password" />
          </div>
          <button className='bg-black text-white font-medium px-4 py-2 rounded-md w-fit self-center mt-2' >Sign up</button>
          <p className='text-sm font-semibold text-right mt-2'>Already have a account ? <span className='hover:underline'><Link to='/login' >Login</Link></span></p>
        </div>
      </form>
    </>
  )
}

export default Register