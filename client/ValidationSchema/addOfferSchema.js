import { z } from "zod";

const offerSchema = z.object({
    name: z.string()
        .min(5, { message: 'Offer name should be at least 5 characters' })
        .regex(/^[A-Za-z\s]+$/, { message: 'Offer name must only contain alphabet and spaces' }),
    discountPercentage: z.number()
        .min(2, { message: 'Minimum discount percentage is 2' })
        .max(100, { message: 'Maximum discount percentage is 100' }),
    endDate: z.date().refine(date => date >= new Date(), {
        message: 'End date must not be in the past',
    }),
    offerType: z.enum(['product', 'category']),
});

export default offerSchema