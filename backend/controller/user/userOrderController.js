import { Order } from "../../model/order.js"
import { Product } from "../../model/product.js"

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

const cancelOrder = async (req, res) => {
    const { orderId, productId } = req.params
    if (!orderId || !productId) return res.status(400).json({ message: 'Order ID and product ID required' })
    try {
        const order = await Order.findOne({ _id: orderId })
        const product = await Order.findOne({ _id: orderId, 'products.productId': productId })
        if (!order) return res.status(404).json({ message: `Order with ${orderId} not found` })
        if (!product) return res.status(404).json({ message: `Product ID ${productId} not found in order ${orderId}` })
        await Order.findOneAndUpdate({
            _id: orderId,
            'products.productId': productId
        }, {
            $set: {
                'products.$.status': 'cancelled',
                'products.$.cancelledDate': new Date()
            }
        }, { new: true, runValidators: true })
        if (order) {
            const cancelledProduct = order.products.find(product => product.productId.toString() === productId)
            if (cancelOrder) {
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

export {
    getUserOrders,
    cancelOrder
}