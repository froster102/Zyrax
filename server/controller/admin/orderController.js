import { Order } from "../../model/order.js"

const getAllOrders = async (req, res) => {
    const { page = 1, limit = 0, startDate, endDate, date } = req.query
    const skip = (page - 1) * limit
    const totalCount = await Order.countDocuments()
    const orders = await Order.find({ status: { $ne: 'initiated' } }).skip(skip).limit(limit).populate('products.productId').populate({
        path: 'userId',
        select: 'firstName email phoneNumber'
    }).populate('shipping.addressId')
    return res.status(200).json({ orders, totalCount })
}

const changeProductOrderStatus = async (req, res) => {
    const { orderId, itemId } = req.params
    const { status } = req.body
    const validStatuses = ['pending', 'confirmed', 'shipped', 'delivered', 'cancelled']
    if (!validStatuses.includes(status)) return res.status(400).json({ message: 'Invalid status' })
    try {
        const order = await Order.findOne({ _id: orderId, 'products._id': itemId })
        const orderItem = order.products.find(product => product._id.toString() === itemId)
        if (orderItem.status === 'delivered') return res.status(400).json({ message: 'Status change is not allowed if item has been delivered' })
        const updatedOrder = await Order.findOneAndUpdate(
            { _id: orderId, 'products._id': itemId },
            { $set: { 'products.$.status': status } },
            { new: true, runValidators: true })
        if (updatedOrder) {
            return res.status(200).json({ message: 'Product order status changed sucessfully' })
        }
    } catch (error) {
        return res.status(500).json({ message: 'Failed to change product status' })
    }

}

export {
    getAllOrders,
    changeProductOrderStatus
}