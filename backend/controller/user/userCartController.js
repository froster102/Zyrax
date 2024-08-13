import { Cart } from "../../model/cart.js"

const addCartItems = async (req, res) => {
    const { items } = req.body
    try {
        await Cart.findOneAndUpdate({ user_id: req.userId }, { $addToSet: { items: { $each: items } } })
        return res.status(201).json({ message: 'Product added to cart' })
    } catch (error) {
        console.log(error)
        return res.status(500).json({ message: 'Failed to product to cart' })
    }
}

const getCartItems = async (req, res) => {
    try {
        const items = await Cart.findOne({ user_id: req.userId }, { items: true, _id: false }).populate({
            path: 'items',
        })
        return res.status(200).json(items)
    } catch (error) {
        console.log(error)
        return res.status(500).json({ message: 'Failed get cart items' })
    }
}

const removeCartItem = async (req, res) => {
    const { item } = req.body
    try {
        const response = await Cart.findOneAndUpdate({ user_id: req.userId }, { $pull: { items: item } }, { new: true })
        console.log(response)
        return res.status(200).json({ message: 'Product removed from cart sucessfully' })
    } catch (error) {
        return res.status(500).json({ message: 'Failed to remove product from cart' })
    }
}

export {
    addCartItems,
    getCartItems,
    removeCartItem
}