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
            let itemTotalPrice = item?.product?.price * item?.selectedQty
            totalAmount += item?.product?.price
            processedItems.push({
                productId: item?.product?._id,
                quantity: item?.selectedQty,
                size: item?.selectedSize,
                unitPrice: item?.product?.price,
                totalPrice: itemTotalPrice
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
                return res.status(200).json({ message: 'Order confirmed sucessfully' })
            }
        }
    } catch (e) {
        if (e.name === 'ValidationError') {
            const errMsg = []
            for (let error in e.errors) {
                errMsg.push(e.errors[error].properties.message)
            }
            return res.status(400).json({ errMsg })
        }
        return res.status(500).json({ message: 'Order confirmation failed' })
    }

}

export {
    handleCheckOut
}