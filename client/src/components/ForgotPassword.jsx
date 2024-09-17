import { useForm } from 'react-hook-form'
import { RotatingLines } from 'react-loader-spinner'
import toast from 'react-hot-toast'
import { useNavigate } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { selectActiveGender } from '../store/slices/userSlice'
import { useEffect } from 'react'
import { selectUserToken } from '../store/slices/authSlice'
import { useForgotPasswordMutation } from '../store/api/authApiSlice'

function ForgotPassword() {
    const [forgotPassword, { isLoading }] = useForgotPasswordMutation()
    const { register, formState: { errors }, handleSubmit } = useForm()
    const user = useSelector(selectUserToken)
    const gender = useSelector(selectActiveGender)
    const navigate = useNavigate()
    const redirect = location?.state?.from?.pathname || `/${gender}`

    useEffect(() => {
        if (user) {
            navigate(redirect, { replace: true })
        }
    }, [navigate, redirect, user])

    async function onSubmit(data) {
        try {
            const res = await forgotPassword({ email: data.email }).unwrap()
            toast(res.message, {
                position: 'top-center',
                duration: 4000
            })
        } catch (error) {
            toast(error?.data?.message, {
                position: 'top-center'
            })
        }
    }

    return (
        <>
            <form className='py-20' action="" onSubmit={handleSubmit(onSubmit)}>
                <div className='w-fit py-4 px-6 border-[1px] border-[#CFCBCB] rounded-xl bg-white flex flex-col ml-auto mr-auto mt-16'>
                    <span className='block mt-2  text-xl font-medium' htmlFor="">Enter your email</span>
                    <input {...register('email', {
                        required: 'Email is required',
                        pattern: {
                            value: /^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/g,
                            message: 'Enter a valid email'
                        }
                    })} className='block mt-2 p-2 border-[1px] h-[43px] border-black rounded-md w-full' type="text" />
                    {errors.email && <span className='text-red-700 text-sm'>{errors.email?.message}</span>}
                    <button disabled={isLoading} className='bg-black text-white font-medium px-4 py-2 rounded-md w-fit self-center mt-2 flex items-center gap-1' > {isLoading ? <RotatingLines strokeColor='white' width='20' /> : 'Submit'}</button>
                </div>
            </form>
        </>
    )
}

export default ForgotPassword