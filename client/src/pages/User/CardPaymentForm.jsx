import PropTypes from 'prop-types'
import { useEffect, useRef } from 'react'


function CardPaymentForm({ paymentKey, txnid, productInfo, amount, email, firstName, cardNumber, cardName, cardExpMon, cardCvv, cardExp, hash, surl, furl }) {
    const formRef = useRef(null)
// console.log('dfjdk')
    // useEffect(() => {
    //     formRef.current.requestSubmit()
    // }, [])

    return (
        <form action='https://test.payu.in/_payment' method='post' ref={formRef}>
            <input type="hidden" name="key" value={paymentKey} />
            <input type="hidden" name="txnid" value={txnid} />
            <input type="hidden" name="productinfo" value={productInfo} />
            <input type="hidden" name="amount" value={amount} />
            <input type="hidden" name="email" value={email} />
            <input type="hidden" name="firstname" value="Ashish" />
            <input type="hidden" name="pg" value="CC" />
            <input type="hidden" name="bankcode" value="MAST" />
            <input type="hidden" name="ccnum" value={cardNumber} />
            <input type="hidden" name="ccname" value={cardName} />
            <input type="hidden" name="ccvv" value={cardCvv} />
            <input type="hidden" name="ccexpmon" value={cardExpMon} />
            <input type="hidden" name="ccexpyr" value={cardExp} />
            <input type="hidden" name="surl" value='http://localhost:3000/api/v1/users/verify-payment' />
            <input type="hidden" name="furl" value="http://localhost:3000/api/v1/users/verify-payment" />
            <input type="hidden" name="hash" value={hash} />
            <input type="submit" value="submit" />
            <button>sdsdsd</button>
        </form>
    )
}

CardPaymentForm.propTypes = {
    key: PropTypes.string,
    txnid: PropTypes.string,
    productInfo: PropTypes.string,
    amount: PropTypes.string,
    email: PropTypes.string,
    firstName: PropTypes.string,
    cardNumber: PropTypes.string,
    cardName: PropTypes.string,
    cardCvv: PropTypes.string,
    cardExp: PropTypes.string,
    hash: PropTypes.string
}

export default CardPaymentForm