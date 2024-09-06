import { Wishlist } from "../../model/wishlist.js"

const addWishlistItems = async (req, res) => {
    const { productId } = req.body
    try {
        await Wishlist.findOneAndUpdate({ user_id: req.userId }, { $addToSet: { items: productId } }, { new: true, upsert: true, runValidators: true })
        return res.status(201).json({ message: 'Products added to wishlist' })
    } catch (e) {
        const message = []
        if (e.name === 'ValidationError') {
            for (let error in e.errors) {
                message.push(e.errors[error].properties.message)
            }
            return res.status(400).json(message)
        }
        if (e.name === 'CastError') {
            message.push('Invalid id found in the items')
            return res.status(400).json({ message })
        }
        return res.status(500).json({ message: 'Failed to add product to wishlist' })
    }
}

const getWishlistItems = async (req, res) => {
    try {
        const items = await Wishlist.findOne({ user_id: req.userId }, { items: true, _id: false }).populate({
            path: 'items',
        })
        return res.status(200).json(items)
    } catch (error) {
        return res.status(500).json({ message: 'Failed to get products' })
    }
}

const removeWishlistItem = async (req, res) => {
    const { itemId } = req.params
    try {
        const response = await Wishlist.findOneAndUpdate({ user_id: req.userId }, { $pull: { items: itemId } }, { upsert: true }, { new: true })
        if (!response.items.includes(itemId)) {
            return res.status(404).json({ message: 'Item with id not found' })
        }
        return res.status(200).json({ message: 'Product removed from wishlist sucessfully' })
    } catch (error) {
        return res.status(500).json({ message: 'Failed to remove product from wishlist' })
    }
}


export {
    getWishlistItems,
    addWishlistItems,
    removeWishlistItem,
}