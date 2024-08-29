import { IoMdClose } from "react-icons/io"
import PropTypes from 'prop-types'
import { useForm } from 'react-hook-form'
import _ from "lodash"
import { useAddAddressMutation, useGetProfileQuery, useUpdateAddressMutation } from "../features/userApiSlice"
import { useEffect } from "react"
import toast from "react-hot-toast"
import { zodResolver } from '@hookform/resolvers/zod'
import { addAddressSchema } from "../../ValidationSchema/addAddressSchema"
import { RotatingLines } from "react-loader-spinner"

const states = [
    "andhra pradesh",
    "arunachal pradesh",
    "assam",
    "bihar",
    "chhattisgarh",
    "goa",
    "gujarat",
    "haryana",
    "himachal pradesh",
    "jharkhand",
    "karnataka",
    "kerala",
    "madhya pradesh",
    "maharashtra",
    "manipur",
    "meghalaya",
    "mizoram",
    "nagaland",
    "odisha",
    "punjab",
    "rajasthan",
    "sikkim",
    "tamil nadu",
    "telangana",
    "tripura",
    "uttar pradesh",
    "uttarakhand",
    "west bengal",
    "andaman and nicobar islands",
    "chandigarh",
    "dadra and nagar haveli and daman and diu",
    "lakshadweep",
    "delhi",
    "puducherry",
    "ladakh",
    "jammu and kashmir"
]

function AddAddressModal({ closeModal, refetch, mode, editData }) {
    const { data: profileData, isLoading: isProfileLoading } = useGetProfileQuery()
    const [addUserAddress, { isLoading: isAddressAdding }] = useAddAddressMutation()
    const [updateUserAddress, { isLoading: isAddressUpdating }] = useUpdateAddressMutation()
    const { register, handleSubmit, formState: { errors, isDirty }, reset } = useForm({
        resolver: zodResolver(addAddressSchema)
    })

    useEffect(() => {
        if (mode === 'edit') {
            reset({
                ...editData
            })
        }
        else {
            if (!isProfileLoading) {
                reset({
                    firstName: _.startCase(profileData?.firstName),
                    lastName: _.startCase(profileData?.lastName),
                    phoneNumber: profileData?.phoneNumber,
                })
            }
        }
    }, [isProfileLoading, reset, profileData, mode, editData])

    async function onSubmit(data) {
        if (mode === 'edit') {
            try {
                const res = await updateUserAddress({ id: editData._id, address: data }).unwrap()
                refetch()
                toast(res?.message, {
                    position: 'top-center'
                })
                closeModal()
            } catch (error) {
                toast(error?.data?.message, {
                    position: 'top-center'
                })
            }
        }
        else {
            try {
                const res = await addUserAddress({ address: data }).unwrap()
                refetch()
                toast(res?.message, {
                    position: 'top-center'
                })
                closeModal()
            } catch (error) {
                toast(error?.data?.message, {
                    position: 'top-center'
                })
            }
        }

    }


    return (
        <>
            <div className="relative z-10" >
                <div className="fixed inset-0 bg-[#f1f1f1] bg-opacity-75 transition-all backdrop-blur-sm"></div>
                <div className="fixed inset-0 z-10 w-screen overflow-y-auto">
                    <div className="flex min-h-full justify-center items-center px-2 py-12 text-center ">
                        <div className="relative max-w-[386px] text-left p-10 rounded-2xl bg-[#D9D9D9] flex justify-center text-black `">
                            <button
                                className="rounded-md p-1 inline-flex items-center justify-center text-black hover:bg-black hover:text-white transition ease-in duration-75 focus:outline-none absolute top-2 right-2"
                                onClick={closeModal} >
                                <IoMdClose size={20} />
                            </button>
                            <form className="font-light" onSubmit={handleSubmit(onSubmit)}>
                                <div className="flex justify-between w-full">
                                    <div>
                                        <input {...register('firstName')} type="text" className='border border-stone-500 focus:outline-none h-[42px] w-full rounded-[12px] p-2' placeholder="First Name" />
                                        {errors.firstName && <span className='text-red-700 text-sm block w-full'>{errors.firstName?.message}</span>}
                                    </div>
                                    <div className="pl-6">
                                        <input {...register('lastName')} type="text" className='border border-stone-500 focus:outline-none h-[42px] w-full rounded-[12px] p-2' placeholder="Last Name" />
                                        {errors.lastName && <span className='text-red-700 text-sm block w-full'>{errors.lastName?.message}</span>}
                                    </div>
                                </div>
                                <input {...register('buildingName')} type="text" className='border border-stone-500 focus:outline-none h-[42px] w-full rounded-[12px] p-2 mt-4' placeholder="House no, Building name" />
                                {errors.buildingName && <span className='text-red-700 text-sm block w-full'>{errors.buildingName?.message}</span>}
                                <input {...register('street')} type="text" className='border border-stone-500 focus:outline-none h-[42px] w-full rounded-[12px] p-2 mt-4' placeholder="Street name ,Area" />
                                {errors.street && <span className='text-red-700 text-sm block w-full'>{errors.street?.message}</span>}
                                <div className="flex justify-between w-full pt-4">
                                    <div>
                                        <input {...register('pincode')} type="text" className='border border-stone-500 focus:outline-none h-[42px] w-full rounded-[12px] p-2' placeholder="Pincode" />
                                        {errors.pincode && <span className='text-red-700 text-sm block w-full'>{errors.pincode?.message}</span>}
                                    </div>
                                    <div className="pl-4">
                                        <input {...register('city')} type="text" className='border border-stone-500 focus:outline-none h-[42px] w-full rounded-[12px] p-2' placeholder="City / District" />
                                        {errors.city && <span className='text-red-700 text-sm block w-full'>{errors.city?.message}</span>}
                                    </div>
                                </div>
                                <select className='border border-stone-500 focus:outline-none h-[42px] w-full rounded-[12px] p-2 mt-4' {...register('state')}>
                                    <option value="">Select State</option>
                                    {states.map((state, i) => <option key={i} value={state} >{_.startCase(state)}</option>)}
                                </select>
                                {errors.state && <span className='text-red-700 text-sm block w-full'>{errors.state?.message}</span>}
                                <div className="flex mt-4">
                                    <div className="border border-stone-500 focus:outline-none h-[42px] rounded-l-[12px] p-2">+91</div>
                                    <input {...register('phoneNumber')} type="text" className='border-l-0 border border-stone-500 focus:outline-none h-[42px] w-full rounded-r-[12px] p-2 ' placeholder="Phone Number" />
                                </div>
                                <div className='flex w-full justify-center'>
                                    {
                                        mode === 'edit' ? <button disabled={!isDirty || isAddressUpdating} className={`flex gap-1 items-center text-center mt-2 ${isDirty?'bg-black':'bg-stone-400'} px-4 py-2 text-white rounded-md`}> {isAddressUpdating ? <RotatingLines strokeColor='white' width='20' /> : 'Edit'}</button>
                                            : <button disabled={isAddressAdding} className='flex gap-1 items-center text-center mt-2 bg-black px-4 py-2 text-white rounded-md'> {isAddressAdding ? <RotatingLines strokeColor='white' width='20' /> : 'Add'}</button>
                                    }
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}

AddAddressModal.propTypes = {
    closeModal: PropTypes.func.isRequired,
    refetch: PropTypes.func.isRequired,
    mode: PropTypes.string,
    editData: PropTypes.object
}

export default AddAddressModal