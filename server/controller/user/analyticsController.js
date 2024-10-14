import { AnalyticsEvent } from "../../model/analytics.js"

const trackVisits = async (req, res) => {
    const { eventType } = req.query
    try {
        const validEvents = ['visit']
        if (!validEvents.includes(eventType)) return res.status(400).json({ message: 'Event not valid' })
        await AnalyticsEvent.create({
            eventType: 'visit'
        })
        return res.status(200).send()
    } catch (error) {
        return res.status(500).json({ message: 'Error occured' })
    }
}

export {
    trackVisits
}