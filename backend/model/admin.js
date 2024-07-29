import mongoose from "mongoose"

const AdminSchema = new mongoose.Schema({
    email: { type: String },
    password: { type: String },
    lastLogin: { type: Date }
})

const Admin = mongoose.model('Admin', AdminSchema)

export { Admin }