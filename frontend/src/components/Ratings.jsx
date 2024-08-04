import { FaStar } from "react-icons/fa"

function Ratings({ ratings, customerImages }) {
    return (
        <>
            {
                ratings ? <div className='flex w-full justify-end'>
                    <div className='w-[724px]'>
                        <p className='text-3xl font-medium'>Ratings and Reviews</p>
                        <div className='h-[25px] bg-[#D9D9D9] w-fit rounded-lg border border-[#CFCBCB] my-2'>
                            <div className='flex text-base px-2 justify-center items-center font-semibold gap-2'>
                                <p className='flex items-center justify-center'>4.0<FaStar className='inline ml-1' /></p>
                                <p>|</p>
                                <p>34 ratings</p>
                                <p>|</p>
                                <p>20 reviews</p>
                            </div>
                        </div>
                        <div className='flex gap-4 mt-4'>
                            <div className='w-[111px] h-[90px] border border-black rounded-[12px]'></div>
                            <div className='w-[111px] h-[90px] border border-black rounded-[12px]'></div>
                            <div className='w-[111px] h-[90px] border border-black rounded-[12px]'></div>
                            <div className='w-[111px] h-[90px] border border-black rounded-[12px]'></div>
                        </div>
                        <div className='w-full h-[1px] bg-[#CFCBCB] my-4'></div>
                        <p className='font-semibold'>Customer Reviews (20)</p>
                        <div className='border-b border-[#CFCBCB]'>
                            <p className='ml-2 my-4 font-medium'>Awesome product loved it</p>
                            <div className='w-fit my-2'>
                                <div className='flex text-light px-2 justify-center items-center  gap-2'>
                                    <p className='flex text-base items-center justify-center font-semibold h-[25px] bg-[#D9D9D9] w-fit rounded-lg border border-[#CFCBCB] p-2'>4.0<FaStar className='inline ml-1' /></p>
                                    <p>|</p>
                                    <p>John Doe</p>
                                    <p>|</p>
                                    <p>27/02/2024</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div> : <div className='flex w-full justify-end'>
                    <div className='w-[724px]'>
                        <p className='text-3xl font-medium'>Ratings and Reviews</p>
                        <p className="text-xl font-light my-4 italic">No customer review yet</p>
                    </div>
                </div>
            }
        </>
    )
}

export default Ratings