import crypto from 'crypto'
import { Order } from '../../model/order.js'
import { Product } from '../../model/product.js'
import razorpay from '../../config/razorpayConfig.js'

const verifyPayment = async (req, res) => {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body
    const generateSignature = crypto.createHmac('sha256', process.env.RAZORPAY_SECRET).update(razorpay_order_id + '|' + razorpay_payment_id).digest('hex')
    if (generateSignature === razorpay_signature) {
        try {
            const order = await Order.findOne({ order_id: razorpay_order_id })
            const { products } = order
            for (const item of products) {
                await Product.findOneAndUpdate(
                    { _id: item.productId, 'stock.size': item.size },
                    { $inc: { 'stock.$.quantity': -item.quantity } }, { runValidators: true })
            }
            const payment = await razorpay.payments.fetch(razorpay_payment_id)
            order.payment.status = 'success'
            order.payment.method = payment.method
            await order.save()
            return res.redirect(`http://localhost:5173/order-sucess?order_id=${order.orderId}`)
        } catch (error) {
            return res.status(500).json({ message: 'Error verifying your payment' })
        }
    } else {
        return res.status(400).json({ message: 'Unauthorised' })
    }
    
}

export {
    verifyPayment
}
