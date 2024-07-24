import mongoose from "mongoose"

const AdminSchema = mongoose.Schema({
    email: { type: String },
    password: { type: String }
})

const Admin = mongoose.model('Admin', AdminSchema)

export { Admin }