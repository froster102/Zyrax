import { useState } from 'react'
import CategoryTable from '../../components/CategoryTable'
import { FaListUl } from 'react-icons/fa'
import AddCategoryModal from '../../components/AddCategoryModal'
import { useGetCategoriesQuery } from '../../features/adminApiSlice'

function Category() {
    const [addCategoryModal, setAddCategoryModal] = useState(false)
    const { data: categories, isLoading: isCategoriesLoading, refetch } = useGetCategoriesQuery()


    return (
        <>
            <div className='ml-10'>
                <div className='w-[610px]'>
                    <div className='flex justify-between '>
                        <div className='flex items-center'>
                            <FaListUl size={30} />
                            <p className='text-2xl font-medium ml-4'>Category</p>
                        </div>
                        <button onClick={() => { setAddCategoryModal(true) }} className='bg-black px-6 py-4 rounded-full text-white font-medium'>Add category</button>
                    </div>
                    <CategoryTable categories={categories} isCategoriesLoading={isCategoriesLoading} refetch={refetch} ></CategoryTable>
                </div>
            </div>
            {
                addCategoryModal && <AddCategoryModal closeModal={() => { setAddCategoryModal(false) }} refetch={refetch}></AddCategoryModal>
            }
        </>
    )
}

export default Category