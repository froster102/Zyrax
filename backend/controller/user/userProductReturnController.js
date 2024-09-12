
const returnOrder = async (req, res) => {
    const { reason, additionalRemarks } = req.body
    const validReasons = [
        'Product have been damaged',
        'Changed my mind',
        'Order placed by mistake',
        'Doesnt liked the fit'
    ]
}