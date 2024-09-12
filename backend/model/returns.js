import mongoose from "mongoose";
import { Order } from "./order";
import { Product } from "./product";

const returnSchema = new mongoose.Schema({
    orderId: {
        type: mongoose.SchemaTypes.ObjectId,
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
    remark : {
        type : String,
    }
})