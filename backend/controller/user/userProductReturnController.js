import { Order } from "../../model/order.js"
import { Return } from "../../model/return.js"

const returnOrder = async (req, res) => {
    const { orderId, productId } = req.params
    const { reason, additionalRemarks } = req.body
    const validReasons = [
        'product have been damaged',
        'changed my mind',
        'order placed by mistake',
        'doesnt liked the fit'
    ]
    if (!validReasons.includes(reason)) return res.status(400).json({ message: 'Enter a valid reason' })
    try {
        const existingReturn = await Return.findOne({ user_id: req.userId, productId: productId })
        if (existingReturn) return res.status(409).json({ message: 'Return already request , in processing' })
        const return_ = await Return.create({
            user_id: req.userId,
            orderId,
            productId,
            reason,
            remark: additionalRemarks,
            status: 'requested',
        })
        const order = await Order.findOneAndUpdate(
            { _id: orderId, 'products.productId': productId },
            { $set: { 'products.$.status': 'return requested' } },
            { new: true }
        )
        return res.status(201).json({ message: 'Your return has been succcesfully requested' })
    } catch (e) {
        if (e.name === 'ValidationError') {
            const message = []
            for (let error in e.errors) {
                if (e.errors[error].name === 'CastError') {
                    message.push('Invalid object Id found in the ids')
                } else {
                    message.push(e.errors[error].properties.message)
                }
            }
            return res.status(400).json({ message })
        }
        return res.status(500).json({ message: 'Failed to make a return request' })
    }
}

export {
    returnOrder
}