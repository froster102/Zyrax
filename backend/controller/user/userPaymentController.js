const verifyPayment = (req, res) => {
    const { paymentMethod, cartItems } = req.body
    const validUserPaymentMethods = ['paypal', 'upi/card', 'cash on delivery']
    if (!validUserPaymentMethods.includes(paymentMethod)) return res.status(400).json({ message: 'Payment method not valid' })
    
}