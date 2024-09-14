import { useForm } from 'react-hook-form'
import { RotatingLines } from 'react-loader-spinner'
import toast from 'react-hot-toast'
import { useNavigate, useParams } from 'react-router-dom'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { useSelector } from 'react-redux'
import { selectUserToken } from '../features/authSlice'
import { selectActiveGender } from '../features/userSlice'
import { useEffect } from 'react'
import { useResetPasswordMutation } from '../features/authApiSlice'

const schema = z.object({
    password: z.string().min(6, 'Must be minimum of 6 characters').regex(/^(?=.*[A-Za-z])(?=.*\d)(?=.*[\W_])[A-Za-z\d\W_]{6,}$/, 'Must contain a letter,number,a special character'),
    confirmPassword: z.string().min(1, 'Required')
}).refine(data => data.password === data.confirmPassword, { message: 'Password do not match', path: ['confirmPassword'] })

function ResetPassword() {
    const navigate = useNavigate()
    const { token } = useParams()
    const { handleSubmit, register, formState: { errors } } = useForm({
        resolver: zodResolver(schema)
    })
    const [resetPassword, { isLoading }] = useResetPasswordMutation()
    const user = useSelector(selectUserToken)
    const gender = useSelector(selectActiveGender)
    const redirect = location?.state?.from?.pathname || `/${gender}`

    useEffect(() => {
        if (user) {
            navigate(redirect, { replace: true })
        }
    }, [navigate, redirect, user])

    async function onSubmit(data) {
        try {
            const res = await resetPassword({ token, password: data.password }).unwrap()
            toast(res?.message, {
                position: 'top-center'
            })
            navigate('/login', { replace: true })
        } catch (error) {
            toast(error?.data?.message, {
                position: 'top-center'
            })
        }
    }
    return (
        <form className='py-20' action="" onSubmit={handleSubmit(onSubmit)}>
            <div className='w-fit py-4 px-6 border-[1px] border-[#CFCBCB] rounded-xl bg-white flex flex-col ml-auto mr-auto mt-16'>
                <span className='block mt-2  text-xl font-medium' htmlFor="">Enter new password</span>
                <input {...register('password', {
                    required: 'Required',
                })} className='block mt-2 p-2 border-[1px] h-[43px] border-black rounded-md w-full' type="password" />
                {errors.password && <span className='text-red-700 text-sm'>{errors.password?.message}</span>}
                <span className='block mt-2  text-xl font-medium' htmlFor="">Confirm new password</span>
                <input {...register('confirmPassword', {
                    required: 'Required',
                })} className='block mt-2 p-2 border-[1px] h-[43px] border-black rounded-md w-full' type="password" />
                {errors.confirmPassword && <span className='text-red-700 text-sm'>{errors.confirmPassword?.message}</span>}
                <button disabled={isLoading} className='bg-black text-white font-medium px-4 py-2 rounded-md w-fit self-center mt-2 flex items-center gap-1' > {isLoading ? <RotatingLines strokeColor='white' width='20' /> : 'Submit'}</button>
            </div>
        </form>
    )
}

export default ResetPassword