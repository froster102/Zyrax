import { z } from "zod"

const addCategoryschema = z.object({
    name: z.string().trim().min(1, 'Required').regex(/^[A-Za-z]+$/,'Name must contain only alphabets').transform(val => val.toLocaleLowerCase()),
    description: z.string().trim().trim().min(1, 'Required'),
    categoryType: z.enum(['parent', 'child'], { message: 'Select a category type' }),
    parentCategory: z.string().optional()
}).refine((data => {
    if (data.categoryType === 'child' && !data.parentCategory) return false
    return true
}), {
    message: 'Parent category is required for child category',
    path: ['parentCategory']
})

export default addCategoryschema