import mongoose from "mongoose";

const DicountSchema = new mongoose.Schema({
    name: { type: String },
    percentage: { type: Number },
    validFrom: { tpye, Date },
    validUpto: { type: Date },
    status: { type: String, enum: ['active', 'blocked'] }
})

const Discount = mongoose.model('Discount', DicountSchema)


export {
    Discount
}