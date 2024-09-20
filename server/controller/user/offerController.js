import { Offer } from "../../model/offer.js"

export const getOffers = async (req, res) => {
    const { offerType } = req.query
    try {
        const offers = await Offer.find({offerType:'category'})
        return res.status(200).json(offers)
    } catch (error) {
        return res.status(500).json({ message: 'Failed to get offers' })
    }
}

