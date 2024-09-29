import { z } from "zod";

const addCouponSchema = z.object({
    code: z.string().min(1, 'Coupon code is required'),
    discount: z.string().min(1, 'Discount percentage is required')
        .refine((value) => {
            const numberValue = parseInt(value);
            return !isNaN(numberValue) && numberValue >= 1 && numberValue <= 100;
        }, {
            message: 'Discount must be between 1 and 100',
        }),
    minPurchaseAmount: z.string().min(1, 'Minimum purchase amount is required')
        .refine((value) => {
            const numberValue = parseInt(value);
            return !isNaN(numberValue) && numberValue >= 200;
        }, {
            message: 'Minimum purchase amount should be 500 or greater'
        }),
    expiration_date: z.string().min(1, 'Expiration date is required')
        .regex(/^(\d{4})-(\d{2})-(\d{2})$/, 'Invalid expiration date (format: DD/MM/YYYY)')
        .refine((value) => {
            const date = new Date(value).getTime()
            const today = new Date().getTime()
            return date > today
        }, {
            message: 'Expiration should not be in the past'
        }),
    expiration_time: z.string().min(1, 'Expiration time is required')
        .regex(/^(2[0-3]|[01]?[0-9]):([0-5][0-9])$/, 'Expiration time not valid'),

    maxDiscountAmount: z.string().trim().min(1, 'Maximum discount amount is required').refine(v => Number(v) < 1000, {
        message: 'Maximum discount should be 1000'
    }),
});

export default addCouponSchema