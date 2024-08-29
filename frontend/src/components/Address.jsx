import { useState } from "react";
import { IoMdAddCircle } from "react-icons/io";
import AddAddressModal from "./AddAddressModal";
import { useDeleteAddressMutation, useGetProfileQuery } from "../features/userApiSlice";
import { CiEdit } from "react-icons/ci";
import { LuDelete } from "react-icons/lu";
import toast from "react-hot-toast";

function Address() {
    const [openAddAddressModal, setOpenAddAddressModal] = useState(false)
    const { data: profileData, isLoading, refetch } = useGetProfileQuery()
    const [deleteUserAddress] = useDeleteAddressMutation()
    const [editData, setEditData] = useState({})
    const [mode, setMode] = useState('')

    async function deleteAddress(id) {
        try {
            const res = await deleteUserAddress({ id }).unwrap()
            refetch()
            toast(res?.message)
        } catch (error) {
            toast(error?.data?.message)
        }
    }

    return (
        <>
            <div className="border border-stone-300 rounded-lg p-4 h-full flex gap-2 max-w-[1200px] flex-wrap pb-16">
                {
                    !isLoading && profileData.addresses.map((address, i) => {
                        return <div key={i} className="border border-stone-300 w-64 rounded-lg p-4 text-lg font-medium">
                            {address.firstName} {address.lastName}
                            <br />
                            {address.buildingName}
                            <br />
                            {address.street}
                            <br />
                            {address.city} ,{address.state}
                            <br />
                            {address.pincode}
                            <br />
                            {address.phoneNumber}
                            <div className="flex">
                                <button onClick={() => {
                                    setMode('edit')
                                    setEditData(address)
                                    setOpenAddAddressModal(true)
                                }} className="bg-black rounded-lg px-2 py-1 mt-4 text-white flex justify-center items-center text-sm"><CiEdit className="mr-2" />Edit</button>
                                <button onClick={() => { deleteAddress(address._id) }} className="bg-black rounded-lg px-2 py-1 mt-4 text-white flex justify-center items-center text-sm ml-2"><LuDelete className="mr-2" />Delete</button>
                            </div>
                        </div>
                    }
                    )
                }
                <div className="border border-stone-300 w-64 h-56 rounded-lg flex justify-center items-center">
                    <div onClick={() => {
                        setMode('')
                        setOpenAddAddressModal(true)
                    }}>
                        <IoMdAddCircle className="inline-flex justify-center w-full" size={60} />
                        <div className="text-center w-full">Add new address</div>
                    </div>
                </div>
            </div>
            {openAddAddressModal && <AddAddressModal closeModal={() => { setOpenAddAddressModal(false) }} refetch={refetch} mode={mode} editData={editData} />}
        </>
    )
}

export default Address