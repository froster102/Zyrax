import mongoose from "mongoose";
import { Order } from "./order.js";
import { Product } from "./product.js";
import { User } from "./user.js";

const ReturnSchema = new mongoose.Schema({
    user_id: {
        type: mongoose.SchemaTypes.ObjectId,
        ref: 'User',
        validate: {
            validator: async function (v) {
                const user = await User.findById(v)
                return !!user
            },
            message: 'User id not found'
        }
    },
    orderId: {
        type: mongoose.SchemaTypes.ObjectId,
        ref: 'Order',
        required: [true, 'Order ID is required to refund'],
        validate: {
            validator: async function (v) {
                const order = await Order.findById(v)
                return !!order
            },
            message: 'Order with ID not found'
        }
    },
    productId: {
        type: mongoose.SchemaTypes.ObjectId,
        ref:'Product',
        required: [true, 'Product ID is required to refund'],
        validate: {
            validator: async function (v) {
                const product = await Product.findById(v)
                return !!product
            },
            message: 'Product with ID not found'
        }
    },
    reason: {
        type: String,
        required: [true, 'Reason is required to refund']
    },
    remark: {
        type: String,
    },
    status: {
        type: String,
        enum: {
            values: ['requested', 'approved'],
            message: 'Invalid status, status must be either "request" or "approved"'
        }
    },
}, { timestamps: true })

const Return = mongoose.model('Return', ReturnSchema)

export {
    Return
}