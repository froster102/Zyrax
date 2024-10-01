import { useState } from 'react'
import CategoryTable from '../../components/CategoryTable'
import { FaListUl } from 'react-icons/fa'
import AddCategoryModal from '../../components/AddCategoryModal'
import { useBlockCategoryMutation, useDeleteCategoryMutation, useGetCategoriesQuery } from '../../store/api/adminApiSlice'
import toast, { Toaster } from 'react-hot-toast'

function Category() {
    const [addCategoryModal, setAddCategoryModal] = useState(false)
    const { data: categories, isLoading: isCategoriesLoading, refetch } = useGetCategoriesQuery()
    const [deleteCategory] = useDeleteCategoryMutation()
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
            <div className='border border-black w-full ml-4 rounded-lg bg-neutral-50 shadow-inner pt-[40px] px-[20px]'>
                <Toaster
                    position="top-center"
                    toastOptions={{
                        style: {
                            backgroundColor: 'black',
                            color: 'white',
                        },
                        duration: 2000
                    }}
                />
                <div className='ml-10'>
                    <div className='flex items-center'>
                        <FaListUl size={30} />
                        <p className='text-2xl font-medium ml-4'>Category</p>
                    </div>
                    <div className='bg-neutral-200 rounded-lg shadow-xl mt-4 w-full'>
                        <CategoryTable
                            categories={categories}
                            isCategoriesLoading={isCategoriesLoading}
                            refetch={refetch}
                            setAddCategoryModal={setAddCategoryModal}
                            handleBlockCategory={handleBlockCategory}
                            handleDelete={handleDelete}
                        />
                    </div>
                </div>
                {
                    addCategoryModal && <AddCategoryModal closeModal={() => { setAddCategoryModal(false) }} refetch={refetch}></AddCategoryModal>
                }
            </div>
        </>
    )
}

export default Category