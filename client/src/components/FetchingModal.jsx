import { FadeLoader } from "react-spinners"

function FetchingModal() {
    return (
        <div className="absolute inset-0 z-10 w-full h-full overflow-hidden">
            <div className="fixed inset-0 bg-neutral-300 bg-opacity-35 transition-all backdrop-blur-sm"></div>
            <div className="flex justify-center items-center h-full">
                <FadeLoader />
            </div>
        </div>
    )
}

export default FetchingModal