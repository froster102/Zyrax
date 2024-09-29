import { format, parseISO } from 'date-fns'

function calculateDiscount(originalPrice, offerPercentage) {
    const discountAmount = parseInt((offerPercentage / 100) * originalPrice)
    return Number(originalPrice - discountAmount)
}

function formatISODate(isoTime) {
    const formattedValue = format(parseISO(isoTime), 'dd MMM, yyy hh:mm a')
    return formattedValue
}

function constructQueryParams(params) {
    const queryArr = []
    function addParam(key, value) {
        if (value) queryArr.push(`${key}=${encodeURIComponent(value)}`)

    }
    addParam('search', params?.search)
    addParam('period',params?.period)
    addParam('category', params?.category)
    addParam('exclude', params?.exclude)
    addParam('offerPercentage', params?.offerPercentage)
    addParam('stock', params?.stock)
    addParam('latest', params?.latest)
    addParam('page', params?.page)
    addParam('limit', params?.limit)
    addParam('gender', params?.gender)
    addParam('sort', params?.sort)
    addParam('minPrice', params?.minPrice)
    addParam('maxPrice', params?.maxPrice)

    return queryArr.length ? `${queryArr.join('&')}` : ''
}

export {
    calculateDiscount,
    formatISODate,
    constructQueryParams
}