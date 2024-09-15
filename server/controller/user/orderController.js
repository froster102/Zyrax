import { Order } from "../../model/order.js"
import { Product } from "../../model/product.js"
import { Return } from "../../model/return.js"

const getUserOrders = async (req, res) => {
    try {
        const orders = await Order.find({ userId: req.userId }).populate('products.productId').sort({ createdAt: -1 })
        return res.status(200).json(orders)
    } catch (e) {
        if (e.name === 'ValidationError') {
            const message = []
            for (let error in e.errors) {
                message.push(e.errors[error].properties.message)
            }
            return res.status(400).json({ message })
        }
        return res.status(500).json({ message: 'Failed to get orders' })
    }
}

const processOrder = async (req, res) => {
    // const { productId, }
    try {

    } catch (error) {

    }
}

const getOrderDetails = async (req, res) => {
    const { orderId, productId } = req.params
    if (!orderId) return res.status(400).json({ message: 'Order id is required' })
    if (!productId) return res.status(400).json({ message: 'Product id is required' })
    try {
        const order = await Order.findOne({ orderId: orderId, 'products.productId': productId }, { _id: false }).populate({
            path: 'products.productId'
        })
        if (!order) return res.status(404).json({ message: 'Order with id not found' })
        const orderItem = order.products.find(product => productId === productId)
        return res.status(200).json({ orderItem, order })
    } catch (error) {
        return res.status(500).json({ message: 'Failed to get order details' })
    }
}

const cancelOrder = async (req, res) => {
    const { orderId, productId } = req.params
    if (!orderId || !productId) return res.status(400).json({ message: 'Order ID and product ID required' })
    try {
        const order = await Order.findOne({ orderId: orderId })
        const product = await Order.findOne({ orderId: orderId, 'products.productId': productId })
        if (!order) return res.status(404).json({ message: `Order with ${orderId} not found` })
        if (!product) return res.status(404).json({ message: `Product ID ${productId} not found in order ${orderId}` })
        await Order.findOneAndUpdate({
            orderId: orderId,
            'products.productId': productId
        }, {
            $set: {
                'products.$.status': 'cancelled',
                'products.$.cancelledDate': new Date()
            }
        }, { new: true, runValidators: true })
        if (order) {
            const cancelledProduct = order.products.find(product => product.productId.toString() === productId)
            if (cancelledProduct) {
                const { size, quantity } = cancelledProduct
                await Product.findOneAndUpdate({
                    _id: productId,
                    'stock.size': size
                },
                    {
                        $inc: {
                            'stock.$.quantity': Number(quantity)
                        }
                    }
                )
            }
            return res.status(200).json({ message: 'Order cancelled sucessfully' })
        }
    } catch (e) {
        if (e.name === 'CastError') {
            return res.status(400).json({ message: `Invalid ${e.path === 'productId' ? 'product ID' : 'order ID'}` })
        }
        if (e.name === 'ValidationError') {
            const message = []
            for (let error in e.errors) {
                message.push(e.errors[error].properties.message)
            }
            return res.status(400).json({ message })
        }
        return res.status(500).json({ message: 'Failed to cancel orders' })
    }
}

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
    getUserOrders,
    getOrderDetails,
    cancelOrder,
    returnOrder
}