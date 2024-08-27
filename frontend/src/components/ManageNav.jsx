import { Link } from 'react-router-dom'

function ManageNav() {
    return (
        <>
            <div className='w-[211px] rounded-[15px]  mt-8 bg-neutral-200 font-semibold text-lg h-fit shadow-xl'>
                <Link to='category'><p className='border-b border-b-[#CFCBCB] px-4 py-2'>Category</p></Link>
                <Link to='discount'><p className='border-b border-b-[#CFCBCB] px-4 py-2'>Discount</p></Link>
                <p className='border-b border-b-[#CFCBCB] px-4 py-2'>Coupons</p>
                <p className='px-4 py-2'>Banner</p>
            </div>
        </>
    )
}

export default ManageNav