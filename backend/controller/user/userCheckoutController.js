import { Cart } from "../../model/cart.js"
import { Order } from "../../model/order.js"
import { Product } from "../../model/product.js"

const handleCheckOut = async (req, res) => {
    const { cartItems, paymentMethod, shippingAddressId } = req.body
    const validPaymentMethods = ['upi/card', 'cash on delivery', 'paypal']
    if (!validPaymentMethods.includes(paymentMethod)) return res.status(400).json({ message: 'Payment method not valid' })
    try {
        let totalAmount = 0
        const processedItems = []
        for (let item of cartItems) {
            const product = await Product.findById(item.product._id)
            if (!product) return res.status(404).json({ message: `Product with ${item.product._id} not found` })
            const sizeQtyMap = product.stock.reduce((acc, { size, quantity }) => {
                acc[size] = quantity
                return acc
            }, {})
            if (item.selectedQty < 1 || item.selectedQty > sizeQtyMap[item.selectedSize]) {
                const response = await Cart.findOneAndUpdate(
                    { user_id: req.userId, 'items.productId': item.product._id },
                    { $pull: { items: { productId: item.product._id } } },
                    { new: true, runValidators: true })
                if (response) return res.status(400).json({
                    message: `Requested product ${product.name} is currently out of stock`,
                    type: 'stockError',
                    itemId: item.product._id
                })
            }
            let itemTotalPrice = item?.product?.price * item?.selectedQty
            totalAmount += item?.product?.price
            processedItems.push({
                productId: item?.product?._id,
                quantity: item?.selectedQty,
                size: item?.selectedSize,
                unitPrice: item?.product?.price,
                totalPrice: itemTotalPrice,
                status: 'confirmed'
            })
        }
        if (paymentMethod === 'cash on delivery') {
            const order = await Order.create({
                userId: req.userId,
                status: 'confirmed',
                totalAmount,
                shipping: {
                    addressId: shippingAddressId
                },
                payment: {
                    method: 'cash on delivery',
                    status: 'pending',
                    transactionId: null
                },
                products: processedItems
            })
            if (order) {
                await Cart.findOneAndUpdate({
                    user_id: req.userId,
                }, {
                    $set: { items: [] }
                }, { new: true })

                for (const item of processedItems) {
                    await Product.findOneAndUpdate(
                        { _id: item.productId, 'stock.size': item.size },
                        { $inc: { 'stock.$.quantity': -item.quantity } }, { runValidators: true })
                }
                return res.status(200).json({ message: 'Order confirmed sucessfully' })
            }
        }
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
        return res.status(500).json({ message: 'Failed to confirm order' })
    }

}

export {
    handleCheckOut
}