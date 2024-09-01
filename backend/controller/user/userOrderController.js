import { Order } from "../../model/order.js"

const getUserOrders = async (req, res) => {
    try {
        const orders = await Order.findOne({ userId: req.userId }).populate('products.productId')
        return res.status(200).json(orders)
    } catch (e) {
        if (e.name === 'ValidationError') {
            const errMsg = []
            for (let error in e.errors) {
                errMsg.push(e.errors[error].properties.message)
            }
            return res.status(400).json({ errMsg })
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
    const { id } = req.params
    try {
        const order = await Order.findOneAndUpdate({
            _id: id
        }, { status: 'cancelled' }, { new: true, runValidators: true })
        if (order) return res.status(200).json({ message: 'Order cancelled sucessfully' })
    } catch (e) {
        if (e.name === 'ValidationError') {
            const errMsg = []
            for (let error in e.errors) {
                errMsg.push(e.errors[error].properties.message)
            }
            return res.status(400).json({ errMsg })
        }
        return res.status(500).json({ message: 'Failed to cancel orders' })
    }
}

export {
    getUserOrders,
    cancelOrder
}