import { useRef, useState } from 'react'
import { IoMdClose } from 'react-icons/io'
import { motion } from 'framer-motion'
import PropTypes from 'prop-types'

function ProductImageModal({ closeModal, image }) {
    const [zooming, setZooming] = useState(false)

    const imageRef = useRef()

    function handleMouseMove(e) {
        const rect = imageRef.current.getBoundingClientRect()
        const x = e.clientX - rect.left
        const y = e.clientY - rect.top

        const originX = (x / rect.width) * 100
        const originY = (y / rect.height) * 100

        imageRef.current.style.transformOrigin = `${originX}px ${originY}px`
    }

    function handleMouseEnter() {
        setZooming(true)
    }

    function handleMouseLeave() {
        setZooming(false)
    }

    return (
        <>
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3 }}
                onClick={closeModal}
                className="relative z-10"
            >
                <div className="fixed inset-0 bg-gray-900 bg-opacity-75 transition-all backdrop-blur-sm"></div>
                <div className="fixed inset-0 z-10 w-screen overflow-y-auto">
                    <div className="flex min-h-full justify-center items-center px-2 py-12 text-center ">
                        <div className="relative w-[95%] sm:w-[80%] min-h-[60vh] rounded-2xl bg-[#D9D9D9] flex justify-center text-slate-100 text-left overflow-hidden">
                            <div className="px-5 py-4">
                                <button
                                    className="rounded-md p-1 inline-flex items-center justify-center text-black hover:bg-black hover:text-white transition ease-in duration-75 focus:outline-none absolute top-2 right-2"
                                    onClick={closeModal} >
                                    <IoMdClose size={40} />
                                </button>
                                <div
                                    onMouseEnter={handleMouseEnter}
                                    onMouseLeave={handleMouseLeave}
                                    onMouseMove={handleMouseMove}
                                    className='relative flex items-center justify-center w-fit'>
                                    <img
                                        className='rounded-sm'
                                        ref={imageRef} src={image} alt=""
                                        style={{
                                            transition: 'transform 0.3s ease',
                                            transform: zooming ? 'scale(2)' : 'scale(1)',
                                            cursor: zooming ? 'zoom-out' : 'zoom-in'
                                        }} />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </motion.div>
        </>
    )
}

ProductImageModal.propTypes = {
    closeModal: PropTypes.func.isRequired,
    image: PropTypes.string.isRequired
}

export default ProductImageModal