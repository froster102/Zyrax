import { z } from 'zod'

function validateCardNumber(cardNumber) {
    const num = cardNumber.replace(/\D/g, '')
    let sum = 0
    let shouldDouble = false
    for (let i = num.length - 1; i >= 0; i--) {
        let digit = parseInt(num.charAt(i), 10)
        if (shouldDouble) {
            digit *= 2
            if (digit > 9) digit -= 9
        }
        sum += digit
        shouldDouble = !shouldDouble
    }
    return (sum % 10 === 0)
}

const cardValidationSchema = z.object({
    cardNumber: z.string().refine(cardNumber=>validateCardNumber(cardNumber),{
        message:'Invalid card number'
    }),
    month : z.string().regex(/^(0?[1-9]|1[0-2])$/,{message:'Invalid month'})
})

export default cardValidationSchema