import { useEffect, useState } from "react";
import { IoMdAddCircle } from "react-icons/io";
import AddAddressModal from "./AddAddressModal";
import { useAddAddressMutation, useDeleteAddressMutation, useGetProfileQuery, useUpdateAddressMutation } from "../store/api/userApiSlice";
import { CiEdit } from "react-icons/ci";
import { LuDelete } from "react-icons/lu";
import toast from "react-hot-toast";
import { useDispatch } from "react-redux";
import { addAddress } from "../store/slices/userSlice";
import PropsTypes from 'prop-types'
import _ from "lodash";

function Address({ deliveryAddress, setDeliveryAddress, orderMode }) {
    const dispatch = useDispatch()
    const [openAddAddressModal, setOpenAddAddressModal] = useState(false)
    const { data: profileData, isLoading, refetch } = useGetProfileQuery()
    const [addUserAddress, { isLoading: isAddressAdding }] = useAddAddressMutation()
    const [updateUserAddress, { isLoading: isAddressUpdating }] = useUpdateAddressMutation()
    const [deleteUserAddress] = useDeleteAddressMutation()
    const [editData, setEditData] = useState({})
    const [mode, setMode] = useState('')

    useEffect(() => {
        if (!isLoading) {
            dispatch(addAddress({ addresses: profileData.addresses }))
            if (orderMode) {
                setDeliveryAddress(profileData.addresses[0])
            }
        }
    }, [profileData?.addresses, isLoading, dispatch, setDeliveryAddress, orderMode])

    async function deleteAddress(id) {
        try {
            const res = await deleteUserAddress({ id }).unwrap()
            toast(res?.message)
            refetch()
        } catch (error) {
            toast(error?.data?.message)
        }
    }

    async function onSubmit(data) {
        if (mode === 'edit') {
            try {
                const res = await updateUserAddress({ id: editData._id, address: data }).unwrap()
                toast(res?.message)
                setOpenAddAddressModal(false)
                refetch()
                dispatch(profileData?.addresses)
            } catch (error) {
                // toast(error?.data?.message)
            }
        } else {
            try {
                const res = await addUserAddress({ address: data }).unwrap()
                toast(res?.message)
                setOpenAddAddressModal(false)
                refetch()
                dispatch(profileData?.addresses)
            } catch (error) {
                // toast(error?.data?.message)
                setOpenAddAddressModal(false)
            }
        }

    }

    return (
        <>
            <div className="border border-neutral-300 rounded-lg p-4 h-full flex gap-2 max-w-[1200px] w-fit flex-wrap pb-16">
                {
                    !isLoading && profileData.addresses.map((address, i) => {
                        return <div key={i} className="border border-neutral-300 md:w-64 w-full rounded-lg p-4 font-medium relative">
                            <input name="address" checked={deliveryAddress === address} onChange={() => {
                                if (orderMode) {
                                    setDeliveryAddress(address)
                                }
                            }} className="absolute right-4" type="radio" />
                            <p className="font-semibold">{_.startCase(address.firstName)} {_.startCase(address.lastName)}</p>
                            <p className="font-normal text-neutral-700">
                                {address.buildingName}
                                <br />
                                {address.street}
                                <br />
                                {address.city} ,{address.state}
                                <br />
                                {address.pincode}
                                <br />
                                {address.phoneNumber}
                            </p>
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
                <div className="border border-neutral-300 md:w-64 w-full h-56 rounded-lg flex justify-center items-center">
                    <div onClick={() => {
                        setMode('')
                        setOpenAddAddressModal(true)
                    }}>
                        <IoMdAddCircle className="inline-flex justify-center w-full" size={60} />
                        <div className="text-center w-full">Add new address</div>
                    </div>
                </div>
            </div>
            {openAddAddressModal && <AddAddressModal
                closeModal={() => setOpenAddAddressModal(false)}
                onSubmit={onSubmit}
                isAddressAdding={isAddressAdding}
                isAddressUpdating={isAddressUpdating}
                mode={mode}
                editData={editData} />}
        </>
    )
}

Address.propTypes = {
    deliveryAddress: PropsTypes.object,
    setDeliveryAddress: PropsTypes.func,
    orderMode: PropsTypes.bool
}

export default Address