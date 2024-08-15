import UserTable from "../../components/UserTable";
import { useBlockUserMutation, useFetchUsersQuery, useUnblockUserMutation } from "../../features/adminApiSlice";
import { toast } from "react-toastify";

function Users() {
    const { data, error, isLoading, refetch } = useFetchUsersQuery()
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