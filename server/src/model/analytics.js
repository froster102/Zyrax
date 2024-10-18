import mongoose from "mongoose";

const analyticsSchema = new mongoose.Schema({
    userId: {
        type: mongoose.SchemaTypes.ObjectId,
        ref: 'User',
        required: false
    },
    eventType: {
        type: String,
        required: [true, 'Event type is required'],
        enum: {
            values: ['login', 'visit'],
            message: 'Enter a valid event type'
        }
    }
}, { timestamps: true })

const AnalyticsEvent = mongoose.model('AnalyticsEvent',analyticsSchema)

export {
    AnalyticsEvent
}