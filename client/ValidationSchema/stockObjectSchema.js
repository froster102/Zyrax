import { z } from "zod";

const stockObjectSchema = z.object({
    XS: z.string().regex(/^\d*$/, 'XS should be a positive number or empty').optional(),
    S: z.string().regex(/^\d*$/, 'S should be a positive number or empty').optional(),
    M: z.string().regex(/^\d*$/, 'M should be a positive number or empty').optional(),
    L: z.string().regex(/^\d*$/, 'L should be a positive number or empty').optional(),
    XL: z.string().regex(/^\d*$/, 'XL should be a positive number or empty').optional(),
    XXL: z.string().regex(/^\d*$/, 'XXL should be a positive number or empty').optional(),
    XXXL: z.string().regex(/^\d*$/, 'XXXL should be a positive number or empty').optional()
});

export default stockObjectSchema