function calculateDiscount(originalPrice, offerPercentage) {
    const discountAmount = parseInt((offerPercentage / 100) * originalPrice)
    return Number(originalPrice - discountAmount)
}


export {
    calculateDiscount
}