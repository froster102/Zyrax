import { MdDelete } from "react-icons/md";
import { GrView } from "react-icons/gr";
import { FaEdit } from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";
import { useBlockProductMutation, useDeleteProductMutation } from "../features/adminApiSlice";
import toast, { Toaster } from 'react-hot-toast'
import { TbBarrierBlock, TbBarrierBlockOff } from "react-icons/tb";
import { useState } from "react";
import { IoSearchOutline } from "react-icons/io5";
import PropTypes, { object } from 'prop-types'
import _ from "lodash";
import StatusChip from "./StatusChip";


function ProductTable({ products, refetch }) {
    const [search, setSearch] = useState('')
    const navigate = useNavigate()
    const [blockProduct] = useBlockProductMutation()
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
                <div className="relative overflow-x-auto bg-neutral-200 mt-4 shadow-lg rounded-lg">
                    <div className="flex justify-between px-4 pt-4 items-center">
                        <div className="w-fit h-full px-2 flex items-center justify-items-center bg-white  rounded-md border border-neutral-400">
                            <IoSearchOutline size={20} color="gray" />
                            <input className='h-[36px] rounded-md w-80 outline-none' type="text" placeholder='Search' value={search} onChange={(e) => setSearch(e.target.value)} />
                        </div>
                        <Link to='/admin/dashboard/products/add' ><button className="bg-black text-sm text-white font-medium rounded-3xl w-fit h-fit px-4 py-2">Add new product</button></Link>
                    </div>
                    <div className="pt-4">
                        <table className="w-full text-sm text-left rtl:text-right shadow-xl text-gray-500 bg-neutral-200">
                            <thead className="text-xs text-gray-700 uppercase bg-neutral-300 ">
                                <tr>
                                    <th className="px-6 py-3">
                                        Product
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
                                        <tr key={i} className="border-b border-neutral-300">
                                            <td className="px-6 py-3 text-black font-medium text-base flex items-center gap-2">
                                                <img className="w-10" src={product.imageUrls[0]} alt="" />
                                                {_.startCase(product.name)}
                                            </td>
                                            <td className="px-6 py-4">
                                                {_.startCase(product.category?.name)}
                                            </td>
                                            <td className="px-6 py-4">
                                                {product.price}
                                            </td>
                                            <td className="px-6 py-4">
                                                {product.stockQty}
                                            </td>
                                            <td className="px-6 py-4">
                                                <StatusChip status={product.status} />
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
                </div>
        </>
    )
}

ProductTable.propTypes = {
    products: PropTypes.arrayOf(object).isRequired,
    refetch: PropTypes.func.isRequired
}

export default ProductTable