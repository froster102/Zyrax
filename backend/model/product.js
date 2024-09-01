import mongoose from "mongoose";
import { Category } from "./category.js";

const ProductSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Product name is required'],
        trim: true,
        minlength: [5, 'Product name must contain at least 5 characters'],
        validate: {
            validator: v => /^[A-Za-z]+$/.test(v),
            message: 'Product name must only contain alphabets'
        },
        unique: true
    },
    description: {
        type: String,
        required: [true, 'Product description is required']
    },
    sizes: {
        type: [String],
        enum: {
            values: ['XS', 'S', 'M', 'L', 'XL', 'XXL', 'XXXL'],
            message: 'Size not valid'
        },
        default: []
    },
    gender: {
        type: String,
        enum: {
            values: ['men', 'women', 'unisex'],
            message: 'Gender not valid'
        }
    },
    imageUrls: {
        type: [String],
        required: [true, 'Mininum 4 image urls are required']
    },
    price: {
        type: Number,
        required: [true, 'Price is required'],
        validate: {
            validator: (v) => v >= 100,
            message: 'Price must be at least greater than 100'
        }
    },
    discount: { type: String },
    stockQty: {
        type: Number,
        required: [true, 'Stock is required'],
        validate: {
            validator: v => v >= 5,
            message: 'Stock must be at least 5 in quantity'
        }
    },
    category: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Category',
        required: [true, 'Catergory id is required'],
        validate: {
            validator: async (v) => {
                const category = await Category.find({ _id: v })
                return !!category
            },
            message: 'Category id not found'
        }
    },
    status: { type: String, enum: ['active', 'blocked'] }
}, { timestamps: true })

const Product = mongoose.model('Product', ProductSchema)

export {
    Product
}