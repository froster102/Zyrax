import PropTypes from "prop-types";
import { useState } from "react"
import { Controller } from "react-hook-form"
import { IoMdAddCircleOutline } from "react-icons/io"
import { MdDelete } from "react-icons/md";
import { toast } from "react-toastify";


function ImageSelector({ control, setPreview, setModalOpen, mode }) {
    const [deleteHover, setDeleteHover] = useState(null)
    return (
        <Controller
            name="images"
            control={control}
            defaultValue={[]}
            render={({ field: { value, onChange } }) => (
                <div className='flex mt-4 gap-2'>
                    {value.map((image, i) => {
                        return mode === 'edit' ? <div
                            key={i}
                            onMouseEnter={() => {
                                setDeleteHover(i)
                            }}
                            onClick={() => {
                                setPreview(image?.data || image)
                            }}
                            className='w-[114px] h-[100px] bg-[#D9D9D9] rounded-md p-2 relative'>
                            <img className='w-full h-full object-contain' src={image?.data || image} alt="" />
                            {deleteHover === i && <div
                                onMouseLeave={() => {
                                    setDeleteHover(false)
                                }}
                                className="absolute w-full h-full top-0 left-0">
                                <div className="inset-0 bg-opacity-75 transition-all backdrop-blur-sm w-full h-full flex justify-center items-center">
                                    <MdDelete onClick={(e) => {
                                        e.stopPropagation()
                                        const newImages = value.filter((image, index) => index !== i)
                                        onChange(newImages)
                                        setPreview(null)
                                    }} className="hover:bg-slate-300 transition ease-in rounded-full" color="#64748b" size={30} />
                                </div>
                            </div>}
                        </div> : <div
                            key={i}
                            onMouseEnter={() => {
                                setDeleteHover(i)
                            }}
                            onClick={() => {
                                setPreview(image.data)
                            }}
                            className='w-[114px] h-[100px] bg-[#D9D9D9] rounded-md p-2 relative'>
                            <img className='w-full h-full object-contain' src={image.data} alt="" />
                            {deleteHover === i && <div
                                onMouseLeave={() => {
                                    setDeleteHover(false)
                                }}
                                className="absolute w-full h-full top-0 left-0">
                                <div className="inset-0 bg-opacity-75 transition-all backdrop-blur-sm w-full h-full flex justify-center items-center">
                                    <MdDelete onClick={(e) => {
                                        e.stopPropagation()
                                        const newImages = value.filter((image, index) => index !== i)
                                        onChange(newImages)
                                        setPreview(null)
                                    }} className="hover:bg-slate-300 transition ease-in rounded-full" color="#64748b" size={30} />
                                </div>
                            </div>}
                        </div>
                    })}
                    <div onClick={() => {
                        if (value.length === 4) {
                            toast('Maximum number of images of four')
                        } else {
                            setModalOpen(true)
                        }
                    }}
                        className='w-[114px] h-[100px] bg-[#D9D9D9] rounded-md flex justify-center items-center'><IoMdAddCircleOutline size={60} /></div>
                </div>
            )}
        />
    )
}

ImageSelector.propTypes = {
    control: PropTypes.any,
    setPreview: PropTypes.any,
    setModalOpen: PropTypes.func,
    mode: PropTypes.string
}

export default ImageSelector