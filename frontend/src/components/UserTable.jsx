import { GrView } from "react-icons/gr";
import { TbUserCancel } from "react-icons/tb";
import { CgUnblock } from "react-icons/cg";
import { useState } from "react";
import ViewModal from "./ViewModal";


function UserTable({ users, blockUserById, unblockUserById }) {
    const [viewModal, setViewModal] = useState(false)
    const [viewUser, setViewUser] = useState('')

    return (
        <>
            <table className="w-full text-sm text-left rtl:text-right text-gray-500">
                <thead className="text-xs text-gray-700 uppercase bg-gray-50 ">
                    <tr>
                        <th className="px-6 py-3">
                            User ID
                        </th>
                        <th>
                            Name
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
                    {users.map((user, i) => {
                        return (
                            <tr key={i} className="border-b border-b-[#e7e0e0] text-black">
                                <td className="px-6 py-4 font-medium text-black whitespace-nowrap ">
                                    {user._id}
                                </td>
                                <td className="px-2 py-4">
                                    {user.firstName} {user.lastName}
                                </td>
                                <td className="px-6 py-4">
                                    {user.email}
                                </td>
                                <td className="px-6 py-4">
                                    {user.status}
                                </td>
                                <td className="px-6 py-4">
                                    <div className="flex gap-2">
                                        <div onClick={() => {
                                            setViewUser(user)
                                            setViewModal(true)
                                        }} className="w-fit p-1 rounded-md hover:bg-zinc-900 hover:text-white transition ease-in">
                                            <GrView size={20} />
                                        </div>
                                        <div className="w-fit p-1 rounded-md hover:bg-zinc-900 hover:text-white transition ease-in">
                                            {user.status === 'active' ? <TbUserCancel onClick={() => { blockUserById({ id: user._id }) }} size={20} /> : <CgUnblock onClick={() => { unblockUserById({ id: user._id }) }} size={20} />}
                                        </div>
                                    </div>
                                </td>
                            </tr>
                        )
                    })}
                </tbody>
            </table>
            {viewModal && <ViewModal closeModal={() => setViewModal(false)} user={viewUser}> </ViewModal>}
        </>
    )
}

export default UserTable