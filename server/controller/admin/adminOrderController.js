import { Order } from "../../model/order.js"

const getAllOrders = async (req, res) => {
    const orders = await Order.find({}).populate('products.productId').populate({
        path: 'userId',
        select: 'firstName email phoneNumber'
    }).populate('shipping.addressId')
    return res.status(200).json(orders)
}

const changeProductOrderStatus = async (req, res) => {
    const { orderId, itemId } = req.params
    const { status } = req.body
    const validStatuses = ['pending', 'confirmed', 'shipped', 'delivered', 'cancelled']
    if (!validStatuses.includes(status)) return res.status(400).json({ message: 'Invalid status' })
    try {
        const order = await Order.findOneAndUpdate(
            { _id: orderId, 'products._id': itemId },
            { $set: { 'products.$.status': status } },
            { new: true, runValidators: true })
        if (order) {
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