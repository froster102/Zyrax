import { Coupon } from "../../model/coupon.js"

const getCoupons = async (req, res) => {
    try {
        const coupons = await Coupon.find({})
        return res.status(200).json(coupons)
    } catch (error) {
        if (error.code === 1100) return res.status(409).json({ message: 'Coupon code must be unique' })
        return res.status(500).json({ message: 'Failed to get coupons' })
    }
}

const addCoupon = async (req, res) => {
    const {
        code,
        discount,
        expirationDate,
        minPurchaseAmount,
        maxDiscountAmount
    } = req.body
    try {
        const coupon = await Coupon.create({
            code,
            discount,
            expirationDate,
            minPurchaseAmount,
            maxDiscountAmount
        })
        if (coupon) return res.status(201).json({ message: 'Coupon created sucessfully' })
    } catch (e) {
        if (e.name === 'ValidationError') {
            const errMsg = []
            for (let error in e.errors) {
                errMsg.push(e.errors[error].properties.message)
            }
            return res.status(400).json({ errMsg })
        }
        return res.status(500).json({ message: 'Failed to add coupon' })
    }
}

const deleteCoupon = async (req, res) => {
    const { couponId } = req.params
    try {
        const coupon = await Coupon.findByIdAndDelete(couponId)
        if (coupon) return res.status(200).json({ message: 'Coupon deleted sucessfully' })
        return res.status(404).json({ message: 'Coupon with id not found' })
    } catch (error) {
        return res.status(500).json({ message: 'Failed to delete coupon' })
    }
}

export {
    getCoupons,
    addCoupon,
    deleteCoupon
}