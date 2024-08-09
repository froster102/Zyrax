import React, { useState } from 'react'
import { FaEdit } from 'react-icons/fa'
import { GrView } from 'react-icons/gr'
import { MdDelete } from 'react-icons/md'
import CategoryEditModal from './CategoryEditModal'
import ViewModal from './ViewModal'
import { useBlockCategoryMutation, useDeleteCategoryMutation } from '../features/adminApiSlice'
import { toast } from 'react-toastify'
import { MdBlock } from "react-icons/md";
import { MoonLoader, PulseLoader } from 'react-spinners'


function categoryTable({ categories, refetch, isCategoriesLoading }) {
    const [editCategory, setEditCategory] = useState('')
    const [viewCategory, setViewCategory] = useState('')
    const [editModal, setEditModal] = useState(false)
    const [viewModal, setViewModal] = useState(false)
    const [deleteCategory, { isLoading }] = useDeleteCategoryMutation()
    const [blockCategory] = useBlockCategoryMutation()

    async function handleDelete(id) {
        try {
            const res = await deleteCategory(id).unwrap()
            refetch()
            toast(res?.message)
        } catch (error) {
            toast(error?.data?.message)
        }
    }

    async function handleBlockCategory(id) {
        try {
            const res = await blockCategory(id).unwrap()
            refetch()
            toast(res?.message)
        } catch (error) {
            toast(error?.data?.message)
        }
    }

    return (
        <>
            <div className='relative'>
                <table className="w-full text-sm text-left rtl:text-right text-gray-500 mt-8  shadow-xl rounded-md">
                    <thead className="text-xs text-gray-700 uppercase bg-gray-50 ">
                        <tr>
                            <th className="px-6 py-3">
                                category ID
                            </th>
                            <th className="px-6 py-3">
                                Name
                            </th>
                            <th className="px-6 py-3">
                                Status
                            </th>
                            <th className="px-6 py-3">
                                Action
                            </th>
                        </tr>
                    </thead>
                    <tbody>

                        {!isCategoriesLoading && categories.map((category, i) => {
                            return (
                                <tr key={i} className="border-b ">
                                    <th className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap ">
                                        {category._id}
                                    </th>
                                    <td className="px-6 py-4">
                                        {category.name}
                                    </td>
                                    <td className="px-6 py-4">
                                        {category.status}
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex gap-2">
                                            <div onClick={() => {
                                                setViewCategory(category)
                                                setViewModal(true)
                                            }} className="w-fit p-1 rounded-md hover:bg-zinc-900 hover:text-white transition ease-in">
                                                <GrView size={20} className="hover:text-white" />
                                            </div>
                                            <div onClick={() => {
                                                setEditCategory(category)
                                                setEditModal(true)
                                            }} className="w-fit p-1 rounded-md hover:bg-zinc-900 hover:text-white transition ease-in">
                                                <FaEdit size={20} />
                                            </div>
                                            <div onClick={() => {
                                                handleBlockCategory(category._id)
                                            }} className="w-fit p-1 rounded-md hover:bg-zinc-900 hover:text-white transition ease-in">
                                                <MdBlock size={20} />
                                            </div>
                                            <div onClick={() => {
                                                handleDelete(category._id)
                                            }} className="w-fit p-1 rounded-md hover:bg-zinc-900 hover:text-white transition ease-in">
                                                <MdDelete size={20} />
                                            </div>
                                        </div>
                                    </td>
                                </tr>
                            )
                        })}
                    </tbody>
                </table>
                <PulseLoader className='absolute top-20 left-1/2 transform -translate-x-1/2' loading={isCategoriesLoading} />
            </div>
            {editModal && <CategoryEditModal category={editCategory} categories={categories} closeModal={() => { setEditModal(false) }} refetch={refetch}></CategoryEditModal>}
            {viewModal && <ViewModal category={viewCategory} closeModal={() => { setViewModal(false) }}></ViewModal>}
        </>
    )
}

export default categoryTable