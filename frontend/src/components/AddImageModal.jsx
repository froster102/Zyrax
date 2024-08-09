import { IoMdClose } from "react-icons/io";
import ImageCropper from "./ImageCropper";

function AddImageModal({ closeModal, addImage }) {
    return (
        <div
            className="relative z-10"
            aria-labelledby="crop-image-dialog"
            role="dialog"
            aria-modal="true"
        >
            <div className="fixed inset-0 bg-gray-900 bg-opacity-75 transition-all backdrop-blur-sm"></div>
            <div className="fixed inset-0 z-10 w-screen overflow-y-auto">
                <div className="flex min-h-full justify-center px-2 py-12 text-center ">
                    <div className="relative w-[95%] sm:w-[80%] min-h-[60vh] rounded-2xl bg-[#D9D9D9] text-slate-100 text-left ">
                        <div className="px-5 py-4">
                            <button
                                className="rounded-md p-1 inline-flex items-center justify-center text-black hover:bg-black hover:text-white transition ease-in duration-75 focus:outline-none absolute top-2 right-2"
                                onClick={closeModal}

                            >
                                <IoMdClose size={40} />
                            </button>
                            <ImageCropper
                                updateAvatar={''}
                                closeModal={closeModal}
                                addImage={addImage}
                            />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default AddImageModal