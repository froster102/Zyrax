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
import _ from 'lodash'
import StatusChip from './StatusChip'
import ConfirmationModal from './ConfirmationModal'

function CategoryTable({ categories, refetch, isCategoriesLoading, handleBlockCategory, handleDelete, setAddCategoryModal }) {
    const [editCategory, setEditCategory] = useState('')
    const [viewCategory, setViewCategory] = useState('')
    const [editModal, setEditModal] = useState(false)
    const [viewModal, setViewModal] = useState(false)
    const [confirmModalState, setConfirmModalState] = useState({
        show: false,
        action: '',
        onConfirm: () => { },
        message: '',
        onCancel: () => setConfirmModalState(prev => ({
            ...prev,
            show: false
        }))

    })
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
                <thead className="text-xs text-black uppercase bg-neutral-300">
                    <tr>
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
                    {
                        isCategoriesLoading && <tr className='w-full'>
                            <td colSpan={7} className='w-full'>
                                <div className='flex w-full justify-center items-center'>
                                    <RotatingLines visible={isCategoriesLoading} strokeColor='black' strokeWidth='3' />
                                </div>
                            </td>
                        </tr>
                    }
                    {!isCategoriesLoading &&
                        categories.filter((category) => {
                            return search.toLowerCase() === ''
                                ? category
                                : category.name.toLowerCase().includes(search.toLowerCase())
                        }).map((category, i) => {
                            return (
                                <tr key={i} className="border-b ">
                                    <td className="px-6 py-4 ">
                                        <p className='text-neutral-900 font-medium text-base'>{_.startCase(category.name)}</p>
                                    </td>
                                    <td className="px-6 py-4">
                                        <StatusChip status={category.status} />
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex gap-2">
                                            <div onClick={() => {
                                                setViewCategory(category)
                                                setViewModal(true)
                                            }} className="w-fit p-1 rounded-md hover:bg-neutral-900 hover:text-white transition ease-in">
                                                <GrView size={20} className="hover:text-white" />
                                            </div>
                                            <div onClick={() => {
                                                setEditCategory(category)
                                                setEditModal(true)
                                            }} className="w-fit p-1 rounded-md hover:bg-neutral-900 hover:text-white transition ease-in">
                                                <FaEdit size={20} />
                                            </div>
                                            <div
                                                onClick={() => {
                                                    setConfirmModalState(prev => ({
                                                        ...prev,
                                                        show: true,
                                                        action: `${category.status === 'blocked' ? 'unblock' : 'block'}`,
                                                        onConfirm: () => handleBlockCategory(category._id),
                                                        message: `Are you sure you want to ${category.status === 'active' ? 'block' : 'unblock'} the category ${category.name} ?`
                                                    }))
                                                }}
                                                className="w-fit p-1 rounded-md hover:bg-neutral-900 hover:text-white transition ease-in"
                                            >
                                                <MdBlock size={20} />
                                            </div>
                                            <div onClick={() => {
                                                setConfirmModalState(prev => ({
                                                    ...prev,
                                                    show: true,
                                                    action: 'delete',
                                                    onConfirm: () => handleDelete(category._id),
                                                    message: `Are you sure you want to delete category ${category.name} ?`
                                                }))
                                            }} className="w-fit p-1 rounded-md hover:bg-neutral-900 hover:text-white transition ease-in">
                                                <MdDelete size={20} />
                                            </div>
                                        </div>
                                    </td>
                                </tr>
                            )
                        })}
                </tbody>
            </table>
            <ConfirmationModal
                show={confirmModalState.show}
                action={confirmModalState.action}
                onCancel={confirmModalState.onCancel}
                onConfirm={confirmModalState.onConfirm}
                message={confirmModalState.message}
            />
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