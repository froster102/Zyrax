import mongoose from "mongoose";

const CategorySchema = new mongoose.Schema({
    name: { type: String, required: true, unique: true },
    description: { type: String, required: true },
    parent: { type: mongoose.SchemaTypes.ObjectId, ref: ('Category'), default: null },
    children: { type: [mongoose.SchemaTypes.ObjectId], ref: ('Category'), default: [] },
    imageUrl: { type: String },
    status: { type: String, enum: ['active', 'blocked'] }
})

const Category = mongoose.model('Category', CategorySchema)

export {
    Category
}