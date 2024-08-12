import { Cart } from "../../model/cart.js"
import { Wishlist } from "../../model/wishlist.js"

const getItems = async (req, res) => {
    try {
        const items = await Wishlist.findOne({ user_id: req.userId }, { items: true, _id: false }).populate({
            path: 'items',
        })
        return res.status(200).json(items)
    } catch (error) {
        res.status(500).json({ message: 'Failed to get products' })
    }
}

const addItem = async (req, res) => {
    const { items } = req.body
    try {
        await Wishlist.findOneAndUpdate({ user_id: req.userId }, { $addToSet: { items: { $each: items } } })
        res.status(201).json({ message: 'Product added to wishlist' })
    } catch (error) {
        console.log(error)
        return res.status(500).json({ message: 'Failed to add product to wishlist' })
    }
}

const removeItem = async (req, res) => {
    const { item } = req.body
    try {
        await Wishlist.findOneAndUpdate({ user_id: req.userId }, { $pull: { items: item } }, { new: true })
        res.status(200).json({ message: 'Product removed from wishlist sucessfully' })
    } catch (error) {
        console.log(error)
        res.status(500).json({ message: 'Failed to remove product from wishlist' })
    }
}

const moveItem = async (req, res) => {
    const { item } = req.body
    try {
        await Cart.findOneAndUpdate({ user_id: req.userId }, { $addToSet: { items: item } })
        res.status(201).json({ message: 'Added to cart sucessfully' })
    } catch (error) {
        res.status(500).json({ message: 'Failed to move item' })
    }
}

export {
    getItems,
    addItem,
    removeItem,
    moveItem
}