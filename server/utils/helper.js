function calculateDiscount(originalPrice, offerPercentage) {
    const discountAmount = parseInt((offerPercentage / 100) * originalPrice)
    return originalPrice - discountAmount
}


export {
    calculateDiscount
}