import { MdDelete } from "react-icons/md";
import { GrView } from "react-icons/gr";
import { FaEdit } from "react-icons/fa";

function UserTable({ users }) {
    return (
        <table className="w-full text-sm text-left rtl:text-right text-gray-500 ">
            <thead className="text-xs text-gray-700 uppercase bg-gray-50 ">
                <tr>
                    <th className="px-6 py-3">
                        User ID
                    </th>
                    <th className="px-6 py-3">
                        Email
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
                {users.map((user,i) => {
                    return (
                        <tr key={i} className="border-b ">
                            <th className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap ">
                                {user.id}
                            </th>
                            <td className="px-6 py-4">
                                {user.email}
                            </td>
                            <td className="px-6 py-4">
                                {user.status}
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

export default UserTable