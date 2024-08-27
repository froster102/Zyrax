import { useState } from 'react'
import { FaEdit } from 'react-icons/fa'
import { GrView } from 'react-icons/gr'
import { MdDelete } from 'react-icons/md'
import CategoryEditModal from './CategoryEditModal'
import ViewModal from './ViewModal'
import { MdBlock } from "react-icons/md";
import { RotatingLines } from 'react-loader-spinner'
import { IoSearchOutline } from 'react-icons/io5'
import PropTypes from 'prop-types'

function CategoryTable({ categories, refetch, isCategoriesLoading, handleBlockCategory, handleDelete, setAddCategoryModal }) {
    const [editCategory, setEditCategory] = useState('')
    const [viewCategory, setViewCategory] = useState('')
    const [editModal, setEditModal] = useState(false)
    const [viewModal, setViewModal] = useState(false)
    const [search, setSearch] = useState('')

    return (
        <>
            <div className='flex justify-between p-4'>
                <div className="w-fit h-full px-2 flex items-center justify-items-center bg-white  rounded-md border border-neutral-400">
                    <IoSearchOutline size={20} color="gray" />
                    <input className='h-[36px] rounded-md w-80 outline-none' type="text" placeholder='Search' value={search} onChange={(e) => setSearch(e.target.value)} />
                </div>
                <button onClick={() => { setAddCategoryModal(true) }} className='bg-black px-4 py-2 rounded-full text-white font-medium'>Add category</button>
            </div>
            <table className="w-full text-sm text-left rtl:text-right text-gray-500">
                <thead className="text-xs text-black uppercase bg-neutral-200">
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
                    {!isCategoriesLoading &&
                        categories.filter((category) => {
                            return search.toLowerCase() === ''
                                ? category
                                : category.name.toLowerCase().includes(search.toLowerCase())
                        }).map((category, i) => {
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
            <RotatingLines className='absolute top-20 left-1/2 transform -translate-x-1/2' visible={isCategoriesLoading} strokeColor='black' strokeWidth='3' />
            {editModal && <CategoryEditModal category={editCategory} categories={categories} closeModal={() => { setEditModal(false) }} refetch={refetch}></CategoryEditModal>}
            {viewModal && <ViewModal category={viewCategory} closeModal={() => { setViewModal(false) }}></ViewModal>}
        </>
    )
}

CategoryTable.propTypes = {
    categories: PropTypes.array,
    refetch: PropTypes.func,
    isCategoriesLoading: PropTypes.bool,
    handleBlockCategory: PropTypes.func,
    handleDelete: PropTypes.func,
    setAddCategoryModal: PropTypes.func.isRequired
}

export default CategoryTable