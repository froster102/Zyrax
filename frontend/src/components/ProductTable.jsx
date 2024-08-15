import { MdBlock, MdDelete } from "react-icons/md";
import { GrView } from "react-icons/gr";
import { FaEdit } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { useBlockProductMutation, useDeleteProductMutation } from "../features/adminApiSlice";
import { toast } from 'react-toastify'
import { TbBarrierBlock, TbBarrierBlockOff } from "react-icons/tb";
import { useState } from "react";
import { IoSearchOutline } from "react-icons/io5";


function ProductTable({ products, refetch }) {
    const [search, setSearch] = useState('')
    const navigate = useNavigate()
    const [blockProduct, { isLoading }] = useBlockProductMutation()
    const [deleteProduct] = useDeleteProductMutation()

    async function handleBlockProduct(id) {
        try {
            const res = await blockProduct(id).unwrap()
            console.log(res)
            toast(res?.message)
            refetch()
        } catch (error) {
            toast(error?.data?.message)
        }
    }

    async function handleDelete({ id }) {
        try {
            const res = await deleteProduct({ id }).unwrap()
            refetch()
            toast(res?.message)
        } catch (error) {
            toast(error?.data?.message)
        }
    }

    return (
        <>
            <div className="w-fit mt-4 px-2 flex items-center justify-items-center bg-white  rounded-md h-fit border-[1px] border-black">
                <IoSearchOutline size={20} color="gray" />
                <input className='h-[40px] rounded-md w-80 outline-none' type="text" placeholder='Search' value={search} onChange={(e)=>setSearch(e.target.value)} />
            </div>
            <div className="pt-4">
                <table className="w-full text-sm text-left rtl:text-right shadow-2xl text-gray-500">
                    <thead className="text-xs text-gray-700 uppercase bg-gray-50 ">
                        <tr>
                            <th className="px-6 py-3">
                                Product ID
                            </th>
                            <th className="px-6 py-3">
                                Name
                            </th>
                            <th className="px-6 py-3">
                                category
                            </th>
                            <th className="px-6 py-3">
                                Price
                            </th>
                            <th className="px-6 py-3">
                                Stock
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
                        {products.filter((product) => {
                            return search.toLocaleLowerCase() === ''
                                ? product
                                : product.name.toLowerCase().includes(search)
                        }).map((product, i) => {
                            return (
                                <tr key={i} className="border-b ">
                                    <th className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap ">
                                        {product._id}
                                    </th>
                                    <td className="px-6 py-4">
                                        {product.name}
                                    </td>
                                    <td className="px-6 py-4">
                                        {product.category?.name}
                                    </td>
                                    <td className="px-6 py-4">
                                        {product.price}
                                    </td>
                                    <td className="px-6 py-4">
                                        {product.stockQty}
                                    </td>
                                    <td className="px-6 py-4">
                                        {product.status}
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex gap-2">
                                            <div className="w-fit p-1 rounded-md hover:bg-zinc-900 hover:text-white transition ease-in">
                                                <GrView size={20} className="hover:text-white" />
                                            </div>
                                            <div onClick={() => { navigate(`/admin/dashboard/products/${product._id}/edit`) }} className="w-fit p-1 rounded-md hover:bg-zinc-900 hover:text-white transition ease-in">
                                                <FaEdit size={20} />
                                            </div>
                                            <div onClick={() => {
                                                handleBlockProduct({ id: product._id })
                                            }} className="w-fit p-1 rounded-md hover:bg-zinc-900 hover:text-white transition ease-in">
                                                {product.status === 'active' ? <TbBarrierBlock size={20} /> : <TbBarrierBlockOff size={20} />}
                                            </div>
                                            <div onClick={() => {
                                                handleDelete({ id: product._id })
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
            </div>

        </>

    )
}

export default ProductTable