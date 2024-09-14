import mongoose from "mongoose";
import { Product } from "./product.js";

const CartItemSchema = {
    productId: {
        type: mongoose.SchemaTypes.ObjectId,
        ref: 'Product',
        required: [true, 'Product id is required'],
        validate: {
            validator: async (v) => {
                const product = await Product.findById(v)
                return !!product
            },
            message: `Product with ID not found`
        }
    },
    selectedSize: {
        type: String,
        required: [true, 'Size is required for the selected product'],
        enum: {
            values: ['XS', 'S', 'M', 'L', 'XL', 'XXL', 'XXXL'],
            message: 'Size not valid'
        }
    },
    selectedQty: {
        type: Number,
        // required: [true, 'Quantity is required for the selected product'],
        default: 1,
        validate: {
            validator: v => v > 0 && v <= 5,
            message: "Quantity must be a number greater than 0 and less than or equal to 4"
        }
    }
}

const CartSchema = new mongoose.Schema({
    user_id: {
        type: mongoose.SchemaTypes.ObjectId,
        required: [true, 'user_id is required'],
    },
    items: [CartItemSchema],
})

const Cart = mongoose.model('Cart', CartSchema)

export {
    Cart
}