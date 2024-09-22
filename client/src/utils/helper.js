import { format, parseISO } from 'date-fns'

function calculateDiscount(originalPrice, offerPercentage) {
    const discountAmount = parseInt((offerPercentage / 100) * originalPrice)
    return Number(originalPrice - discountAmount)
}

function formatISODate(isoTime) {
    const formattedValue = format(parseISO(isoTime), 'dd MMM, yyy hh:mm a')
    return formattedValue
}

export {
    calculateDiscount,
    formatISODate
}