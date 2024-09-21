import PropTypes from 'prop-types'
import { IoMdClose } from 'react-icons/io'

function RetryPayment() {
    
    return (
        <div className="relative z-10" aria-labelledby="view category">
            <div className="fixed inset-0 bg-[#f1f1f1] bg-opacity-75 transition-all backdrop-blur-sm"></div>
            <div className="fixed inset-0 z-10 w-screen overflow-y-auto">
                <div className="flex min-h-full justify-center items-center px-2 py-12 text-center ">
                    <div className="relative w-96 text-left p-10 rounded-2xl bg-[#D9D9D9] text-black `">
                        <button
                            className="rounded-md p-1 inline-flex items-center justify-center text-black hover:bg-black hover:text-white transition ease-in duration-75 focus:outline-none absolute top-2 right-2"
                            onClick={onCancel} >
                            <IoMdClose size={20} />
                        </button>
                        <p className='font-medium'>
                            {message}
                        </p>
                        <div className='pt-4 flex justify-end'>
                            <button onClick={onCancel} className='px-2 py-1 border bg-neutral-700 text-white rounded-md'>Cancel</button>
                            <button onClick={() => {
                                onConfirm()
                                close()
                            }} className='px-2 py-1 text-white bg-red-500 rounded-md ml-2'>{_.startCase(action)}</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

RetryPayment.propTypes = {

}
export default RetryPayment