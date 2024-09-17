import { useState } from "react"
import { IoMdClose } from "react-icons/io"
import { useEditCategoryMutation } from "../store/api/adminApiSlice"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import _ from "lodash"
import { toast } from "react-toastify"

const schema = z.object({
    name: z.string().trim().min(1, 'Required').transform(val => val.toLocaleLowerCase()),
    description: z.string().trim().trim().min(1, 'Required'),
    categoryType: z.enum(['parent', 'child'], { message: 'Select a category type' }),
    parentCategory: z.string().optional()
}).refine((data => {
    if (data.categoryType === 'child' && !data.parentCategory) return false
    return true
}), {
    message: 'Parent category is required for child category',
    path: ['parentCategory']
})

function CategoryEditModal({ category, closeModal, refetch, categories }) {
    const [categoryType, setCategoryType] = useState(category.parent !== null ? 'child' : '')
    const [editCategory, { isLoading }] = useEditCategoryMutation()
    const { reset, register, handleSubmit, formState: { errors, isDirty } } = useForm({
        resolver: zodResolver(schema),
        defaultValues: {
            name: category.name,
            description: category.description,
            categoryType: category.parent === null ? 'parent' : 'child',
            parentCategory: category.parent !== null ? category.parent._id : ''
        }
    })

    async function onSubmit(data) {
        try {
            const res = await editCategory({ id: category._id, data })
            refetch()
            closeModal(false)
            toast(res?.message)
        } catch (error) {
            toast(error?.data?.message)
        }
    }

    return (
        <>
            <form onSubmit={handleSubmit(onSubmit)}></form>
            <div className="relative z-10" aria-labelledby="crop-image-dialog">
                <div className="fixed inset-0 bg-[#f1f1f1] bg-opacity-75 transition-all backdrop-blur-sm"></div>
                <div className="fixed inset-0 z-10 w-screen overflow-y-auto">
                    <div className="flex min-h-full justify-center items-center px-2 py-12 text-center ">
                        <div className="relative max-w-[386px] text-left p-10 rounded-2xl bg-[#D9D9D9] flex justify-center text-black `">
                            <button
                                className="rounded-md p-1 inline-flex items-center justify-center text-black hover:bg-black hover:text-white transition ease-in duration-75 focus:outline-none absolute top-2 right-2"
                                onClick={closeModal} >
                                <IoMdClose size={20} />
                            </button>
                            <form onSubmit={handleSubmit(onSubmit)}>
                                <span className='block'>Name of the category</span>
                                <input {...register('name')} type="text" className='border border-black h-[42px] w-full rounded-[12px] p-2' />
                                {errors.name && <span className='text-red-700 text-sm block w-full'>{errors.name?.message}</span>}
                                <span className='block mt-2'>Description</span>
                                <textarea {...register('description')} className='h-[93px] w-full rounded-[12px] p-2'></textarea>
                                {errors.description && <span className='text-red-700 text-sm w-full block'>{errors.description?.message}</span>}
                                <select {...register('categoryType')} className='w-full rounded-[12px] p-2 mt-2 border-none outline-none' value={categoryType} onChange={(e) => {
                                    setCategoryType(e.target.value)
                                }}>
                                    <option value="">Select category type</option>
                                    <option value='parent'>Parent</option>
                                    <option value='child'>Child</option>
                                </select>
                                {errors.categoryType && <span className='text-red-700 text-sm block w-full'>{errors.categoryType?.message}</span>}
                                {
                                    categoryType === 'child' && <select {...register('parentCategory')} className='w-[306px] rounded-[12px] p-2 mt-2 border-none outline-none'>
                                        <option value="">Select parent category</option>
                                        {categories.filter((listCategory) => {
                                            return listCategory.name !== category.name
                                        }).map((category, i) => {
                                            return <option key={i} value={category._id}>{_.startCase(category.name)}</option>
                                        })}
                                    </select>
                                }
                                {errors.parentCategory && <span className='text-red-700 text-sm block w-full'>{errors.parentCategory?.message}</span>}
                                <div className='flex w-full justify-center'>
                                    <button disabled={!isDirty} className='text-center mt-2 bg-black px-4 py-2 disabled:bg-gray-400 text-white rounded-full'>Update</button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}

export default CategoryEditModal