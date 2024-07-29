import { MdDelete } from "react-icons/md";
import { GrView } from "react-icons/gr";
import { FaEdit } from "react-icons/fa";    

function ProductTable({ products }) {
    return (
        <table className="w-full text-sm text-left rtl:text-right text-gray-500 ">
            <thead className="text-xs text-gray-700 uppercase bg-gray-50 ">
                <tr>
                    <th className="px-6 py-3">
                        Product ID
                    </th>
                    <th className="px-6 py-3">
                        Name
                    </th>
                    <th className="px-6 py-3">
                        Category
                    </th>
                    <th className="px-6 py-3">
                        Price
                    </th>
                    <th className="px-6 py-3">
                        Price
                    </th>
                    <th className="px-6 py-3">
                        Action
                    </th>
                </tr>
            </thead>
            <tbody>
                {products.map((product,i) => {
                    return (
                        <tr key={i} className="border-b ">
                            <th className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap ">
                                {product.id}
                            </th>
                            <td className="px-6 py-4">
                                {product.title}
                            </td>
                            <td className="px-6 py-4">
                                {product.category}
                            </td>
                            <td className="px-6 py-4">
                                {product.price}
                            </td>
                            <td className="px-6 py-4">
                                {product.stock}
                            </td>
                            <td className="px-6 py-4">
                                <div className="flex gap-2">
                                    <GrView size={20} />
                                    <FaEdit size={20} />
                                    <MdDelete size={20} />
                                </div>
                            </td>
                        </tr>
                    )
                })}
            </tbody>
        </table>
    )
}

export default ProductTable