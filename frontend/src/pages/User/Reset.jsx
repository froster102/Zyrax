import { useState } from 'react'
import { Flip, ToastContainer, toast } from 'react-toastify'

function Reset() {
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')

  function handleSubmit(e) {
    e.preventDefault()
    if (password.length !== 6) {
      toast('Password must be of at least 6 characters')
    } else if (password !== confirmPassword) {
      toast('Password Do not match')
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
        <div className='w-fit py-4 px-6 border-[1px] border-[#CFCBCB] rounded-xl bg-white flex flex-col ml-auto mr-auto mt-16 mb-[116px]'>
          <span className='block mt-4  text-xl font-normal' htmlFor="">New Password</span>
          <input className='block mt-2 p-2 border-[1px] h-[43px] border-black rounded-md w-full' onChange={(e) => { setPassword(e.target.value) }} value={password} type="password" />
          <span className='block mt-4  text-xl font-normal' htmlFor="">Confirm new password</span>
          <input className='block mt-2 p-2 border-[1px] h-[43px] border-black rounded-md w-full' onChange={(e) => { setConfirmPassword(e.target.value) }} value={confirmPassword} type="password" />
          <button className='bg-black text-white font-medium px-4 py-2 rounded-md w-fit self-center mt-4' >Confirm</button>
        </div>
      </form>
    </>
  )
}

export default Reset