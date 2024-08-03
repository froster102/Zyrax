import { MdArrowForwardIos } from "react-icons/md";

function ProductCard({ name, img , price }) {
    return (
        <>
            <div className="w-[325px] h-[350px] border rounded-[20px] border-[#CFCBCB] relative inline-block ml-8">
                <img src="/dummy/new-arrivals-copy-2_A1hQbkg (1).webp" className="w-full h-full rounded-[20px] object-cover" alt="" />
                <div className="absolute w-64 bottom-2 p-2 left-4 bg-white rounded-[12px]">
                    <div className="flex justify-between">
                        <div>
                            <p className="text-base font-semibold">Text Shirt:Mudbrown</p>
                            <p className="text-sm font-medium">$199</p>
                        </div>
                        <div className="h-[40px] w-[40px] rounded-full flex justify-center items-center transition ease-in hover:bg-[#E6E6E6] ml-2">
                            <MdArrowForwardIos size={20} />
                        </div>
                    </div>

                </div>
            </div>
        </>
    )
}

export default ProductCard