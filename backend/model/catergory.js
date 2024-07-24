import mongoose from "mongoose";

const CategorySchema = new mongoose.Schema({
    name: { type: String, required: true },
    description: { type: String, required: true },
    parent: { type: mongoose.SchemaTypes.ObjectId, default: null },
    children: { type: [mongoose.SchemaTypes.ObjectId] },
    imageUrl: { type: String, required: true }
})

const Catergory = mongoose.model('Catergory', CategorySchema)

export {
    Catergory
}