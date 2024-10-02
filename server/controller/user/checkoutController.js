import { Cart } from "../../model/cart.js"
import { Order } from "../../model/order.js"
import { Product } from "../../model/product.js"
import razorpay from "../../config/razorpayConfig.js"
import { User } from "../../model/user.js"
import { Wallet } from "../../model/wallet.js"
import { nanoid } from "nanoid"
import { calculateDiscount } from "../../utils/helper.js"
import { Coupon } from "../../model/coupon.js"
import { Category } from "../../model/category.js"

const handleCheckOut = async (req, res) => {
    const { paymentMethod, shippingAddressId } = req.body
    const validPaymentMethods = ['razorpay', 'cash on delivery', 'paypal', 'zyraxWallet']
    if (!validPaymentMethods.includes(paymentMethod)) return res.status(400).json({ message: 'Payment method not valid' })
    try {
        const userInfo = await User.findOne({ _id: req.userId })
        const cart = await Cart.findOne({ user_id: req.userId }).populate({
            path: 'items',
            populate: {
                path: 'productId',
                populate: {
                    path: 'offer'
                }
            }
        })
        const cartItems = cart.items
        let totalAmount = 0
        let itemTotalPrice = 0
        const processedItems = []

        const productIds = cartItems.map(item => item.productId._id.toString())
        const products = await Product.find({ _id: { $in: productIds } }).populate('offer')

        const productMap = products.reduce((acc, product) => {
            acc[product._id] = product
            return acc
        }, {})


        for (let item of cartItems) {
            const product = productMap[item.productId._id]
            let offerDiscountAmount = 0
            if (!product) return res.status(404).json({ message: `Product with ${item.productId} not found` })

            const sizeQtyMap = item.productId.stock.reduce((acc, { size, quantity }) => {
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
            const itemPrice = product.price
            const selectedQty = item.selectedQty

            const finalPrice = product.offer
                ? calculateDiscount(itemPrice, product.offer.discountPercentage)
                : itemPrice
            if (item.productId.offer) {
                offerDiscountAmount = parseInt((item.productId?.offer.discountPercentage / 100) * item?.productId?.price) * item.selectedQty
            }
            itemTotalPrice = finalPrice * selectedQty
            totalAmount += itemTotalPrice
            processedItems.push({
                productId: item?.productId?._id,
                quantity: item?.selectedQty,
                size: item?.selectedSize,
                orderPrice: itemTotalPrice,
                unitPrice: item?.productId?.price,
                totalPrice: totalAmount,
                appliedOfferAmount: offerDiscountAmount,
                status: 'pending'
            })
        }
        let appliedCouponAmount = 0
        if (cart.appliedCoupon.code) {
            const coupon = await Coupon.findOne({ code: cart.appliedCoupon.code })
            if (coupon.minPurchaseAmount <= totalAmount) {
                const couponAmount = parseInt((cart.appliedCoupon.discount / 100) * totalAmount)
                const applicableDiscountAmount = Math.min(couponAmount, cart.appliedCoupon.maxDiscountAmount)
                totalAmount -= applicableDiscountAmount
                appliedCouponAmount = applicableDiscountAmount
            } else {
                cart.appliedCoupon = {}
                await cart.save()
            }
        }
        if (paymentMethod === 'cash on delivery') {
            for (let item of processedItems) {
                item.status = 'confirmed'
            }
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
                products: processedItems,
                appliedCouponAmount
            })
            if (order) {
                await Cart.findOneAndUpdate({ user_id: req.userId, }, { $set: { items: [] } }, { new: true })
                await User.findOneAndUpdate({ _id: req.userId }, { $inc: { totalSpent: order.totalAmount } })
                for (const item of processedItems) {
                    const product = await Product.findOneAndUpdate(
                        { _id: item.productId, 'stock.size': item.size },
                        { $inc: { 'stock.$.quantity': -item.quantity, soldCount: item.quantity } }, { runValidators: true }, { new: true })
                    await Category.findOneAndUpdate({ _id: product.category }, { $inc: { soldCount: item.quantity } }, { new: true })
                }
                const createdOrder = await Order.findOne({ _id: order._id }).populate({
                    path: 'products.productId'
                }).populate({
                    path: 'userId',
                    select: 'firstName email phoneNumber'
                }).populate({
                    path: 'shipping.addressId'
                })
                const { _id, ...updatedOrder } = createdOrder.toObject()
                return res.status(200).json({ message: 'Order placed sucessfully', orderDetails: { order: updatedOrder } })
            }
        } else if (paymentMethod === 'razorpay') {
            const paymentOrder = await razorpay.orders.create({
                amount: totalAmount * 100,
                currency: 'INR',
                receipt: crypto.randomUUID()
            })
            const order = await Order.create({
                userId: req.userId,
                payment_order_id: paymentOrder.id,
                orderId: nanoid(6),
                status: 'initiated',
                totalAmount,
                shipping: {
                    addressId: shippingAddressId
                },
                payment: {
                    status: 'pending',
                    transactionId: crypto.randomUUID(),
                },
                products: processedItems,
                appliedCouponAmount
            })
            return res.status(200).json(paymentOrder)
        } else if (paymentMethod === 'zyraxWallet') {
            for (let item of processedItems) {
                item.status = 'confirmed'
            }
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
                orderId: nanoid(6),
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
                products: processedItems,
                appliedCouponAmount
            })
            if (order) {
                await User.findOneAndUpdate({ _id: req.userId }, { $inc: { totalSpent: order.totalAmount } })
                await Cart.findOneAndUpdate({ user_id: req.userId, }, { $set: { items: [] } }, { new: true })
                for (const item of processedItems) {
                    const product = await Product.findOneAndUpdate(
                        { _id: item.productId, 'stock.size': item.size },
                        { $inc: { 'stock.$.quantity': -item.quantity, soldCount: item.quantity } }, { runValidators: true })
                    await Category.findOneAndUpdate({ _id: product.category }, { $inc: { soldCount: item.quantity } }, { new: true })
                }
                const createdOrder = await Order.findOne({ _id: order._id }).populate({
                    path: 'products.productId'
                }).populate({
                    path: 'userId',
                    select: 'firstName email phoneNumber'
                }).populate({
                    path: 'shipping.addressId'
                })
                const { _id, ...updatedOrder } = createdOrder.toObject()
                return res.status(200).json({ message: 'Order placed sucessfully', orderDetails: { order: updatedOrder } })
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