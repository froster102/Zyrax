import { useState } from "react"
import ConfirmationModal from "./ConfirmationModal"
import { IoSearchOutline } from "react-icons/io5"
import { RotatingLines } from "react-loader-spinner"
import _ from "lodash"
import { MdDelete } from "react-icons/md"
import PropTypes from 'prop-types'
import { format, parseISO } from "date-fns"

function OfferTable({ offers, isOffersLoading, handleDeleteOffer, setOpenAddOfferModal }) {
    const [confirmModalState, setConfirmModalState] = useState({
        show: false,
        action: '',
        onConfirm: () => { },
        message: '',
        onCancel: () => setConfirmModalState(prev => ({
            ...prev,
            show: false
        }))

    })
    const [search, setSearch] = useState('')
    return (
        <>
            <div className='flex justify-between p-4'>
                <div className="w-fit h-full px-2 flex items-center justify-items-center bg-white  rounded-md border border-neutral-400">
                    <IoSearchOutline size={20} color="gray" />
                    <input className='h-[36px] rounded-md w-80 outline-none' type="text" placeholder='Search' value={search} onChange={(e) => setSearch(e.target.value)} />
                </div>
                <button onClick={() => { setOpenAddOfferModal(true) }} className='bg-black px-4 py-2 rounded-full text-white font-medium'>Add Offer</button>
            </div>
            <table className="w-full text-sm text-left rtl:text-right text-gray-500">
                <thead className="text-xs text-black uppercase bg-neutral-300">
                    <tr>
                        <th className="px-6 py-3">
                            Name
                        </th>
                        <th className="px-6 py-3">
                            Discount percentage
                        </th>
                        <th className="px-6 py-3">
                            Start date
                        </th>
                        <th className="px-6 py-3">
                            End date
                        </th>
                        <th className="px-6 py-3">
                            Offer type
                        </th>
                        <th className="px-6 py-3">
                            Action
                        </th>
                    </tr>
                </thead>
                <tbody>
                    {
                        isOffersLoading && <tr className='w-full'>
                            <td colSpan={7} className='w-full'>
                                <div className='flex w-full justify-center items-center'>
                                    <RotatingLines visible={isOffersLoading} strokeColor='black' strokeWidth='3' />
                                </div>
                            </td>
                        </tr>
                    }
                    {!isOffersLoading &&
                        offers.filter((offer) => {
                            return search.toLowerCase() === ''
                                ? offer
                                : offer.name.toLowerCase().includes(search.toLowerCase())
                        }).map((offer, i) => {
                            return (
                                <tr key={i} className="border-b ">
                                    <td className="px-6 py-4 ">
                                        <p className='text-neutral-900 font-medium text-base'>{_.startCase(offer.name)}</p>
                                    </td>
                                    <td className="px-6 py-4">
                                        <p>{offer.discountPercentage}</p>
                                    </td>
                                    <td>
                                    <p>{format(parseISO(offer.startDate), 'dd MMM, yyy, h:mm a')}</p>
                                    </td>
                                    <td>
                                        <p>{format(parseISO(offer.endDate), 'dd MMM, yyy, h:mm a')}</p>
                                    </td>
                                    <td>
                                        <p>{offer.offerType}</p>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex gap-2">
                                            <div onClick={() => {
                                                setConfirmModalState(prev => ({
                                                    ...prev,
                                                    show: true,
                                                    action: 'delete',
                                                    onConfirm: () => handleDeleteOffer(offer._id),
                                                    message: `Are you sure you want to delete category ${offer.name} ?`
                                                }))
                                            }} className="w-fit p-1 rounded-md hover:bg-neutral-900 hover:text-white transition ease-in">
                                                <MdDelete size={20} />
                                            </div>
                                        </div>
                                    </td>
                                </tr>
                            )
                        })}
                </tbody>
            </table>
            <ConfirmationModal
                show={confirmModalState.show}
                action={confirmModalState.action}
                onCancel={confirmModalState.onCancel}
                onConfirm={confirmModalState.onConfirm}
                message={confirmModalState.message}
            />
        </>
    )
}

OfferTable.propTypes = {
    offers: PropTypes.array,
    isOffersLoading: PropTypes.bool,
    handleDeleteOffer: PropTypes.func,
    setOpenAddOfferModal: PropTypes.func
}

export default OfferTable