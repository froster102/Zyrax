import { nanoid } from "nanoid"
import { Order } from "../../model/order.js"
import { Return } from "../../model/return.js"
import { Wallet } from '../../model/wallet.js'

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
        const order = await Order.findOne({ _id: orderId })
        return_.status = 'approved'
        const returnOrder = order.products.find(product => product.productId.toString() === productId)
        returnOrder.status = 'returned'
        // const product = await Product.find({ _id: productId })
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