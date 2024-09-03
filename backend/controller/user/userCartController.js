import { Cart } from "../../model/cart.js"

const addCartItems = async (req, res) => {
    const { items } = req.body
    try {
        const cart = await Cart.findOne({ user_id: req.userId })
        if (cart) {
            items.forEach(item => {
                const existingItem = cart.items.find(cartItem => cartItem.productId.toString() === item.productId)
                if (existingItem) {
                    existingItem.selectedSize = item.selectedSize
                    existingItem.selectedQty = item.selectedQty
                } else {
                    cart.items.push(item)
                }
            })
            await cart.save()
        } else {
            const newCart = new Cart({
                user_id: req.userId,
                items: items
            })
            await newCart.save()
            return res.status(201).json({ message: 'Cart created sucessfully' })
        }
        return res.status(201).json({ message: 'Product added to cart' })
    } catch (e) {
        const message = []
        if (e.name === 'ValidationError') {
            for (let error in e.errors) {
                message.push(e.errors[error].properties.message)
            }
            return res.status(400).json({ message })
        }
        if (e.name === 'CastError') {
            message.push('Invalid id found in the items')
            return res.status(400).json({ message })
        }
        return res.status(500).json({ message: 'Failed to product to cart' })
    }
}

const getCartItems = async (req, res) => {
    try {
        const items = await Cart.findOne({ user_id: req.userId }, { items: true, _id: false }).populate({
            path: 'items.productId',
            populate: {
                path: 'category'
            }
        })
        return res.status(200).json(items)
    } catch (error) {
        console.log(error)
        return res.status(500).json({ message: 'Failed get cart items' })
    }
}

const removeCartItem = async (req, res) => {
    const { itemId } = req.params
    try {
        const response = await Cart.findOneAndUpdate({ user_id: req.userId, 'items.productId': itemId }, { $pull: { items: { productId: itemId } } }, { new: true })
        if(!response){
            return res.status(400).json({message:'Item not found in the cart'})
        }
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