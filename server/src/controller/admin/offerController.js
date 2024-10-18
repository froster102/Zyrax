import { Offer } from "../../model/offer.js"

export const getOffers = async (req, res) => {
    const { offerType } = req.query
    try {
        if (offerType) {
            const offers = await Offer.find({ offerType })
            return res.status(200).json(offers)
        } else {
            const offers = await Offer.find()
            return res.status(200).json(offers)
        }
    } catch (error) {
        return res.status(500).json({ message: 'Failed to get offers' })
    }
}

export const addOffer = async (req, res) => {
    const { name, discountPercentage, startDate, endDate, offerType } = req.body
    try {
        const offer = await Offer.create({
            name,
            discountPercentage,
            startDate,
            endDate,
            offerType
        })
        return res.status(201).json({ message: 'Offer created sucessfully' })
    } catch (e) {
        if (e.code === 11000) {
            console.error('Error: Offer name must be unique.')
        }
        if (e.name === 'ValidationError') {
            const message = []
            for (let error in e.errors) {
                message.push(e.errors[error].properties.message)
            }
            return res.status(400).json({ message })
        }
        return res.status(500).json({ message: 'Failed to create offer' })
    }
}

export const deleteOffer = async (req, res) => {
    const { offerId } = req.params
    try {
        const offer = await Offer.findByIdAndDelete(offerId)
        return res.status(200).json({ message: 'Offer deleted sucessfully' })
    } catch (error) {
        return res.status(500).json({ message: 'Failed to delete offer' })
    }
}