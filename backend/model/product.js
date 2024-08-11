import mongoose from "mongoose";

const ProductSchema = new mongoose.Schema({
    name: { type: String, required: true, unique: true },
    description: { type: String, required: true },
    sizes: { type: [String], default: [] },
    gender: { type: String, enum: ['men', 'women', 'unisex'] },
    imageUrls: { type: [String], required: true },
    price: { type: Number, required: true },
    discount: { type: String },
    stockQty: { type: Number, required: true },
    category: { type: mongoose.Schema.Types.ObjectId, ref: 'Category', required: true },
    status: { type: String, enum: ['active', 'blocked'] }
}, { timestamps: true })

const Product = mongoose.model('Product', ProductSchema)

export {
    Product
}