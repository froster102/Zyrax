import crypto from 'crypto'
import { Order } from '../../model/order.js'
import { Product } from '../../model/product.js'
import razorpay from '../../config/razorpayConfig.js'
import { Cart } from '../../model/cart.js'
import { User } from '../../model/user.js'

const verifyPayment = async (req, res) => {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature, error } = req.body
    try {
        if (error) {
            const order = await Order.findOne({ payment_order_id: error.metadata.order_id })
            order.status = 'failed'
            order.payment.status = 'failed'
            const { products } = order
            products.forEach(product => {
                product.status = 'failed'
            })
            await order.save()
            return res.status(400).json({ message: 'Failed to place the order due to payment failure ,please try again' })
        }
        const generateSignature = crypto.createHmac('sha256', process.env.RAZORPAY_SECRET).update(razorpay_order_id + '|' + razorpay_payment_id).digest('hex')
        if (generateSignature === razorpay_signature) {
            const order = await Order.findOne({ payment_order_id: razorpay_order_id }).populate({
                path: 'products.productId'
            }).populate({
                path: 'userId',
                select: 'firstName email phoneNumber'
            }).populate({
                path: 'shipping.addressId'
            })
            const { products } = order
            const bulkOps = products.map((item) => ({
                updateOne: {
                    filter: { _id: item.productId._id, 'stock.size': item.size },
                    update: { $inc: { 'stock.$.quantity': -item.quantity, soldCount: item.quantity } },
                    options: { runValidators: true }
                }
            }))
            if (bulkOps.length > 0) {
                const response = await Product.bulkWrite(bulkOps)
                await User.findOneAndUpdate({ _id: req.userId }, { $inc: { totalSpent: order.totalAmount } })
                await Cart.findOneAndUpdate({
                    user_id: req.userId,
                }, {
                    $set: { items: [] }
                }, { new: true })
            }
            const payment = await razorpay.payments.fetch(razorpay_payment_id)
            order.status = 'confirmed'
            order.products.forEach(product => {
                product.status = 'confirmed'
            })
            order.payment.status = 'success'
            order.payment.method = payment.method
            await order.save()
            const { _id, ...updateOrder } = order.toObject()
            return res.status(200).json({ message: 'Payment verified successfully', orderDetails: { order: updateOrder } })
        } else {
            return res.status(400).json({ message: 'Failed to verify your payment' })
        }
    }
    catch (error) {
        console.log(error)
        return res.status(500).json({ message: 'Error verifying your payment' })
    }
}

export {
    verifyPayment
}
