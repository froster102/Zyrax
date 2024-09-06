import mongoose from "mongoose";
import { Category } from "./category.js";

const stockSchema = new mongoose.Schema({
    size: {
        type: String,
        enum: ['XS', 'S', 'M', 'L', 'XL', 'XXL', 'XXXL'],
        required: [true, 'Size is required']
    },
    quantity: {
        type: Number,
        // required: [true, 'Quantity is required'],
        // min: [5, 'Minimun 5 quantity should be available for the product']
        validate: {
            validator: (v) => {
                console.log(v)
                return v > 0
            },
            message: 'Quantity must be a positive number greater than 0'
        },
        default: 0
    }
})

const ProductSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Product name is required'],
        trim: true,
        minlength: [5, 'Product name must contain at least 5 characters'],
        validate: {
            validator: v => /^[A-Za-z\s:]+$/.test(v),
            message: 'Product name must only contain alphabets'
        },
        unique: true
    },
    description: {
        type: String,
        trim: true,
        required: [true, 'Product description is required']
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
    stock: [stockSchema],
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