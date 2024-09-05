import { Order } from "../../model/order.js"

const getAllOrders = async (req, res) => {
    const orders = await Order.find({}).populate('products.productId')
    return res.status(200).json(orders)
}

const changeProductOrderStatus = async (req, res) => {
    const { orderId, productId } = req.params
    const { status } = req.body
    console.log(status)
    const validStatuses = ['pending', 'confirmed', 'shipped', 'delivered', 'cancelled']
    if (!validStatuses.includes(status)) return res.status(400).json({ message: 'Invalid status' })
    try {
        const order = await Order.findOneAndUpdate(
            { _id: orderId, 'products.productId': productId },
            { $set: { 'products.$.status': status } },
            { new: true, runValidators: true })
        if (order) {
            const updatedProductStatuses = order.products.map(product => product.status)
            const allStatusSame = updatedProductStatuses.every(status => status === updatedProductStatuses[0])
            if (allStatusSame) {
                await Order.findOneAndUpdate({_id:orderId},{status:updatedProductStatuses[0]})
            }
            return res.status(200).json({ message: 'Product order status changed sucessfully' })
        }
    } catch (error) {
        console.log(error)
    }

}

export {
    getAllOrders,
    changeProductOrderStatus
}