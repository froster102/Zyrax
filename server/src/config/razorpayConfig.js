import Razorpay from 'razorpay'
import {config} from 'dotenv'
config()

const razorpay = new Razorpay({
    key_id: process.env.RAZORPAY_KEY,
    key_secret: process.env.RAZORPAY_SECRET
})

export default razorpay