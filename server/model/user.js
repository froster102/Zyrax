import mongoose from "mongoose";

const UserSchema = new mongoose.Schema({
    firstName: {
        type: String,
        trim: true,
        required: [true, 'First name is required'],
        minlength: [3, 'First name must contain at least 3 characters'],
        validate: {
            validator: v => /^[A-Za-z]+$/.test(v),
            message: 'First name must only contain alphabets'
        }
    },
    lastName: {
        type: String,
        trim: true,
        required: [true, 'Last name is required'],
        minlength: [3, 'Last name must contain at least 3 characters'],
        validate: {
            validator: v => /^[A-Za-z]+$/.test(v),
            message: 'Last name must only contain alphabets'
        }
    },
    email: {
        type: String,
        trim: true,
        required: [true, 'Email is required'],
        unique: true,
        lowercase: true,
        validate: {
            validator: v => /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/g.test(v),
            message: 'Enter a valid email'
        }
    },
    phoneNumber: {
        type: String,
        trim: true,
        validate: {
            validator: (v) => /^(\+91[-\s]?)?[6789]\d{9}$/.test(v),
            message: 'Enter a valid phone number'
        }
    },
    gender: { type: String, enum: ['male', 'female'] },
    googleId: { type: String },
    authProvider: { type: String, enum: ['google'] },
    profilePic: { type: String },
    password: {
        type: String,
    },
    status: { type: String, enum: ['active', 'blocked', 'deleted'] },
    addresses: { type: [mongoose.SchemaTypes.ObjectId], ref: ('Address'), default: [] },
    verification_status: { type: Boolean },
    verification_started: {
        type: Date,
        default: Date.now(),
        index: {
            expires: '10m'
        }
    },
    lastLogin: {
        type: Date,
        default: Date.now()
    },
    orderCount: {
        type: Number,
        default: 0
    },
    totalSpent: {
        type: Number,
        default: 0
    },
    createdAt: {
        type: Date,
        default: Date.now()
    }


}, { timestamps: true })

const User = mongoose.model('User', UserSchema)

export {
    User
}