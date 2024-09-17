import UserTable from "../../components/UserTable";
import { useBlockUserMutation, useFetchUsersQuery, useUnblockUserMutation } from "../../store/api/adminApiSlice";
import toast, { Toaster } from "react-hot-toast";

function Users() {
    const { data: users, isLoading: isUsersLoading, refetch } = useFetchUsersQuery()
    const [blockUser] = useBlockUserMutation()
    const [unblockUser] = useUnblockUserMutation()

    async function blockUserById({ id }) {
        try {
            const res = await blockUser(id).unwrap()
            refetch()
            toast(res?.message)
        } catch (e) {
            toast(e?.data?.message)
        }
    }

    async function unblockUserById(id) {
        try {
            const res = await unblockUser(id).unwrap()
            refetch()
            toast(res?.message)
        } catch (error) {
            console.log(error)
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
            <div className='border-[1px] border-black w-full ml-4 rounded-lg bg-neutral-50 shadow-inner pt-[40px] px-[20px]'>
                <h1 className='text-3xl font-semibold'>Users</h1>
                <div className="relative overflow-x-auto shadow-xl mt-4 bg-neutral-200 rounded-lg">
                    <UserTable
                        blockUserById={blockUserById}
                        unblockUserById={unblockUserById}
                        isUserLoading={isUsersLoading}
                        users={users}
                    />
                </div>
            </div>
        </>
    )
}

export default Users