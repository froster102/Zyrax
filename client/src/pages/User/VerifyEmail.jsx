import { useEffect, useRef, useState } from 'react'
import { Flip, ToastContainer } from 'react-toastify'

function VerifyEmail() {
    const [otp, setOtp] = useState(new Array(4).fill(''))
    const otpBoxRef = useRef([])
    const [otpAttempt,setOtpAttempt] = useState(0)
    const [sec,setSec] = useState(0)

    useEffect(()=>{
        startTimer(20)
    },[otpAttempt])

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

    function handleSubmit(e) {
        e.preventDefault()
    }

    function handleOtpChange(value, index) {
        if (!isNaN(value) && value.length === 1) {
            let newArr = [...otp]
            newArr[index] = value
            setOtp(newArr)
            if (value && index < 3) {
                otpBoxRef.current[index + 1].focus()
            }
        }

    }

    console.log(otp)

    function handleBackspaceAndEnter(e, index) {
        if (e.key === 'Backspace') {
            let newArr = [...otp]
            newArr[index] = ''
            setOtp(newArr)
            if (index > 0) {
                otpBoxRef.current[index - 1].focus()
            }
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
                <div className='w-fit py-4 px-6 border-[1px] border-[#CFCBCB] rounded-xl bg-white flex flex-col ml-auto mr-auto mt-[126px] mb-[126px]'>
                    <h1 className='text-4xl text-center font-medium'>Verify Your Email</h1>
                    <span className='block mt-4  text-xl font-normal' htmlFor="">Enter OTP</span>
                    <div className='flex'>
                        {otp.map((value, index) => (
                            <input key={index} ref={el => otpBoxRef.current[index] = el} value={value} onChange={(e) => { handleOtpChange(e.target.value, index) }} onKeyUp={(e) => { handleBackspaceAndEnter(e, index) }} className='border-[1px] border-black rounded-[8px] w-[47px] h-[43px] ml-2 text-center' type="text" />
                        ))}
                        <p className='self-end text-sm font-medium ml-1'>00:{sec}s</p>
                    </div>
                    <p className='text-right text-sm font-medium mt-1 hover:underline'>Resend OTP</p>
                    <button className='bg-black text-white font-medium px-4 py-2 rounded-md w-fit self-center mt-2' >Continue</button>
                </div>
            </form>
        </>
    )
}

export default VerifyEmail