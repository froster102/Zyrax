import toast from "react-hot-toast"
import OfferTable from "../../components/OfferTable"
import { useAddOfferMutation, useDeleteOfferMutation, useGetOffersQuery } from "../../store/api/adminApiSlice"
import { useState } from "react"
import AddOfferModal from "../../components/addOfferModal"

function Offer() {
    const { data: offers, isLoading: isOffersLoading } = useGetOffersQuery()
    const [addOffer] = useAddOfferMutation()
    const [deleteOffer] = useDeleteOfferMutation()
    const [openAddOfferModal, setOpenAddOfferModal] = useState(false)

    async function handleAddOffer(data) {
        const { name, discountPercentage, startDate, endDate,offerType } = data
        try {
            const res = await addOffer({ name, discountPercentage, startDate, endDate, offerType }).unwrap()
            toast(res?.message)
        } catch (error) {
            toast(error?.data?.message)
        }
    }

    async function handleDeleteOffer(offerId) {
        try {
            const res = await deleteOffer({ offerId }).unwrap()
            toast(res?.message)
        } catch (error) {
            toast(error?.data?.message)
        }
    }

    return (
        <div className='border border-black w-full ml-4 rounded-lg bg-neutral-50 shadow-inner pt-[40px] px-[20px]'>
            <div className='bg-neutral-200 rounded-lg shadow-xl mt-4 w-full'>
                <OfferTable
                    offers={offers}
                    isOffersLoading={isOffersLoading}
                    handleDeleteOffer={handleDeleteOffer}
                    setOpenAddOfferModal={setOpenAddOfferModal}
                />
                {
                    openAddOfferModal && <AddOfferModal
                        handleAddOffer={handleAddOffer}
                        onClose={() => { setOpenAddOfferModal(false) }}
                    />
                }
            </div>
        </div>
    )
}

export default Offer