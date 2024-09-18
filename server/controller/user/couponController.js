import { Cart } from "../../model/cart.js"

export const getCoupons = async (req, res) => {
    try {
        const cart = await Cart.findOne({ user_id: req.userId })
            .populate('items.productId')
            .populate('items.appliedCoupons')
        if (!cart) return res.status(404).json({ message: 'Cart not found for the user' })
        const cartTotal = cart.items.reduce((acc, el) => {
            const itemTotal = el.productId.price
        }, 0)
    } catch (error) {
        return res.status(500).json({ message: 'Failed to get coupons' })
    }

}

export const validateCoupon = async (req, res) => {

}

export const applyCoupon = async (req, res) => {

}

export const removeCoupon = async (req, res) => {

}

