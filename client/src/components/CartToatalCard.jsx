import PropTypes from 'prop-types'
import { RotatingLines } from 'react-loader-spinner'

function CartToatalCard({ cartTotal, navigateToSelectAddress, proceedToCheckout, checkoutLoading }) {
    return (
        <>
            <div className="md:mt-0 mt-4 text-nowrap">
                <p className='text-lg font-semibold'>Order Summary</p>
                <div className="w-full h-fit border border-[#CFCBCB] rounded-lg py-4 bg-white font-medium">
                    <p className="flex justify-between border-b border-[#CFCBCB]  px-4 pb-2"><span>Cart Total<span>(Incl. of all taxes)</span></span><span className="text-right pl-2">{`₹ ${cartTotal}`}</span></p>
                    {/* <p className="flex justify-between border-b border-[#CFCBCB] py-2 px-4">Discout <span className="text-right">$20</span></p> */}
                    <p className="flex justify-between border-b border-[#CFCBCB] py-2 px-4">Shipping Charges <span className="text-right">$0</span></p>
                    <p className="text-lg font-semibold flex justify-between px-4">Total Amount <span className="font-semibold ">{`₹ ${cartTotal}`}</span></p>
                    <div className='px-4'>
                        {proceedToCheckout ? <button onClick={() => proceedToCheckout()} className="bg-black w-full py-2 text-white mt-2 rounded-lg font-medium flex items-center justify-center">{checkoutLoading ? <RotatingLines strokeColor='white' width='20' /> : 'Proceed to Checkout'}</button>
                            : <button onClick={() => navigateToSelectAddress()} className="bg-black w-full py-2 text-white mt-2 rounded-lg font-medium">Proceed to order</button>}
                    </div>
                </div>
            </div>
        </>
    )
}

CartToatalCard.propTypes = {
    cartTotal: PropTypes.number.isRequired,
    navigateToSelectAddress: PropTypes.func,
    proceedToCheckout: PropTypes.func,
    checkoutLoading: PropTypes.bool
}

export default CartToatalCard