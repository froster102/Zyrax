import mongoose from "mongoose";
import { Offer } from "./offer.js";

const CategorySchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Category name is required'],
        validate: {
            validator: v => /^[A-Za-z]+$/.test(v),
            message: 'Category name must only contain alphabets'
        },
        unique: true
    },
    description: {
        type: String,
        required: [true, 'Category description is required']
    },
    offer: {
        type: mongoose.SchemaTypes.ObjectId,
        validate: {
            validator: async (v) => {
                const offer = await Offer.findById(v)
                return !!offer
            },
            message: 'Offer not found'
        }
    },
    parent: { type: mongoose.SchemaTypes.ObjectId, ref: ('Category'), default: null },
    children: { type: [mongoose.SchemaTypes.ObjectId], ref: ('Category'), default: [] },
    imageUrl: { type: String },
    status: { type: String, enum: ['active', 'blocked'] }
})

const Category = mongoose.model('Category', CategorySchema)

export {
    Category
}