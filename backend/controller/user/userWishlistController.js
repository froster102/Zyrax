import { Wishlist } from "../../model/wishlist.js"

const addWishlistItems = async (req, res) => {
    const { items } = req.body
    try {
        await Wishlist.findOneAndUpdate({ user_id: req.userId }, { $addToSet: { items: { $each: items } } })
        res.status(201).json({ message: 'Product added to wishlist' })
    } catch (error) {
        console.log(error)
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
        res.status(500).json({ message: 'Failed to get products' })
    }
}

const removeWishlistItem = async (req, res) => {
    const { item } = req.body
    try {
        await Wishlist.findOneAndUpdate({ user_id: req.userId }, { $pull: { items: item } }, { new: true })
        res.status(200).json({ message: 'Product removed from wishlist sucessfully' })
    } catch (error) {
        console.log(error)
        res.status(500).json({ message: 'Failed to remove product from wishlist' })
    }
}


export {
    getWishlistItems,
    addWishlistItems,
    removeWishlistItem,
}