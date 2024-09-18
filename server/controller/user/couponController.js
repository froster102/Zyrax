import { Cart } from "../../model/cart.js"

export const getCoupons = async (req, res) => {
    const cart = await Cart.findOne({ user_id: req.userId }).populate('items.productId')
    if (!cart) return res.status(404).json({ message: 'Cart not found for the user' })
    const cartTotal = cart.items.reduce((acc, el) => {
        console.log(el)
    })
}

export const validateCoupon = async (req, res) => {

}

export const applyCoupon = async (req, res) => {

}

export const removeCoupon = async (req, res) => {

}

