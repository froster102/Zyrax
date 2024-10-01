import { useEffect } from 'react'
import { useGetProfileQuery, useUpdateProfileMutation } from '../store/api/userApiSlice'
import { useForm } from 'react-hook-form'
import _ from 'lodash'
import toast from 'react-hot-toast'
import { RotatingLines } from 'react-loader-spinner'
import { Link } from 'react-router-dom'

function Profile() {
  const { data: profileData, isLoading, refetch } = useGetProfileQuery()
  const { register, handleSubmit, formState: { errors, isDirty }, reset } = useForm({})
  const [updateProfile, { isLoading: isProfileUpdating }] = useUpdateProfileMutation()

  async function onSubmit(profileData) {
    try {
      const res = await updateProfile({ profileData }).unwrap()
      refetch()
      toast(res?.message)
    } catch (error) {
      toast(error?.data?.message)
    }
  }
  useEffect(() => {
    if (!isLoading && profileData) {
      reset({
        email: profileData.email,
        firstName: _.startCase(profileData.firstName),
        lastName: _.startCase(profileData.lastName),
        phoneNumber: profileData?.phoneNumber,
      })
    }
  }, [profileData, isLoading, reset])
  return (
    <>
      <h1>Profile</h1>
      <form action="" onSubmit={handleSubmit(onSubmit)}>
        <div className="border border-[#CFCBCB] max-w-[754px] w-full rounded-md bg-neutral-50 py-4 sm:px-8 px-4">
          <div className='sm:flex sm:justify-between py-8'>
            <div>
              <label htmlFor="">Email Id</label>
              <input {...register('email', {
                required: 'Required',
                pattern: {
                  value: /^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/g,
                  message: 'Enter a valid email'
                }
              })} type="text" disabled className='w-full block p-2 bg-neutral-200 rounded-md border border-[#CFCBCB] focus:outline-none' />
              {errors.email && <span className='text-red-700 text-sm'>{errors.email?.message}</span>}
            </div>
          </div>
          <hr className='border' />
          <div className='sm:flex sm:justify-between'>
            <div>
              <div className='py-8'>
                <label className='block' htmlFor="">First Name</label>
                <input {...register('firstName', {
                  required: 'Required',
                  minLength: {
                    value: 3,
                    message: 'First name must be at contain 3 characters'
                  },
                  pattern: {
                    value: /^[A-Za-z]+$/,
                    message: 'Must contain only alphabets'
                  }
                })} className='w-full block p-2 border border-[#CFCBCB] focus:outline-none rounded-md' type="text" />
                {errors.firstName && <span className='text-red-700 text-sm'>{errors.firstName?.message}</span>}
              </div>
              <div>
                <label className='block mt-2' htmlFor="">Last Name</label>
                <input {...register('lastName', {
                  required: 'Required',
                  minLength: {
                    value: 3,
                    message: 'Last name must be at contain 3 characters'
                  },
                  pattern: {
                    value: /^[A-Za-z]+$/,
                    message: 'Must contain only alphabets'
                  }
                })} className='w-full block p-2 border border-[#CFCBCB] focus:outline-none rounded-md' type="text" />
                {errors.lastName && <span className='text-red-700 text-sm'>{errors.lastName?.message}</span>}
              </div>
              {/* <label className='block mt-2' htmlFor="">Gender</label>
              <span>Male</span>
              <input {...register('gender')} defaultChecked={profileData?.gender === 'female'} className='ml-2' type="radio" />
              <span className='ml-2'>Female</span>
              <input {...register('gender')} defaultChecked={profileData?.gender === 'female'} className='ml-2' type="radio" /> */}
            </div>
            <div>
              <div className='py-8'>
                <label className='block' htmlFor="">Mobile Number </label>
                <input {...register('phoneNumber', {
                  required: 'Required',
                  pattern: {
                    value: /^(\+91[-\s]?)?[6789]\d{9}$/,
                    message: 'Enter a valid phone number'
                  }
                })} className='w-full block p-2 border border-[#CFCBCB] focus:outline-none rounded-md' type="text" />
                {errors.phoneNumber && <span className='text-red-700 text-sm'>{errors.phoneNumber?.message}</span>}
                <label className='flex justify-between items-center pt-8' htmlFor="">Default Address<Link to={'/account/profile-address'} ><span className='text-sm hover:underline'>Add/Edit</span></Link></label>
                <textarea
                  value={`${profileData?.addresses[0]?.firstName || ''} ${profileData?.addresses[0]?.lastName || ''}\n${profileData?.addresses[0]?.buildingName || ''}\n${profileData?.addresses[0]?.street || ''},${profileData?.addresses[0]?.city || ''}\n${profileData?.addresses[0]?.state || ''} ${profileData?.addresses[0]?.pincode || ''}`}
                  disabled className='w-full min-h-[100px] block p-2 border border-[#CFCBCB] focus:outline-none rounded-md bg-neutral-300 text-sm' type="text" />
              </div>
            </div>
          </div>
          <div className='flex w-full justify-center mt-2'>
            <button disabled={isProfileUpdating || !isDirty} className={`px-4 py-1 text-white ${isDirty ? 'bg-neutral-900' : 'bg-neutral-400'} rounded-md`} >{isProfileUpdating ? <RotatingLines strokeColor='white' width='20' /> : 'Save'}</button>
          </div>
        </div>
      </form>

    </>
  )
}

export default Profile