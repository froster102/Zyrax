function calculateDiscount(originalPrice, offerPercentage) {
    const discountAmount = parseInt((offerPercentage / 100) * originalPrice)
    return originalPrice - discountAmount
}

const getLastDay = () => {
    const end = new Date();
    const start = new Date();
    start.setDate(end.getDate() - 1);
    return { start, end };
};

const getLastWeek = () => {
    const end = new Date();
    const start = new Date();
    start.setDate(end.getDate() - 7);
    return { start, end };
};

const getLastMonth = () => {
    const end = new Date();
    const start = new Date();
    start.setMonth(end.getMonth() - 1);
    return { start, end };
};

const getLastYear = () => {
    const end = new Date();
    const start = new Date();
    start.setFullYear(end.getFullYear() - 1);
    return { start, end };
};


function constructGraphData(dataType, data) {
    const months = [
        'January', 'February', 'March', 'April', 'May', 'June',
        'July', 'August', 'September', 'October', 'November', 'December'
    ]

    const weeks = [
        'Monday', 'Tuesday', 'Wednesday', 'Thrusday', 'Friday', 'Saturday', 'Sunday'
    ]

    let graphData = []

    switch (dataType) {
        case 'month': {
            graphData = months.map(month => ({ month, revenue: 0 }))
            data.forEach(item => {
                const monthIndex = months.indexOf(item.month)
                if (monthIndex !== -1) {
                    graphData[monthIndex].revenue = item.revenue
                }
            })
            return graphData
        }
        case 'week': {
            const dayMapping = {
                '1': 'Sunday',
                '2': 'Monday',
                '3': 'Tuesday',
                '4': 'Wednesday',
                '5': 'Thursday',
                '6': 'Friday',
                '7': 'Saturday'
            }
            graphData = weeks.map(week => ({ week, revenue: 0 }))
            data.forEach(item => {
                const dayname = dayMapping[item.day]
                const dayIndex = weeks.indexOf(dayname)
                if (dayIndex !== -1) {
                    graphData[dayIndex].revenue = item.revenue
                }
            })
            return graphData
        }
    }
}

export {
    calculateDiscount,
    constructGraphData,
    getLastDay,
    getLastWeek,
    getLastMonth,
    getLastYear
}