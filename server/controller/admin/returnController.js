import { nanoid } from "nanoid"
import { Order } from "../../model/order.js"
import { Return } from "../../model/return.js"
import { Wallet } from '../../model/wallet.js'
import { Product } from "../../model/product.js"
import { User } from "../../model/user.js"
import { Category } from "../../model/category.js"

const getAllReturns = async (req, res) => {
    try {
        const returns = await Return.find().populate({
            path: 'user_id',
            select: 'email'
        }).populate('orderId').populate('productId')
        return res.status(200).json(returns)
    } catch (error) {
        return res.status(500).json({ message: 'Failed to get return details' })
    }
}

const approveReturn = async (req, res) => {
    const { productId, orderId } = req.body
    try {
        const return_ = await Return.findOne({
            orderId,
            productId
        })
        if (!return_) return res.status(404).json({ message: 'Return with id not found' })
        if (return_.status === 'approved') return res.status(400).json({ message: 'Return has already been approved' })
        const order = await Order.findOne({ _id: orderId })
        return_.status = 'approved'
        const returnOrder = order.products.find(product => product.productId.toString() === productId)
        returnOrder.status = 'returned'
        return_.approvedAt = new Date()
        if (return_.reason !== 'product have been damaged') {
            const orderedProduct = order.products.find(product => product.productId.toString() === productId)
            const size = orderedProduct.size
            const product = await Product.findOneAndUpdate(
                { _id: productId, 'stock.size': size },
                { $inc: { 'stock.$.quantity': orderedProduct.quantity, soldCount: -orderedProduct.quantity } }
            )
            await Category.findOneAndUpdate({ _id: product.category }, { $inc: { soldCount: -orderedProduct.quantity } })
            const user = await User.findOneAndUpdate({ _id: order.userId },
                { $inc: { totalSpent: -orderedProduct.orderPrice } }
            )
        }
        await return_.save()
        await order.save()
        const wallet = await Wallet.findOne({ user_id: order.userId })
        const transaction = {
            txnid: nanoid(),
            amount: returnOrder.orderPrice,
            type: 'credit',
            status: 'success'
        }
        wallet.balance += returnOrder.orderPrice
        wallet.transactions.push(transaction)
        wallet.save()
        return res.status(200).json({ message: 'Return approved sucessfully' })
    } catch (error) {
        console.log(error)
        return res.status(500).json({ message: 'Failed to approve order' })
    }
}

export {
    getAllReturns,
    approveReturn
}