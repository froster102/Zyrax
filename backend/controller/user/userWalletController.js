import { Wallet } from "../../model/wallet.js"
import Razorpay from 'razorpay'
import { nanoid } from 'nanoid'

const createWallet = async (req, res) => {
    try {
        const existingWallet = await Wallet.findOne({ user_id: req.userId })
        if (existingWallet) return res.status(409).json({ message: 'Wallet already exists for the requested user' })
        const wallet = await Wallet.create({
            user_id: req.userId,
            balance: 0
        })
        if (wallet) {
            return res.status(201).json({ message: 'Wallet created sucessfully' })
        }
    } catch (error) {
        console.log(error)
        return res.status(500).json({ message: 'Failed to create wallet' })
    }
}

const topUpWallet = async (req, res) => {
    const { amount } = req.body
    if (Number(amount) < 1) return res.status(400).json({ message: 'Transaction amount must be minimum 1' })
    const razorpay = new Razorpay({
        key_id: process.env.RAZORPAY_KEY,
        key_secret: process.env.RAZORPAY_SECRET
    })
    try {
        const wallet = await Wallet.findOne({ user_id: req.userId })
        if (!wallet) return res.status(404).json({ message: 'Wallet not found for the requested user' })
        const paymentOrder = await razorpay.orders.create({
            amount: amount * 100,
            currency: 'INR'
        })
        wallet.transactions.push({
            txnid: nanoid(12),
            payment_id: paymentOrder.id,
            amount,
            type: 'credit',
            status: 'pending'
        })
        await wallet.save()
        return res.status(200).json(paymentOrder)
    } catch (error) {
        console.log(error)
        return res.status(500).json({ message: 'Failed to add money to wallet' })
    }
}

const getWalletDetails = async (req, res) => {
    try {
        const wallet = await Wallet.findOne({ user_id: req.userId })
        if (!wallet) return res.status(404).json({ message: 'Wallet not found for the requested user' })
        return res.status(200).json(wallet)
    } catch (error) {
        return res.status(500).json({ message: 'Failed to get wallet details' })
    }
}

export {
    createWallet,
    topUpWallet,
    getWalletDetails
}