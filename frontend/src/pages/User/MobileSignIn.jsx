import { useEffect, useRef, useState } from 'react'
import { Flip, ToastContainer, toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css';

const OTP = 1234
function MobileSignIn() {
  const [number, setNumber] = useState('')
  const [otp, setOtp] = useState(new Array(4).fill(''))
  const otpBoxRef = useRef([])
  const [otpAttempt, setOtpAttempt] = useState(0)
  const [sec, setSec] = useState(0)


  function startTimer(sec) {
    function tick() {
      setSec(sec)
      sec--
      if (sec >= 0) {
        setTimeout(tick, 1000)
      } else {
      }
    }
    tick();
  }

  function handleNumberChange(e) {
    if (!isNaN((e.target.value)) && e.target.value.length < 11) {
      setNumber(e.target.value)
    }
  }

  function handleOtpChange(value, index) {
    if (!isNaN(value) && value.length === 1) {
      let newArr = [...otp]
      newArr[index] = value
      setOtp(newArr)
    }
    if (value && index < 3) {
      otpBoxRef.current[index + 1].focus()
    }
  }

  function handleBackspaceAndEnter(e, index) {
    if (e.key === 'Backspace') {
      let newArr = [...otp]
      newArr[index] = ''
      setOtp(newArr)
      console.log(otp)
      if (index > 0) {
        otpBoxRef.current[index - 1].focus()
      }
    }
  }

  function handleSubmit(e) {
    e.preventDefault()
    if (number.length === 0 || otp.length === 0) {
      toast('Field should not be empty')
    } else if (number.length < 10) {
      toast('Enter a valid mobile number')
    } else {
      if (Number(Number(otp.toString().split(',').join(''))) === OTP) {
        toast('Sucess')
      } else {
        toast('Wrong otp')
      }
    }
  }

  function handleSendOtp() {
    if (number.length !== 10) {
      toast('Enter a valid mobile number')
    } else if (sec === 0) {
      toast('Otp sent sucessfully')
      startTimer(20)
    }
  }

  function handleResendOtp() {
    if (sec === 0) {
      handleSendOtp()
    } else {
      toast('Please wait before retry')
    }
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
      <div className='w-fit py-4 px-6 border-[1px] border-[#CFCBCB] rounded-xl bg-white flex flex-col ml-auto mr-auto mt-16 mb-[116px]'>
        <h1 className='text-4xl text-center font-medium'>Mobile Sign In</h1>
        <span className='block mt-4  text-xl font-normal' htmlFor="">Enter your mobile number</span>
        <div className='flex'>
          <input className='mt-2 p-2 border-[1px] h-[43px] border-black rounded-md ' onChange={handleNumberChange} value={number} type="text" inputMode='numeric' />
          <button onClick={() => { handleSendOtp() }} className='ml-2 bg-black text-white font-medium px-4 py-2 rounded-md w-fit self-center mt-2' >Send Otp</button>
        </div>
        <span className='block mt-4  text-xl font-normal' htmlFor="">Enter OTP</span>
        <div className='flex'>
          {otp.map((value, index) => (
            <input key={index} ref={el => otpBoxRef.current[index] = el} value={value} onChange={(e) => { handleOtpChange(e.target.value, index) }} onKeyUp={(e) => { handleBackspaceAndEnter(e, index) }} className='border-[1px] border-black rounded-[8px] w-[47px] h-[43px] ml-2 text-center' type="text" />
          ))}
          <p className='self-end text-sm font-medium ml-1'>00:{sec}s</p>
        </div>
        <p onClick={() => { handleResendOtp() }} className='text-right text-sm font-medium mt-1 hover:underline'>Resend OTP</p>
        <button onClick={handleSubmit} className='bg-black text-white font-medium px-4 py-2 rounded-md w-fit self-center mt-2' >Verify</button>
      </div>
    </>
  )
}

export default MobileSignIn