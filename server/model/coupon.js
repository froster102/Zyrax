import mongoose from "mongoose";

const CouponSchema = new mongoose.Schema({
    code: {
        type: String,
        unique: [true, 'Coupon code must be unique'],
        required: [true, 'Coupon code is required'],
        set: value => value.toUpperCase()
    },
    discount: {
        type: Number,
        required: [true, 'Dicount is percentage is required'],
        min: [1, 'Discount must be at least 1%'],
        max: [100, 'Discount cannot exceed 100%']
    },
    expirationDate: {
        type: Date,
        required: [true, 'Expiration date is required']
    },
    maxDiscountAmount: {
        type: Number,
        required: [true, 'Maximum discount amount is required']
    },
    minPurchaseAmount: {
        type: Number,
        required: [true, 'Minimum purchase amount is required']
    },
    usageLimitPerUser: {
        type: Number,
        default: 1
    },
    totalUsageLimit: {
        type: Number,
        default: Infinity
    },
    status: {
        type: String,
        default: 'active',
        enum: {
            values: ['active', 'blocked'],
            message: 'Coupon is status should be either "active" or "blocked"'
        }
    },
    usageRecords: [{
        user: {
            type: mongoose.SchemaTypes.ObjectId,
            ref: 'User',
        },
        userAt: {
            type: Date,
            default: Date.now()
        }
    }]
})

const Coupon = mongoose.model('Coupon', CouponSchema)

export {
    Coupon
}