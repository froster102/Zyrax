import { useForm } from "react-hook-form"
import { IoMdClose } from "react-icons/io"
import PropTypes from 'prop-types'
import { zodResolver } from "@hookform/resolvers/zod"
import addOfferSchema from "../../ValidationSchema/addOfferSchema"

function AddOfferModal({ handleAddOffer, onClose }) {
    const { register, handleSubmit, formState: { errors }, getValues, setValue } = useForm({
        resolver: zodResolver(addOfferSchema)
    })

    function onSubmit(data) {
        const updatedData = {
            ...data,
            endDate: new Date(data.endDate).toISOString(),
        }
        handleAddOffer(updatedData)
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
                                <label htmlFor="">Offer name</label>
                                <input
                                    {...register('name')}
                                    className='p-2 block rounded-md' type="text"
                                    value={getValues('')}
                                />
                                {errors && <span className='text-red-700 text-sm'>{errors?.name?.message}</span>}
                                <label className='block pt-4' htmlFor="">Discount Percentage</label>
                                <input
                                    {...register('discountPercentage', { valueAsNumber: true })}
                                    className='p-2 block rounded-md' type="text"
                                    value={getValues('discountPercentage') || ''}
                                    onChange={(e) => {
                                        const value = e.target.value
                                        if (value >= 0 && value <= 100) setValue('discountPercentage', Number(value), { shouldValidate: true })
                                    }}
                                />
                                {errors && <span className='text-red-700 text-sm'>{errors?.discountPercentage?.message}</span>}
                                <label className='block pt-4' htmlFor="">End Date</label>
                                <input {...register('endDate')} className='p-2 w-full block rounded-md' type="date" />
                                {errors && <span className='text-red-700 text-sm'>{errors?.endDate?.message}</span>}
                                <div className='max-w-64'>
                                    {errors && <span className='text-wrap text-red-700 text-sm'>{errors?.expiration_date?.message}</span>}
                                    {errors && <span className='block text-red-700 text-sm'>{errors?.expiration_time?.message}</span>}
                                </div>
                                <label className='block pt-4' htmlFor="">Offer Type</label>
                                <select
                                    {...register('offerType')}
                                    className='p-2 block rounded-md' type="text"
                                    value={getValues('offerType') || ''}
                                    onChange={(e) => {
                                        const value = e.target.value
                                        if (!isNaN(value)) setValue('offerType', value, { shouldValidate: true })
                                    }}
                                >
                                    <option value="product">product</option>
                                    <option value="category">category</option>
                                </select>
                                {errors && <span className='max-w-64 block text-red-700 text-sm'>{errors?.offerType?.message}</span>}
                                <div className='flex justify-center pt-4'>
                                    <button className='bg-zinc-900 px-4 py-2 rounded-md text-white'>Add Offer</button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </div>

    )
}

AddOfferModal.propTypes = {
    handleAddOffer: PropTypes.func,
    onClose: PropTypes.func
}

export default AddOfferModal