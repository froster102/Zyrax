import { Cart } from "../../model/cart.js"
import { Order } from "../../model/order.js"
import { Product } from "../../model/product.js"
import razorpay from "../../config/razorpayConfig.js"
import { User } from "../../model/user.js"
import { Wallet } from "../../model/wallet.js"
import { nanoid } from "nanoid"

const handleCheckOut = async (req, res) => {
    const { paymentMethod, shippingAddressId } = req.body
    const validPaymentMethods = ['razorpay', 'cash on delivery', 'paypal', 'zyraxWallet']
    if (!validPaymentMethods.includes(paymentMethod)) return res.status(400).json({ message: 'Payment method not valid' })
    try {
        const userInfo = await User.findOne({ _id: req.userId })
        const cart = await Cart.findOne({ user_id: req.userId }).populate({
            path: 'items',
            populate: {
                path: 'productId'
            }
        })
        const cartItems = cart.items
        let totalAmount = 0
        let itemTotalPrice = 0
        const processedItems = []
        for (let item of cartItems) {
            const product = await Product.findById(item.productId)
            if (!product) return res.status(404).json({ message: `Product with ${item.productId} not found` })
            const sizeQtyMap = product.stock.reduce((acc, { size, quantity }) => {
                acc[size] = quantity
                return acc
            }, {})
            if (item.selectedQty < 1 || item.selectedQty > sizeQtyMap[item.selectedSize]) {
                const response = await Cart.findOneAndUpdate(
                    { user_id: req.userId, 'items.productId': item.productId },
                    { $pull: { items: { productId: item.productId } } },
                    { new: true, runValidators: true })
                if (response) return res.status(400).json({
                    message: `Requested product ${product.name} is currently out of stock`,
                    type: 'stockError',
                    itemId: item.productId
                })
            }
            itemTotalPrice = item?.productId?.price * item?.selectedQty
            totalAmount += itemTotalPrice
            processedItems.push({
                productId: item?.productId?._id,
                quantity: item?.selectedQty,
                size: item?.selectedSize,
                unitPrice: item?.productId?.price,
                totalPrice: itemTotalPrice,
                status: 'confirmed'
            })
        }
        if (paymentMethod === 'cash on delivery') {
            const order = await Order.create({
                userId: req.userId,
                orderId: nanoid(6),
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
                return res.status(200).json({ message: 'Order placed sucessfully', orderId: order.orderId })
            }
        } else if (paymentMethod === 'razorpay') {
            const paymentOrder = await razorpay.orders.create({
                amount: totalAmount * 100,
                currency: 'INR',
                receipt: crypto.randomUUID()
            })
            const order = await Order.create({
                userId: req.userId,
                order_id: paymentOrder.id,
                status: 'confirmed',
                totalAmount,
                shipping: {
                    addressId: shippingAddressId
                },
                payment: {
                    status: 'pending',
                    transactionId: crypto.randomUUID(),
                },
                products: processedItems
            })
            if (order) {
                await Cart.findOneAndUpdate({
                    user_id: req.userId,
                }, {
                    $set: { items: [] }
                }, { new: true })
            }
            return res.status(200).json(paymentOrder)
        } else if (paymentMethod === 'zyraxWallet') {
            const txnid = nanoid(12)
            const wallet = await Wallet.findOne({ user_id: req.userId })
            if (totalAmount > wallet.balance) return res.status(400).json({ message: 'Insufficient balance in your wallet' })
            wallet.balance -= totalAmount
            wallet.transactions.push({
                txnid,
                amount: totalAmount,
                type: 'debit',
                status: 'success'
            })
            await wallet.save()
            const order = await Order.create({
                userId: req.userId,
                status: 'confirmed',
                totalAmount,
                shipping: {
                    addressId: shippingAddressId
                },
                payment: {
                    method: 'zyraxWallet',
                    status: 'pending',
                    transactionId: txnid,
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
                return res.status(200).json({ message: 'Order placed sucessfully' })
            }
        }
    } catch (e) {
        console.log(e)
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