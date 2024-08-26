import { z } from "zod"

const imageSchema = z.object({
    name: z.string(),
    data: z.string()
})

const imageUrlSchema = z.string().url('Invalid url')

const imagesSchema = z.array(
    z.union([
        imageSchema,
        imageUrlSchema
    ])
).length(4, { message: 'At least 4 images should be uploaded' })

const addProductSchema = z.object({
    name: z.string().trim().min(5, 'Required'),
    description: z.string().min(1, 'Required').transform(val => val.split(' ')).refine(words => words.length >= 10, { message: 'Description should have a minimum of 10 words' })
        .transform(val => val.join(' ')),
    sizes: z.array(z.string()).min(1, 'Minimun one size should be selected'),
    gender: z.enum(['men', 'women'], { message: 'Select a valid gender' }),
    price: z.string().transform(val => parseInt(val)).pipe(z.number().min(100, 'Price must number at least 100 or greater')),
    stock: z.string().transform(val => parseInt(val)).pipe(z.number().min(10, 'Stock must be at least 10 or greater')),
    discount: z.string().optional(),
    category: z.string().min(1, 'Please select one category'),
    images: imagesSchema
})

export default addProductSchema