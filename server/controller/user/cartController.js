import { Cart } from "../../model/cart.js"

// @desc Add item/items to cart
// @route POST api/v1/user/cart
// @access Private
export const addCartItems = async (req, res) => {
    const { items } = req.body
    try {
        const cart = await Cart.findOne({ user_id: req.userId })
        if (cart) {
            const itemMap = new Map(cart.items.map(item => [`${item.productId}-${item.selectedSize}`, item]))
            items.forEach(item => {
                const itemKey = `${item.productId}-${item.selectedSize}`
                if (itemMap.has(itemKey)) {
                    const existingItem = itemMap.get(itemKey)
                    existingItem.selectedQty += Number(item.selectedQty) || 1
                    itemMap.set(itemKey, existingItem)
                    cart.items = Array.from((itemMap.values()))
                }
                else {
                    cart.items.push({ ...item, uniqueKey: itemKey })
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

// @desc Get all items from cart
// @route GET api/v1/user/cart
// @access Private
export const getCartItems = async (req, res) => {
    try {
        const { items } = await Cart.findOne({ user_id: req.userId }, { items: true, _id: false, appliedCoupon: true }).populate({
            path: 'items.productId',
            populate: {
                path: 'category',
                path: 'offer'
            }
        })
        return res.status(200).json({ userCartItems: items })
    } catch (error) {
        return res.status(500).json({ message: 'Failed get cart items' })
    }
}

// @desc Update a item in cart
// @route PUT api/v1/user/cart/items/:itemId
// @access Private
export const updateCartItems = async (req, res) => {
    const { itemId } = req.params
    const { selectedSize, selectedQty, index } = req.body
    if (!selectedQty || !selectedSize) return res.status(400).json({ message: 'Quantity , Size are required' })
    if (isNaN(index) || index < 0) return res.status(400).json({ message: 'Index must be a positive integer' })
    try {
        const cart = await Cart.findOne({ user_id: req.userId })
        if (!cart) return res.status(404).json({ message: 'Cart not found for the user' })
        const existingItemIndex = cart.items.findIndex(item => item.productId.toString() === itemId && item.selectedSize === selectedSize)
        if (existingItemIndex !== -1) {
            cart.items[existingItemIndex].selectedQty = selectedQty
            if (existingItemIndex !== index) {
                cart.items.splice(index, 1)
            }
        } else {
            cart.items[index].selectedQty = selectedQty
            cart.items[index].selectedSize = selectedSize
        }
        await cart.save()
        return res.status(200).json({ message: 'Cart updated sucessfully' })
    } catch (error) {
        return res.status(500).json({ message: 'Failed to update cart' })
    }
}

// @desc Remove a item from cart
// @route DELETE api/v1/user/cart/items/:itemId
// @access Private
export const removeCartItem = async (req, res) => {
    const { itemId } = req.params
    const { selectedSize } = req.body
    try {
        const response = await Cart.findOneAndUpdate({ user_id: req.userId, 'items.productId': itemId }, { $pull: { items: { productId: itemId, selectedSize: selectedSize } } }, { new: true })
        if (!response) {
            return res.status(400).json({ message: 'Item not found in the cart' })
        }
        return res.status(200).json({ message: 'Product removed from cart sucessfully' })
    } catch (error) {
        return res.status(500).json({ message: 'Failed to remove product from cart' })
    }
}
