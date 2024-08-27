import { z } from 'zod'
const signinSchema = z.object({
    email: z.string().trim().email('Enter a valid email'),
    password: z.string().min(1, 'Password is required')
})

export default signinSchema