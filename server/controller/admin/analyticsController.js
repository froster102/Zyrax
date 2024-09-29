import { Order } from "../../model/order.js"
import { Product } from "../../model/product.js"
import { User } from "../../model/user.js"
import { getLastDay, getLastWeek, getLastMonth, getLastYear, constructGraphData } from "../../utils/helper.js"

const getOverviewData = async (req, res) => {
    const matchQuery = {}
    const { period, limit = 0, startDate = '', endDate = '' } = req.query
    const dateRange = {}

    if (period) {
        switch (period) {
            case 'lastDay': {
                dateRange = getLastDay()
                break
            }
            case 'lastWeek': {
                dateRange = getLastWeek()
                break
            }
            case 'lastMonth': {
                dateRange = getLastMonth()
                break
            }
            case 'lastYear': {
                dateRange = getLastYear()
            }
            default:
                dateRange = {}
        }
    } else if (startDate && endDate) {
        dateRange = { start: new Date(startDate), end: new Date(endDate) }
    }

    try {
        const productsResult = await Product.aggregate([
            {
                $match: {
                    ...(dateRange.start && dateRange.end ? { createdAt: { $gte: dateRange.start, $lte: dateRange.end } } : {})
                }
            },
            {
                $count: 'totalProducts'
            }
        ])
        const customersResult = await User.aggregate([
            {
                $match: {
                    ...(dateRange.start && dateRange.end ? { createdAt: { $gte: dateRange.start, $lte: dateRange.end } } : {})
                }
            },
            {
                $count: 'totalCustomers'
            }
        ])
        const ordersResult = await Order.aggregate([
            {
                $match: {
                    status: { $in: ['confirmed', 'shipped', 'delivered'] },
                    ...(dateRange.start && dateRange.end ? { createdAt: { $gte: dateRange.start, $lte: dateRange.end } } : {})
                }
            },
            {
                $unwind: '$products'
            },
            {
                $match: {
                    $or: [
                        { 'products.status': 'confirmed' },
                        { 'products.status': 'delivered' },
                        { 'products.status': 'shipped' }
                    ]
                }
            },
            {
                $group: {
                    _id: null,
                    totalRevenue: { $sum: '$totalAmount' },
                    totalProductsSold: { $sum: '$products.quantity' },
                    totalOfferAmount: { $sum: '$products.appliedOfferAmount' },
                    totalCouponAmount: { $sum: '$appliedCouponAmount' },
                    orders: { $push: '$$ROOT' }
                }
            },
        ])
        const { totalCustomers } = customersResult[0] || 0
        const { totalProducts } = productsResult[0] || 0
        const {
            totalProductsSold,
            totalRevenue,
            orders,
            totalOfferAmount,
            totalCouponAmount
        } = ordersResult[0] || 0
        return res.status(200).json({
            totalProducts,
            totalCustomers,
            totalRevenue,
            totalProductsSold,
            totalOfferAmount,
            totalCouponAmount,
            orders
        })

    } catch (error) {
        console.log(error)
        return res.status(500).json({ message: 'Failed to get overview data' })
    }
}

const getAnalyticsChartData = async (req, res) => {
    const { period = 'month' } = req.query

    try {
        let aggregationPipeline = []
        if (period) {
            switch (period) {
                case 'month': {
                    aggregationPipeline = [
                        {
                            $unwind: '$products'
                        },
                        {
                            $match: {
                                'products.status': { $in: ['confirmed', 'shipped', 'delivered'] }
                            }
                        },
                        {
                            $group: {
                                _id: { $month: '$createdAt' },
                                month: { $first: { $dateToString: { format: '%B', date: '$createdAt' } } },
                                revenue: { $sum: '$products.orderPrice' },
                                totalDiscount: { $sum: '$appliedCouponAmount' }
                            }
                        },
                        {
                            $project: {
                                _id: 0,
                                month: 1,
                                revenue: { $subtract: ['$revenue', '$totalDiscount'] },
                            }
                        },
                        {
                            $sort: { _id: 1 }
                        }
                    ]
                    break
                }
                case 'week': {
                    const startOfWeek = new Date()
                    startOfWeek.setDate(startOfWeek.getDate() - (startOfWeek.getDay() + 6) % 7)
                    const endOfWeek = new Date()
                    endOfWeek.setDate(endOfWeek.getDate() + (6 - startOfWeek.getDay()))
                    aggregationPipeline = [
                        {
                            $unwind: '$products'
                        },
                        {
                            $match: {
                                'products.status': { $in: ['confirmed', 'shipped', 'delivered'] }
                            }
                        },
                        {
                            $match: {
                                createdAt: { $gte: startOfWeek, $lt: endOfWeek }
                            }
                        },
                        {
                            $group: {
                                _id: { $dayOfWeek: '$createdAt' },
                                day: { $first: { $dateToString: { format: '%w', date: '$createdAt' } } },
                                revenue: { $sum: '$totalAmount' }
                            }
                        },
                        {
                            $project: {
                                _id: 0,
                                day: 1,
                                revenue: 1
                            }
                        },
                        {
                            $sort: { _id: 1 }
                        }
                    ]
                    break
                }
            }
        }
        const data = await Order.aggregate(aggregationPipeline)
        const chartData = constructGraphData(period, data)
        return res.status(200).json({ chartData })
    } catch (error) {
        console.log(error)
    }
}

export {
    getOverviewData,
    getAnalyticsChartData
}