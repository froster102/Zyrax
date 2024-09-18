import PropTypes from 'prop-types'
import { useForm } from 'react-hook-form'

function AddCouponModal({ handleAddCoupon }) {
    const { register, handleSubmit, formState: { errors } } = useForm()
    return (
        <div>
            <form action="">
                <label htmlFor="">Coupon code</label>
                <input className='p-2 rounded-md' type="text" placeholder='Enter the coupon code' />
            </form>
        </div>
    )
}

AddCouponModal.propTypes = {
    handleAddCoupon: PropTypes.func.isRequired
}

export default AddCouponModal