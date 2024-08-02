import { useEffect, useState } from "react";
import UserTable from "../../components/UserTable";
import { useBlockUserMutation, useFetchUsersQuery, useUnblockUserMutation } from "../../features/adminApiSlice";
import { Flip, toast, ToastContainer } from "react-toastify";

function Users() {
    const { data, error, isLoading, refetch } = useFetchUsersQuery()
    const [blockUser] = useBlockUserMutation()
    const [unblock] = useUnblockUserMutation()

    async function blockUserById(userId) {
        try {
            const res = await blockUser(userId).unwrap()
            refetch()
            toast(res?.message)
        } catch (e) {
            console.log(e)
        }
    }

    async function unblockUserById(userId) {
        try {
            const res = await unblock(userId).unwrap()
            refetch()
            toast(res?.message)
        } catch (error) {
            console.log(error)
        }
    }

    return (
        <>
            <ToastContainer className='mt-10 rounded-lg font-bold text-center'
                position='top-center'
                autoClose='1000'
                theme='dark'
                hideProgressBar={true}
                transition={Flip}
            ></ToastContainer>
            <div className='border-[1px] border-black w-full ml-4 rounded-lg bg-[#F1F1F1] shadow-inner pt-[40px] px-[20px]'>
                <h1 className='text-3xl font-semibold'>Users</h1>
                <div className="relative overflow-x-auto shadow-md sm:rounded-lg mt-4">
                    {data?.users && <UserTable blockUserById={blockUserById} unblockUserById={unblockUserById} users={data.users}></UserTable>}
                </div>

            </div>
        </>
    )
}

export default Users