import mongoose from "mongoose";
import { Product } from './product.js'
import { User } from "./user.js";
import { Address } from './address.js'

const OrderSchema = new mongoose.Schema({
    userId: {
        type: mongoose.SchemaTypes.ObjectId,
        ref: 'User',
        required: [true, 'User id is required'],
        validate: {
            validator: async function (v) {
                const user = await User.findById(v)
                return !!user
            },
            message: 'User id not found'
        }
    },
    // status: {
    //     type: String,
    //     enum: {
    //         values: ['pending', 'processing', 'shipped', 'delivered', 'cancelled'],
    //         message: 'Status not valid',
    //         default: 'pending'
    //     },
    //     required: [true, 'Order status is required']
    // },
    totalAmount: {
        type: Number,
        validate: {
            validator: (v) => v > 100,
            message: 'Total amount must be a positive number above 100'
        }
    },
    shipping: {
        addressId: {
            type: mongoose.SchemaTypes.ObjectId,
            required: [true, 'Shipping address id is required'],
            validate: {
                validator: async (v) => {
                    const address = await Address.findOne({ _id: v })
                    return !!address
                },
                message: "Address not found"
            }
        }
    },
    payment: {
        method: {
            type: String,
            required: [true, 'Payment method is required'],
            enum: {
                values: [
                    'cash on delivery',
                    'card',
                    'wallet',
                    'netbanking',
                    'upi',
                    'paypal',
                ],
                message: 'Enter a valid payment method'
            }
        },
        status: {
            type: String,
            required: [true, 'Payment status is required'],
            enum: {
                values: ['success', 'pending', 'failed'],
                message: 'Enter a valid payment status'
            }
        },
        transactionId: {
            type: String
        }
    },
    products: [
        {
            productId: {
                type: mongoose.SchemaTypes.ObjectId,
                ref: 'Product',
                required: [true, 'Product id is required'],
                validate: {
                    validator: async function (v) {
                        const product = await Product.findById(v)
                        return !!product
                    },
                    message: 'Product id does not exists'
                }
            },
            quantity: {
                type: Number,
                required: [true, 'Product quantity is required'],
                default: 0,
                validate: {
                    validator: (v) => v > 0 && v <= 4,
                    message: 'Minimum order quantity for a product is  4 per product',
                }
            },
            size: {
                type: String,
                enum: {
                    values: ['XS', 'S', 'M', 'L', 'XL', 'XXL', 'XXXL'],
                    message: 'Size not valid'
                }
            },
            unitPrice: {
                type: Number,
                required: [true, 'Unit price is required'],
                validate: {
                    validator: (v) => v > 100,
                    message: 'Unit price must be at a positive number greater than 100'
                }
            },
            totalPrice: {
                type: Number,
                required: [true, 'Unit price is required'],
                validate: {
                    validator: (v) => v > 100,
                    message: 'Total price must be at a positive number greater than 100'
                }
            },
            discounts: {
                discountId: {
                    type: Number
                }
            },
            status: {
                type: String,
                enum: {
                    values: ['pending', 'confirmed', 'shipped', 'delivered', 'cancelled'],
                    message: 'Status not valid',
                    default: 'pending'
                },
                required: [true, 'Product order status is required']
            },
            cancelledDate: {
                type: Date,
            },
        }
    ]
}, { timestamps: true })

const Order = mongoose.model('Order', OrderSchema)

export {
    Order
}