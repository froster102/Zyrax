import { nanoid } from "nanoid"
import { Order } from "../../model/order.js"
import { Product } from "../../model/product.js"
import { Return } from "../../model/return.js"
import { Wallet } from "../../model/wallet.js"
import { User } from "../../model/user.js"
import { Cart } from "../../model/cart.js"
import razorpay from "../../config/razorpayConfig.js"
import { calculateDiscount } from "../../utils/helper.js"
import { Coupon } from "../../model/coupon.js"
import { Category } from "../../model/category.js"

const checkout = async (req, res) => {
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
            if (totalAmount < 1000) return res.status(400).json({ message: 'Cash on delivery only for order above 1000' })
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
                    status: 'success',
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

const getUserOrders = async (req, res) => {
    try {
        const orders = await Order.find({ userId: req.userId, status: { $ne: 'initiated' } }).populate('products.productId').sort({ createdAt: -1 })
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

const getOrderDetails = async (req, res) => {
    const { orderId, productId } = req.query
    if (!orderId) return res.status(400).json({ message: 'Order id is required' })
    try {
        const order = await Order.findOne({ orderId: orderId }, { _id: false }).populate({
            path: 'products.productId'
        }).populate({
            path: 'userId',
            select: 'firstName email phoneNumber'
        }).populate({
            path: 'shipping.addressId'
        })
        if (!order) return res.status(404).json({ message: 'Order with id not found' })
        if (productId) {
            const orderItem = order.products.find(product => product.productId._id.toString() === productId)
            return res.status(200).json({ orderItem, order })
        }
        return res.status(200).json({ order })
    } catch (error) {
        return res.status(500).json({ message: 'Failed to get order details' })
    }
}

const cancelOrder = async (req, res) => {
    const { orderId, productId } = req.params
    if (!orderId || !productId) return res.status(400).json({ message: 'Order ID and product ID required' })
    try {
        const order = await Order.findOne({ orderId: orderId })
        const product = await Order.findOne({ orderId: orderId, 'products.productId': productId })
        if (!order) return res.status(404).json({ message: `Order with ${orderId} not found` })
        if (!product) return res.status(404).json({ message: `Product ID ${productId} not found in order ${orderId}` })
        if (order.payment.method !== 'cash on delivery') {
            const wallet = await Wallet.findOne({ user_id: req.userId })
            if (!wallet) return res.status(400).json({ message: 'Wallet should be created to proceed with cancellation' })
        }
        await Order.findOneAndUpdate({
            orderId: orderId,
            'products.productId': productId
        }, {
            $set: {
                'products.$.status': 'cancelled',
                'products.$.cancelledDate': new Date()
            }
        }, { new: true, runValidators: true })
        if (order) {
            const cancelledProduct = order.products.find(product => product.productId.toString() === productId)
            const { orderPrice } = order.products.find(product => product.productId.toString() === productId)
            if (cancelledProduct) {
                const { size, quantity } = cancelledProduct
                await Product.findOneAndUpdate({
                    _id: productId,
                    'stock.size': size
                },
                    {
                        $inc: {
                            'stock.$.quantity': Number(quantity),
                            soldCount: -Number(quantity)
                        }
                    }
                )
                await User.findOneAndUpdate({
                    _id: order.userId,
                }, {
                    $inc: { totalSpent: -cancelledProduct.orderPrice }
                })
                if (order.payment.method !== 'cash on delivery') {
                    const wallet = await Wallet.findOne({ user_id: req.userId })
                    const transaction = {
                        txnid: nanoid(),
                        amount: orderPrice,
                        type: 'credit',
                        status: 'success'
                    }
                    wallet.balance += Number(orderPrice)
                    wallet.transactions.push(transaction)
                    await wallet.save()
                }
            }
            return res.status(200).json({ message: 'Order cancelled sucessfully' })
        }
    } catch (e) {
        // console.log(e)
        // if (e.name === 'CastError') {
        //     return res.status(400).json({ message: `Invalid ${e.path === 'productId' ? 'product ID' : 'order ID'}` })
        // }
        // if (e.name === 'ValidationError') {
        //     const message = []
        //     for (let error in e.errors) {
        //         message.push(e.errors[error].properties.message)
        //     }
        //     return res.status(400).json({ message })
        // }
        return res.status(500).json({ message: 'Failed to cancel orders' })
    }
}

const returnOrder = async (req, res) => {
    const { orderId, productId } = req.params
    const { reason, additionalRemarks } = req.body
    const validReasons = [
        'product have been damaged',
        'changed my mind',
        'order placed by mistake',
        'doesnt liked the fit'
    ]
    if (!validReasons.includes(reason)) return res.status(400).json({ message: 'Enter a valid reason' })
    try {
        const wallet = Wallet.findOne({ user_id: req.userId })
        if (!wallet) return res.status(400).json({ message: 'Wallet should be created to proceed with returns' })
        const order = await Order.findOne({ orderId: orderId })
        const existingReturn = await Return.findOne({ user_id: req.userId, productId: productId, orderId: order._id })
        if (existingReturn) return res.status(409).json({ message: 'Return already request , in processing' })
        const return_ = await Return.create({
            user_id: req.userId,
            orderId: order._id,
            productId,
            reason,
            remark: additionalRemarks,
            status: 'requested',
        })
        await Order.findOneAndUpdate(
            { orderId: orderId, 'products.productId': productId },
            { $set: { 'products.$.status': 'return requested' } },
            { new: true }
        )
        return res.status(201).json({ message: 'Your return has been succcesfully requested' })
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
        return res.status(500).json({ message: 'Failed to make a return request' })
    }
}

const retryPayment = async (req, res) => {
    const { orderId } = req.params
    const { paymentMethod, shippingAddressId } = req.body
    const validPaymentMethods = ['razorpay', 'cash on delivery', 'paypal', 'zyraxWallet']
    if (!validPaymentMethods.includes(paymentMethod)) return res.status(400).json({ message: 'Payment method not valid' })
    try {
        const order = await Order.findOne({ orderId: orderId }).populate('products.productId')
        if (!order) return res.status(404).json({ message: 'Order not found' })
        const orderItems = order.products
        let totalAmount = order.totalAmount

        const productIds = orderItems.map(item => item.productId._id.toString())
        const products = await Product.find({ _id: { $in: productIds } })
        const productMap = products.reduce((acc, product) => {
            acc[product._id] = product
            return acc
        }, {})

        for (let item of orderItems) {
            const product = productMap[item.productId._id]
            if (!product) return res.status(404).json({ message: `Product with ${item.productId} not found` })

            const sizeQtyMap = item.productId.stock.reduce((acc, { size, quantity }) => {
                acc[size] = quantity
                return acc
            }, {})

            if (item.quantity < 1 || item.quantity > sizeQtyMap[item.size]) {
                return res.status(400).json({
                    message: `Requested product ${product.name} is currently out of stock`,
                    type: 'stockError',
                    itemId: item.productId
                })
            }
        }
        if (paymentMethod === 'cash on delivery') {
            if (totalAmount < 1000) return res.status(400).json({ message: 'Cash on delivery only for order above 1000' })
            await User.findOneAndUpdate({ _id: req.userId }, { $inc: { totalSpent: order.totalAmount } })
            order.status = 'confirmed'
            order.payment.method = 'cash on delivery'
            order.shipping.addressId = shippingAddressId
            
            for (const item of orderItems) {
                item.status = 'confirmed'
                const product = await Product.findOneAndUpdate(
                    { _id: item.productId._id, 'stock.size': item.size },
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
            await order.save()
            return res.status(200).json({ message: 'Order placed sucessfully', orderDetails: { order: updatedOrder } })
        } else if (paymentMethod === 'razorpay') {
            const paymentOrder = await razorpay.orders.fetch(order.payment_order_id)
            order.shipping.addressId = shippingAddressId
            return res.status(200).json(paymentOrder)
        } else if (paymentMethod === 'zyraxWallet') {
            order.shipping.addressId = shippingAddressId
            order.status = 'confirmed'
            order.payment.method = 'zyraxWallet'
            order.payment.status = 'success'
            for (let item of orderItems) {
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
            await User.findOneAndUpdate({ _id: req.userId }, { $inc: { totalSpent: order.totalAmount } })
            for (const item of orderItems) {
                const product = await Product.findOneAndUpdate(
                    { _id: item.productId._id, 'stock.size': item.size },
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
            await wallet.save()
            await order.save()
            return res.status(200).json({ message: 'Order placed sucessfully', orderDetails: { order: updatedOrder } })
        }
    } catch (error) {
        return res.status(500).json({ message: 'Failed to proceed  with retry payment please try again later' })
    }
}

export {
    getUserOrders,
    getOrderDetails,
    cancelOrder,
    returnOrder,
    checkout,
    retryPayment
}