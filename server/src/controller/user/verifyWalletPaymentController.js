import crypto from 'crypto'
import { Wallet } from '../../model/wallet.js'

const verifyWalletPayment = async (req, res) => {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body
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
            return res.redirect('http://localhost:5173/account/wallet')
        } catch (error) {

        }
    }
}

export {
    verifyWalletPayment
}