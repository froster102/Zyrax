import { Wishlist } from "../../model/wishlist.js"

const addWishlistItems = async (req, res) => {
    const { productId, action, productIds } = req.body
    try {
        if (action === 'sync') {
            if (!productIds) return res.status(400).json({ message: 'Products IDs not found for sync action' })
            if (!Array.isArray(productIds)) {
                return res.status(400).json({ message: 'Invalid array given for sync action' })
            }
        }
        let wishlist = await Wishlist.findOne({ user_id: req.userId })
        if (!wishlist) {
            wishlist = new Wishlist({ user_id: req.userId, items: [] })
        }
        if (action === 'sync') {
            wishlist.items = [...new Set([...wishlist.items, ...productIds])]
            await wishlist.save()
            const newWishlist = await Wishlist.findOne({ user_id: req.userId }).populate('items')
            return res.status(201).json(newWishlist.items)
        } else {
            wishlist.items = [...new Set([...wishlist.items, productId])]
            await wishlist.save()
        }
        return res.status(201).json({ message: 'Products added to wishlist' })
    } catch (e) {
        const message = []
        if (e.name === 'ValidationError') {
            for (let error in e.errors) {
                if (e.errors[error].name === 'CastError') {
                    message.push('Invalid object Id found in the ids')
                } else {
                    message.push(e.errors[error].properties.message)
                }
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
        const wishlist = await Wishlist.findOne({ user_id: req.userId }, { items: true, _id: false }).populate({
            path: 'items',
        })
        return res.status(200).json(wishlist.items)
    } catch (error) {
        return res.status(500).json({ message: 'Failed to get products' })
    }
}

const removeWishlistItem = async (req, res) => {
    const { itemId } = req.params
    if (!itemId) return res.status(400).json({ message: 'Item ID is required' })
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