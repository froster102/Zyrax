import { z } from "zod"

const registerSchema = z.object({
    firstName: z.string().trim().min(1, 'Required').min(3, 'Must be minimum of 3 characters'),
    lastName: z.string().trim().min(1, 'Required').min(3, 'Must be minimum of 3 characters'),
    email: z.string().trim().email('Enter a valid email').min(1, 'Required'),
    password: z.string().min(6, 'Must be minimum of 6 characters').regex(/^(?=.*[A-Za-z])(?=.*\d)(?=.*[\W_])[A-Za-z\d\W_]{6,}$/, 'Must contain a letter,number,a special character'),
    confirmPassword: z.string().min(1, 'Required')
}).refine((data) => data.password === data.confirmPassword, {
    message: 'Password do not match',
    path: ['confirmPassword']
})


export default registerSchema