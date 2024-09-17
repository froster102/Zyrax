import { useRef, useState } from 'react'
import ReactCrop, { centerCrop, convertToPixelCrop, makeAspectCrop } from 'react-image-crop'
import 'react-image-crop/dist/ReactCrop.css'
import { Flip, toast, ToastContainer } from 'react-toastify';
import setCanvas from '../utils/setCanvas';

const FIXED_WIDTH = 683;
const FIXED_HEIGHT = 911;
const ASPECT_RATIO = FIXED_WIDTH / FIXED_HEIGHT;

function ImageCropper({ closeModal, addImage }) {
    const canvasRef = useRef(null)
    const imgRef = useRef(null)
    const [imgSrc, setImageSrc] = useState({
        name: '',
        data: ''
    })
    const [crop, setCrop] = useState()

    function onFileSelect(e) {
        const file = e.target.files?.[0]
        const fileName = file.name
        if (!file) return

        const reader = new FileReader()
        reader.addEventListener('load', () => {
            const imageUrl = reader.result?.toString() || ''
            setImageSrc({ name: fileName, data: imageUrl })
        })
        reader.readAsDataURL(file)
    }

    function onImageLoad(e) {
        const { width, height, naturalWidth, naturalHeight } = e.currentTarget
        const crop = makeAspectCrop(
            {
                unit: '%',
                width: (FIXED_WIDTH / width) * 100,
                height: (FIXED_HEIGHT / width) * 100
            },
            ASPECT_RATIO,
            width,
            height
        )
        const centerdCrop = centerCrop(crop, width, height)
        setCrop(centerdCrop)
    }

    return (
        <>
            <ToastContainer className='mt-10 rounded-lg font-semibold text-center'
                position='top-center'
                // autoClose='1000'
                theme='dark'
                hideProgressBar={true}
                transition={Flip}
            ></ToastContainer>
            <label className='block mt-3 w-fit'>
                <span className='sr-only'>Choose profile photo</span>
                <input type="file"
                    accept='image/*'
                    onChange={onFileSelect}
                    className='block w-fit text-sm text-black file:mr-4 file:py-1 file:px-2 file:rounded-full file:border-none'
                />
            </label>
            {
                imgSrc &&
                <div className='flex flex-col items-center'>
                    <ReactCrop crop={crop} keepSelection aspect={ASPECT_RATIO} onChange={crop => setCrop(crop)} minHeight={FIXED_HEIGHT} minWidth={FIXED_WIDTH}>
                        <img ref={imgRef} src={imgSrc.data} onLoad={onImageLoad} />
                    </ReactCrop>
                </div>
            }
            <div className='w-full flex justify-center'>
                {imgSrc.data && <button onClick={() => {
                    setCanvas(
                        imgRef.current,
                        canvasRef.current,
                        convertToPixelCrop(
                            crop,
                            imgRef.current.width,
                            imgRef.current.height
                        )
                    )
                    addImage({ name: imgSrc.name, data: canvasRef.current.toDataURL() })
                    closeModal(false)
                }}
                    className='bg-black px-4 py-2 rounded-lg mt-4'>Crop</button>}
            </div>
            {
                crop && <canvas ref={canvasRef} className='hidden mt-4 border-2 border-black'>

                </canvas>
            }

        </>
    )
}

export default ImageCropper