import { GrView } from "react-icons/gr";
import { TbUserCancel } from "react-icons/tb";
import { CgUnblock } from "react-icons/cg";
import { useState } from "react";
import ViewModal from "./ViewModal";
import PropTypes from 'prop-types'
import { RotatingLines } from "react-loader-spinner";
import ConfirmationModal from "./ConfirmationModal";
import StatusChip from "./StatusChip";

function UserTable({ users, blockUserById, isUserLoading, unblockUserById }) {
    const [viewModal, setViewModal] = useState(false)
    const [viewUser, setViewUser] = useState('')
    const [confirmModalState, setConfirmModalState] = useState({
        show: false,
        action: '',
        message: '',
        onConfirm: () => { },
        onCancel: () => {
            setConfirmModalState(prev => ({
                ...prev,
                show: false
            }))
        }
    })

    return (
        <>
            <table className="w-full text-sm text-left rtl:text-right text-gray-500">
                <thead className="text-xs text-gray-700 uppercase bg-neutral-300">
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
                    {
                        isUserLoading ? <tr className='w-full'>
                            <td colSpan={7} className='w-full'>
                                <div className='flex w-full justify-center items-center overflow-hidden'>
                                    <RotatingLines visible={isUserLoading} strokeColor='black' strokeWidth='3' />
                                </div>
                            </td>
                        </tr>
                            : users.map((user, i) => {
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
                                            <StatusChip status={user.status} />
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex gap-2">
                                                <div onClick={() => {
                                                    setViewUser(user)
                                                    setViewModal(true)
                                                }} className="w-fit p-1 rounded-md hover:bg-neutral-900 hover:text-white transition ease-in">
                                                    <GrView size={20} />
                                                </div>
                                                <div className="w-fit p-1 rounded-md hover:bg-neutral-900 hover:text-white transition ease-in">
                                                    {user.status === 'active' ? <TbUserCancel onClick={() => {
                                                        setConfirmModalState(prev => (
                                                            {
                                                                ...prev,
                                                                show: true,
                                                                message: `Are you sure you want to block user ${user.firstName} ${user.lastName}`,
                                                                action: `${user.status === 'active' ? 'block' : 'unblock'}`,
                                                                onConfirm: () => blockUserById({ id: user._id })
                                                            }
                                                        ))
                                                    }} size={20} /> : <CgUnblock onClick={() => {
                                                        setConfirmModalState(prev => (
                                                            {
                                                                ...prev,
                                                                show: true,
                                                                message: `Are you sure you want to unblock user ${user.firstName} ${user.lastName}`,
                                                                action: `${user.status === 'active' ? 'block' : 'unblock'}`,
                                                                onConfirm: () => unblockUserById({ id: user._id })
                                                            }
                                                        ))
                                                    }} size={20} />}
                                                </div>
                                            </div>
                                        </td>
                                    </tr>
                                )
                            })
                    }
                </tbody>
            </table>
            {viewModal && <ViewModal closeModal={() => setViewModal(false)} user={viewUser}> </ViewModal>}
            <ConfirmationModal
                show={confirmModalState.show}
                action={confirmModalState.action}
                message={confirmModalState.message}
                onConfirm={confirmModalState.onConfirm}
                onCancel={confirmModalState.onCancel}
            />
        </>
    )
}

UserTable.propTypes = {
    users: PropTypes.array,
    isUserLoading: PropTypes.bool,
    blockUserById: PropTypes.func,
    unblockUserById: PropTypes.func
}

export default UserTable