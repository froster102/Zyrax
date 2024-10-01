import mongoose from "mongoose";
import { Product } from "./product.js";
import { Coupon } from './coupon.js'

const CartItemSchema = {
    productId: {
        type: mongoose.SchemaTypes.ObjectId,
        ref: 'Product',
        required: [true, 'Product id is required'],
        validate: {
            validator: async (v) => {
                const product = await Product.findOne({ _id: v, status: 'active' })
                return !!product
            },
            message: `Product with ID not found or product is currently blocked`
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
    appliedCoupon: {
        code: {
            type: String,
            validate: {
                validator: async function (v) {
                    const coupon = await Coupon.findOne({ code: v })
                    return !!coupon
                },
                message: 'Invalid coupon code'
            }
        },
        discount: {
            type: Number,
        },
        maxDiscountAmount: {
            type: Number
        }
    }
})

const Cart = mongoose.model('Cart', CartSchema)

export {
    Cart
}