import { z } from 'zod'

const addAddressSchema = z.object({
    firstName: z.string().min(1, 'Required').min(3, 'Must be atleast 3 character long').regex(/^[A-Za-z]+$/, 'Must contain only alphabets'),
    lastName: z.string().min(1, 'Required').regex(/^[A-Za-z]+$/, 'Must contain only alphabets'),
    buildingName: z.string().min(1, 'Required').min(4, 'Must be atleast 4 character long').regex(/^[A-Za-z]+$/, 'Must contain only alphabets'),
    street: z.string().min(1, 'Required').min(4, 'Must be atleast 4 character long').regex(/^[A-Za-z]+$/, 'Must contain only alphabets'),
    pincode: z.string().min(1, 'Required').regex(/^[1-9][0-9]{5}$/, 'Enter a valid pincode'),
    city: z.string().min(1, 'Required').min(3, 'Must be atleast 3 character long').regex(/^[A-Za-z]+$/, 'Must contain only alphabets'),
    state: z.string().min(1, 'Required'),
    phoneNumber: z.string().min(1, 'Required').regex(/^(\+91[-\s]?)?[6789]\d{9}$/, 'Enter a valid phone number')
})

export {
    addAddressSchema
}