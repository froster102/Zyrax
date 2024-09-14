import { z } from 'zod'
const loginSchema = z.object({
    email: z.string().trim().email('Enter a valid email'),
    password: z.string().min(1, 'Required')
})

export { loginSchema }