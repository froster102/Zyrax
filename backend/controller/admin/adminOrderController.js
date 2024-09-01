import { Order } from "../../model/order.js"

const getAllOrders = async (req, res) => {
    const orders = await Order.find({})
    return res.status(200).json(orders)
}

const changeOrderStatus = async (req, res) => {
    const { id } = req.params
    const { status } = req.body
    const validStatuses = ['pending', 'confirmed', 'shipped', 'delivered', 'cancelled']
    if (!validStatuses.includes(status)) return res.status(400).json({ message: 'Invalid status' })
    const order = await Order.findOneAndUpdate({ _id: id }, { status: status }, { new: true, runValidators: true })
    if (order) return res.status(200).json({ message: 'Order status changed sucessfully' })
}

export {
    getAllOrders,
    changeOrderStatus
}