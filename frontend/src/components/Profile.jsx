import { useEffect } from 'react'
import { useGetProfileQuery } from '../features/userApiSlice'
import { useForm } from 'react-hook-form'

function Profile() {
  const { data: profileData ,refetch: refetchProfileData } = useGetProfileQuery()
  const { register, handleSubmit, formState: { errors }, reset } = useForm()

  async function onSubmit(data) {
    console.log(data)
  }

  useEffect(() => {
    refetchProfileData()
  }, [refetchProfileData])

  console.log(profileData)
  return (
    <>
      <h1>Profile</h1>
      <form action="" onSubmit={handleSubmit(onSubmit)}>
        <div className="border border-[#CFCBCB] max-w-[754px] w-full rounded-md bg-stone-50 py-4 sm:px-8 px-4">
          <div className='sm:flex sm:justify-between'>
            <div>
              <label htmlFor="">Email Id</label>
              <input {...register('email')} type="text" disabled className='w-full block p-2 bg-stone-200 rounded-md border border-[#CFCBCB] focus:outline-none' value={profileData?.email || ''} />
            </div>
            <div className='sm:mt-0 mt-4'>
              <label htmlFor="">Password</label>
              <input type="password" disabled className='w-full block p-2 bg-stone-200 rounded-md border border-[#CFCBCB] focus:outline-none' value={'..........'} />
            </div>
          </div>
          <div className='sm:flex sm:justify-between mt-4'>
            <div>
              <label className='block' htmlFor="">First Name</label>
              <input {...register('firstName')} value={profileData?.firstName || ''} className='w-full block p-2 border border-[#CFCBCB] focus:outline-none rounded-md' type="text" />
              <label className='block mt-2' htmlFor="">Last Name</label>
              <input {...register('lastName')} value={profileData?.lastName || ''} className='w-full block p-2 border border-[#CFCBCB] focus:outline-none rounded-md' type="text" />
              <label className='block mt-2' htmlFor="">Gender</label>
              <span>Male</span>
              <input {...register('gender')} defaultChecked={profileData?.gender === 'female'} className='ml-2' type="radio" />
              <span className='ml-2'>Female</span>
              <input {...register('gender')} defaultChecked={profileData?.gender === 'female'} className='ml-2' type="radio" />
            </div>
            <div></div>
            <div className='sm:mt-0 mt-4'>
              <label className='block' htmlFor="">Mobile Number </label>
              <input {...register('phoneNumber')} className='w-full block p-2 border border-[#CFCBCB] focus:outline-none rounded-md' type="text" />
              <label className='flex justify-between items-center mt-2' htmlFor="">Default Address <span className='text-sm'>Add/Edit</span> </label>
              <textarea {...register('address')} className='w-full block p-2 border border-[#CFCBCB] focus:outline-none rounded-md' type="text" />
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