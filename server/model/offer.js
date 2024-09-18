import mongoose from "mongoose";

const OfferSchema = new mongoose.Schema({
    name: {
        type: String,
        trim: true,
        required: [true, 'Offer name is required'],
        minlength: [5, 'Offer name should be at least 5'],
        validate: {
            validator: /^[A-Za-z\s]+$/,
            message: 'Offer name must only contain alphabet and spaces'
        },
        set: value => value.toLowerCase()
    },
    discountPercentage: {
        type: Number,
        min: [2, 'Discount percentage should be at least 2 percentage'],
        max: [100, 'Maximum discount percentage should be 100 percentage']
    },
    startDate: {
        type: Date,
        // required: [true, 'Start date is required'],
        validate: {
            validator: (v) => {
                return v >= new Date()
            },
            message: 'Start date should not be in the past'
        }
    },
    endDate: {
        type: Date,
        required: [true, 'End date is required']
    },
    offerType: {
        type: String,
        enum: {
            values : ['product', 'category'],
            message : 'Offer type should be either product or catergory'
        },
        required: [true, 'Offer type is required']
    }
})

const Offer = mongoose.model('Offer', OfferSchema)

export {
    Offer
}