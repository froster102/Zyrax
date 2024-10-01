import PropTypes from 'prop-types'
import { useForm } from 'react-hook-form'
import { IoMdClose } from 'react-icons/io'
import { zodResolver } from '@hookform/resolvers/zod'
import addCouponSchema from '../../ValidationSchema/addCouponSchema'

function AddCouponModal({ handleAddCoupon, onClose }) {
    const { register, handleSubmit, formState: { errors }, getValues, setValue } = useForm({
        resolver: zodResolver(addCouponSchema)
    })

    function onSubmit(data) {
        const isoDate = new Date(`${data.expiration_date}T${data.expiration_time}`).toISOString()
        const updatedData = { ...data, expirationDate: isoDate }
        handleAddCoupon(updatedData)
        onClose()
    }

    return (
        <div className="relative z-10" aria-labelledby="view category">
            <div className="fixed inset-0 bg-[#f1f1f1] bg-opacity-75 transition-all backdrop-blur-sm"></div>
            <div className="fixed inset-0 z-10 w-screen overflow-y-auto">
                <div className="flex min-h-full justify-center items-center px-2 py-12 text-center ">
                    <div className="relative text-left p-10 rounded-2xl bg-zinc-200 text-black `">
                        <button
                            className="rounded-md p-1 inline-flex items-center justify-center text-black hover:bg-black hover:text-white transition ease-in duration-75 focus:outline-none absolute top-2 right-2"
                            onClick={onClose} >
                            <IoMdClose size={20} />
                        </button>
                        <div>
                            <form action="" onSubmit={handleSubmit(onSubmit)}>
                                <label htmlFor="">Coupon code</label>
                                <input
                                    {...register('code')}
                                    className='p-2 block rounded-md' type="text"
                                    value={getValues('')}
                                />
                                {errors && <span className='text-red-700 text-sm'>{errors?.code?.message}</span>}
                                <label className='block pt-4' htmlFor="">Discount Percentage</label>
                                <input
                                    {...register('discount')}
                                    className='p-2 block rounded-md' type="text"
                                    value={getValues('discount') || ''}
                                    onChange={(e) => {
                                        const value = e.target.value
                                        if (value >= 0 && value <= 100) setValue('discount', Number(value), { shouldValidate: true })
                                    }}
                                />
                                {errors && <span className='text-red-700 text-sm'>{errors?.discount?.message}</span>}
                                <label className='block pt-4' htmlFor="">Expiration Date</label>
                                <div className='flex gap-2'>
                                    <input {...register('expiration_date')} className='p-2 appearance-none block rounded-md' type="date" />
                                    <input {...register('expiration_time')} className='p-2 block rounded-md' type="time" />
                                </div>
                                <div className='max-w-64'>
                                    {errors && <span className='text-wrap text-red-700 text-sm'>{errors?.expiration_date?.message}</span>}
                                    {errors && <span className='block text-red-700 text-sm'>{errors?.expiration_time?.message}</span>}
                                </div>
                                <label className='block pt-4' htmlFor="">Minimum purchase amount</label>
                                <input
                                    {...register('minPurchaseAmount')}
                                    className='p-2 block rounded-md' type="text"
                                    value={getValues('minPurchaseAmount') || ''}
                                    onChange={(e) => {
                                        const value = e.target.value
                                        if (!isNaN(value)) setValue('minPurchaseAmount', value, { shouldValidate: true })
                                    }}
                                />
                                {errors && <span className='max-w-64 block text-red-700 text-sm'>{errors?.minPurchaseAmount?.message}</span>}
                                <label className='block pt-4' htmlFor="">Maximum discount amount</label>
                                <input
                                    {...register('maxDiscountAmount')}
                                    className='p-2 block rounded-md' type="text"
                                    value={getValues('maxDiscountAmount') || ''}
                                    onChange={(e) => {
                                        const value = e.target.value
                                        if (!isNaN(value)) setValue('maxDiscountAmount', value, { shouldValidate: true })
                                    }}
                                />
                                {errors && <span className='text-red-700 text-sm'>{errors?.maxDiscountAmount?.message}</span>}
                                <div className='flex justify-center pt-4'>
                                    <button className='bg-zinc-900 px-4 py-2 rounded-md text-white'>Add Coupon</button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </div>

    )
}

AddCouponModal.propTypes = {
    handleAddCoupon: PropTypes.func.isRequired,
    onClose: PropTypes.func.isRequired
}

export default AddCouponModal