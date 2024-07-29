import { IoSearchOutline } from "react-icons/io5";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import UserTable from "../../components/UserTable";

const USERS = [
    {
        id: 'dwiesjd',
        email: 'sdnms@dms.com',
        status: 'sds'
    }
]

function Users() {
    const [users, setUsers] = useState([])
    useEffect(() => {
        setUsers(USERS)

    }, [])
    return (
        <>
            <div className='border-[1px] border-black w-full ml-4 rounded-lg bg-[#F1F1F1] shadow-inner pt-[40px] px-[20px]'>
                <h1 className='text-3xl font-semibold'>Users</h1>
                <div className="relative overflow-x-auto shadow-md sm:rounded-lg mt-4">
                    <UserTable users={users}></UserTable>
                </div>

            </div>
        </>
    )
}

export default Users