import crypto from 'crypto'
import { Wallet } from '../../model/wallet.js'

const verifyWalletPayment = async (req, res) => {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature, error } = req.body
    if (error) {
        const wallet = await Wallet.findOne({ 'transactions.payment_id': error.metadata.order_id })
        const transaction = wallet.transactions.find(txn => txn.payment_id === error.metadata.order_id)
        if (transaction) {
            transaction.status = 'failed'
            await wallet.save()
            return res.status(400).json({ message: 'Payment failed ,please try again' })
        }
    }
    const generateSignature = crypto.createHmac('sha256', process.env.RAZORPAY_SECRET).update(razorpay_order_id + '|' + razorpay_payment_id).digest('hex')
    if (razorpay_signature === generateSignature) {
        try {
            const wallet = await Wallet.findOne({ 'transactions.payment_id': razorpay_order_id })
            if (!wallet) return res.status(400).json({ message: 'Bad Request' })
            const transaction = wallet.transactions.find(txn => txn.payment_id === razorpay_order_id)
            if (transaction) {
                transaction.status = 'success'
                wallet.balance += Number(transaction.amount)
                await wallet.save()
            } else {
                return res.status(400).json({ message: 'Bad Request' })
            }
            return res.status(200).json({ message: 'Wallet transaction sucessfull' })
        } catch (error) {
            return res.status(400).json({ message: 'Failed to verify paymen' })
        }
    }
}

export {
    verifyWalletPayment
}