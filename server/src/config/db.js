import mongoose from "mongoose";

const connectToDatabase = async () => {
    try {
        console.log('Connecting to database')
        await mongoose.connect(process.env.MONGO_URI)
        console.log('Successfully connect to DB')
    } catch (error) {
        console.error('Could not connect to DB', error)
        process.exit(1)
    }
}

export default connectToDatabase