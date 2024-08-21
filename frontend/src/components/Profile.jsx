import { useEffect, useState } from 'react'
import { useGetProfileQuery } from '../features/userApiSlice'
import { useForm } from 'react-hook-form'

function Profile() {
  const { data: profileData, isLoading: isProfileDataLoading } = useGetProfileQuery()
  const { register, handleSubmit, formState: { errors }, reset } = useForm()

  async function onSubmit(data) {
    console.log(data)
  }

  console.log(profileData)
  return (
    <>
      <h1>Profile</h1>
      <form action="" onSubmit={handleSubmit(onSubmit)}>
        <div className="border border-[#CFCBCB] max-w-[754px] w-full rounded-md bg-stone-50 py-4 px-8">
          <div className='flex justify-between'>
            <div>
              <label htmlFor="">Email Id</label>
              <input {...register('email')} type="text" disabled className='block p-2 bg-stone-200 rounded-md border border-[#CFCBCB] focus:outline-none' value={profileData?.email || ''} />
            </div>
            <div>
              <label htmlFor="">Password</label>
              <input type="password" disabled className='block p-2 bg-stone-200 rounded-md border border-[#CFCBCB] focus:outline-none' value={'..........'} />
            </div>
          </div>
          <h1 className='mt-6'>General</h1>
          <div className='flex justify-between mt-4'>
            <div>
              <label className='block' htmlFor="">First Name</label>
              <input {...register('firstName')} value={profileData?.firstName || ''} className='block p-2 border border-[#CFCBCB] focus:outline-none rounded-md' type="text" />
              <label className='block mt-2' htmlFor="">Last Name</label>
              <input {...register('lastName')} value={profileData?.lastName || ''} className='block p-2 border border-[#CFCBCB] focus:outline-none rounded-md' type="text" />
              <label className='block mt-2' htmlFor="">Gender</label>
              <span>Male</span>
              <input {...register('gender')} defaultChecked={profileData?.gender==='female'} className='ml-2' type="radio" />
              <span className='ml-2'>Female</span>
              <input {...register('gender')} defaultChecked={profileData?.gender==='female'} className='ml-2' type="radio" />
            </div>
            <div></div>
            <div>
              <label className='block' htmlFor="">Mobile Number </label>
              <input {...register('phoneNumber')} className='block p-2 border border-[#CFCBCB] focus:outline-none rounded-md' type="text" />
              <label className='flex justify-between items-center mt-2' htmlFor="">Default Address <span className='text-sm'>Add/Edit</span> </label>
              <textarea {...register('address')} className='block p-2 border border-[#CFCBCB] focus:outline-none rounded-md' type="text" />
            </div>
          </div>
          <div className='flex w-full justify-center mt-2'>
            <button className='px-4 py-1 text-white bg-stone-900 rounded-md' >Save</button>
          </div>
        </div>
      </form>
    </>
  )
}

export default Profile