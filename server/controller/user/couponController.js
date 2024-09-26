import { Cart } from "../../model/cart.js"
import { Coupon } from "../../model/coupon.js"
import { calculateDiscount } from "../../utils/helper.js"

export const getCoupons = async (req, res) => {
    try {
        const cart = await Cart.findOne({ user_id: req.userId })
            .populate({
                path: 'items.productId',
                populate: 'offer'
            })
        if (!cart) return res.status(404).json({ message: 'Cart not found for the user' })
        let cartTotal = 0
        for (let item of cart.items) {
            const itemPrice = item.productId.price
            const selectedQty = item.selectedQty

            const finalPrice = item.productId.offer
                ? calculateDiscount(itemPrice, item.productId.offer.discountPercentage)
                : itemPrice

            let itemTotalPrice = finalPrice * selectedQty
            cartTotal += itemTotalPrice
        }

        const currentDate = new Date()
        const activeCoupons = await Coupon.find({ expirationDate: { $gt: currentDate } }, { _id: false, code: true, discount: true, maxDiscountAmount: true, minPurchaseAmount: true })
        const applicableCoupons = activeCoupons.filter((coupon) => coupon.minPurchaseAmount <= cartTotal)
        return res.status(200).json({ coupons: applicableCoupons })
    } catch (error) {
        console.log(error)
        return res.status(500).json({ message: 'Failed to get coupons' })
    }

}

export const applyCoupon = async (req, res) => {
    const { code } = req.body
    if (!code) return res.status(400).json({ message: 'Coupon code is required' })
    try {
        const coupon = await Coupon.findOne({ code })
        if (!coupon) return res.status(404).json({ message: 'Coupon not valid' })
        const cart = await Cart.findOne({ user_id: req.userId })
        if (!cart) return res.status(404).json({ message: 'Cart with not found for the user' })
        cart.appliedCoupon = {
            code: coupon.code,
            discount: coupon.discount,
            maxDiscountAmount: coupon.maxDiscountAmount
        }
        const newCart = await cart.save()
        return res.status(200).json({ message: 'Coupon applied sucessfully' })
    } catch (error) {
        return res.status(500).json({ message: 'Failed to apply coupon' })
    }

}

export const removeCoupon = async (req, res) => {
    const cart = await Cart.findOne({ user_id: req.userId })
    if (!cart) return res.status(404).json({ message: 'Cart with not found for the user' })
    try {
        await Cart.findOneAndUpdate({ user_id: req.userId }, { $unset: { appliedCoupon: '' } })
        return res.status(200).json({ message: 'Coupon removed successfully' })
    } catch (error) {
        return res.status(500).json({ message: 'Failed to remove coupon' })
    }
}

