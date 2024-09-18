import { IoMdClose } from "react-icons/io"
import PropTypes from 'prop-types'
import { useForm } from 'react-hook-form'
import { useNavigate } from "react-router-dom"

function ReturnRequestModal({ onSubmit, onClose, reason, additionalRemark, setReason, setAdditionalRemark }) {
    const { register, handleSubmit, formState: { errors } } = useForm()
    const navigate = useNavigate()

    function onSumbitHandler() {
        onSubmit()
        onClose()
        navigate('/account/orders')
    }

    return (
        <div className="relative z-10" aria-labelledby="view category">
            <div className="fixed inset-0 bg-[#f1f1f1] bg-opacity-75 transition-all backdrop-blur-sm"></div>
            <div className="fixed inset-0 z-10 w-screen overflow-y-auto">
                <div className="flex min-h-full justify-center items-center px-2 py-12 text-center ">
                    <form action="" onSubmit={handleSubmit(onSumbitHandler)}>
                        <div className="relative w-96 text-left p-10 rounded-2xl bg-[#D9D9D9] text-black `">
                            <button
                                className="rounded-md p-1 inline-flex items-center justify-center text-black hover:bg-black hover:text-white transition ease-in duration-75 focus:outline-none absolute top-2 right-2"
                                onClick={onClose} >
                                <IoMdClose size={20} />
                            </button>
                            <p className="text-lg">Select the reason for the return request</p>
                            <select {...register('reason', {
                                required: "Reason is required"
                            })}
                                value={reason}
                                onChange={(e) => {
                                    setReason(e.target.value)
                                }}
                                className='font-medium p-2 outline-none rounded-md bg-neutral-100 mt-4 w-full'>
                                <option value="">Select reason</option>
                                <option value="product have been damaged">Product have been damaged</option>
                                <option value="changed my mind">Changed my mind</option>
                                <option value="order placed by mistake">Order placed by mistake</option>
                                <option value="doesnt liked the fit">Doesnt liked the fit</option>
                            </select>
                            {errors.reason && <span className='text-red-700 text-sm'>{errors?.reason?.message}</span>}
                            <textarea {...register}
                                value={additionalRemark}
                                onChange={(e) => {
                                    const value = e.target.value.trim().replace(/[^a-zA-Z]/g, '')
                                    setAdditionalRemark(value)
                                }}
                                className="mt-4 rounded-md w-full p-2 bg-neutral-100 focus:outline-none"></textarea>
                            {errors.additionalRemark && <span className='text-red-700 text-sm'>{errors?.data?.message}</span>}
                            <div className='pt-4 flex justify-end'>
                                <button onClick={onClose} className='px-2 py-1 border bg-neutral-700 text-white rounded-md'>Cancel</button>
                                <button className='px-2 py-1 text-white bg-red-500 rounded-md ml-2'>Return</button>
                            </div>
                        </div>
                    </form>
                </div>
            </div>
        </div >
    )
}

ReturnRequestModal.propTypes = {
    onSubmit: PropTypes.func.isRequired,
    onClose: PropTypes.func.isRequired,
    reason: PropTypes.string,
    additionalRemark: PropTypes.string,
    setReason: PropTypes.func.isRequired,
    setAdditionalRemark: PropTypes.func.isRequired
}

export default ReturnRequestModal