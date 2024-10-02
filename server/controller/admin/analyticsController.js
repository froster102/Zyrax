import { Order } from "../../model/order.js"
import { Product } from "../../model/product.js"
import { User } from "../../model/user.js"
import { getLastDay, getLastWeek, getLastMonth, getLastYear, constructGraphData, formatISODate } from "../../utils/helper.js"
import { jsPDF } from 'jspdf'

const getOverviewData = async (req, res) => {
    const { period, limit = 0, startDate = '', endDate = '' } = req.query

    let dateRange = {}

    if (period) {
        switch (period) {
            case 'lastDay': dateRange = getLastDay(); break
            case 'lastWeek': dateRange = getLastWeek(); break
            case 'lastMonth': dateRange = getLastMonth(); break
            case 'lastYear': dateRange = getLastYear()
            default: dateRange = {}
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
                $sort: { soldCount: -1 }
            },
            {
                $group: {
                    _id: null,
                    totalProducts: { $sum: 1 },
                    products: { $push: '$$ROOT' }
                }
            },
            {
                $project: {
                    totalProducts: 1,
                    products: { $slice: ['$products', isNaN(Number(limit)) ? 0 : Number(limit)] }
                }
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
        const { totalProducts, products } = productsResult[0] || 0
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
            orders,
            products
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
                    startOfWeek.setHours(0, 0, 0, 0)
                    const endOfWeek = new Date()
                    endOfWeek.setDate(startOfWeek.getDate() + 7)
                    endOfWeek.setHours(0, 0, 0, 0)
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

const downloadAnalyticsReport = async (req, res) => {
    const { period, format, startDate, endDate } = req.query
    let dateRange = {}
    if (period) {
        switch (period) {
            case 'lastDay': dateRange = getLastDay(); break
            case 'lastWeek': dateRange = getLastWeek(); break
            case 'lastMonth': dateRange = getLastMonth(); break
            case 'lastYear': dateRange = getLastYear()
            default: dateRange = {}
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
        if (format === 'pdf') {
            const pdf = new jsPDF({
                orientation: 'landscape',
                unit: 'mm',
                format: 'a4',
                putOnlyUsedFonts: true,
                floatPrecision: 16
            })

            pdf.setFontSize(25)
            pdf.text('Sales Report', 10, 10)

            pdf.setFontSize(14)
            pdf.text(`Total Products: ${totalProducts || 0}`, 10, 30)
            pdf.text(`Total Customers: ${totalCustomers || 0}`, 10, 40)
            pdf.text(`Total Revenue: ${totalRevenue || 0}`, 10, 50)
            pdf.text(`Total Products Sold: ${totalProductsSold || 0}`, 10, 60)
            pdf.text(`Total Offer Amount: ${totalOfferAmount || 0}`, 10, 70)
            pdf.text(`Total Coupon Amount: ${totalCouponAmount || 0}`, 10, 80)

            pdf.text('Orders', 10, 100)

            const startY = 110
            const rowHeight = 10
            const pageHeight = pdf.internal.pageSize.height

            pdf.setFontSize(12);
            const headers = ['Order ID', 'Total Amount', 'Payment Status', 'Payment Method', 'Date'];
            const headerWidths = [40, 40, 40, 40, 40];

            headers.forEach((header, index) => {
                pdf.text(header, 10 + index * headerWidths[index], startY);
            });

            let currentY = startY + rowHeight

            orders.forEach((order, index) => {

                if (currentY + rowHeight > pageHeight) {
                    pdf.addPage()
                    currentY = 20
                    headers.forEach((header, index) => {
                        pdf.text(header, 10 + index * headerWidths[index], currentY)
                    })
                    currentY += rowHeight
                }

                pdf.text(order.orderId, 10, currentY);
                pdf.text(`${order.totalAmount}`, 10 + headerWidths[0], currentY);
                pdf.text(order.payment.status, 10 + headerWidths[0] + headerWidths[1], currentY);
                pdf.text(order.payment.method, 10 + headerWidths[0] + headerWidths[1] + headerWidths[2], currentY);
                pdf.text(formatISODate(order.createdAt), 10 + headerWidths[0] + headerWidths[1] + headerWidths[2] + headerWidths[3], currentY);

                currentY += rowHeight
            });
            const pdfOutput = pdf.output()
            res.set({
                'Content-Type': 'application/pdf',
                'Content-Disposition': 'attachment; filename="report.pdf"',
                'Content-Length': pdfOutput.byteLength,
            })
            return res.send(Buffer.from(pdfOutput));
        }
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
    }
}

export {
    getOverviewData,
    getAnalyticsChartData,
    downloadAnalyticsReport
}