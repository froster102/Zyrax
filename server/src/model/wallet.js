import mongoose from "mongoose";
import { User } from "./user.js";

const TransactionSchema = new mongoose.Schema({
    txnid: { type: String },
    payment_id: { type: String },
    amount: {
        type: Number,
        required: [true, 'Transaction amount is required'],
        min: [1, 'Minimum transaction amount should be 1 or greater']
    },
    type: {
        type: String,
        required: [true, 'Transaction type is required'],
        enum: {
            values: ['credit', 'debit'],
            message: 'Transaction type must be credit or debit'
        }
    },
    date: {
        type: mongoose.SchemaTypes.Date,
        default: Date.now()
    },
    status: {
        type: String,
        enum: {
            values: ['success', 'pending', 'failed', 'initiated'],
            message: 'Transaction status not valid'
        }
    }
}, { timestamps: true, _id: false })

const WalletSchema = new mongoose.Schema({
    user_id: {
        type: mongoose.SchemaTypes.ObjectId,
        required: [true, 'User id is required'],
        validate: {
            validator: async function (v) {
                const user = await User.findById(v)
                return !!user
            },
            message: 'User ID not found'
        }
    },
    balance: {
        type: Number,
        validate: {
            validator: (v) => v >= 0,
            message: 'Wallet balance cannot be negative'
        }
    },
    transactions: [TransactionSchema]
}, { timestamps: true })

const Wallet = mongoose.model('Wallet', WalletSchema)

export {
    Wallet
}