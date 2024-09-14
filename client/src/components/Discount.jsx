import React from 'react'
import { FaEdit } from 'react-icons/fa'
import { GrView } from 'react-icons/gr'
import { MdBlock, MdDelete } from 'react-icons/md'
import { PulseLoader } from 'react-spinners'

function Discount() {
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
                    <tr className="border-b ">
                                    <th className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap ">
                                        ahdakd
                                    </th>
                                    <td className="px-6 py-4">
                                        adasd
                                    </td>
                                    <td className="px-6 py-4">
                                        adadad
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex gap-2">
                                            <div className="w-fit p-1 rounded-md hover:bg-zinc-900 hover:text-white transition ease-in">
                                                <GrView size={20} className="hover:text-white" />
                                            </div>
                                            <div className="w-fit p-1 rounded-md hover:bg-zinc-900 hover:text-white transition ease-in">
                                                <FaEdit size={20} />
                                            </div>
                                            <div className="w-fit p-1 rounded-md hover:bg-zinc-900 hover:text-white transition ease-in">
                                                <MdBlock size={20} />
                                            </div>
                                            <div className="w-fit p-1 rounded-md hover:bg-zinc-900 hover:text-white transition ease-in">
                                                <MdDelete size={20} />
                                            </div>
                                        </div>
                                    </td>
                                </tr>
                    </tbody>
                </table>
                <PulseLoader className='absolute top-20 left-1/2 transform -translate-x-1/2' loading={''} />
            </div>
            {/* {editModal && <CategoryEditModal category={editCategory} categories={categories} closeModal={() => { setEditModal(false) }} refetch={refetch}></CategoryEditModal>}
            {viewModal && <ViewModal category={viewCategory} closeModal={() => { setViewModal(false) }}></ViewModal>} */}
        </>
    )
}

export default Discount