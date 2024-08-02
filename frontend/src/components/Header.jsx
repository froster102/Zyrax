import Zyrax_icon from '../assets/options-list.png'

function Header() {
    return (
        <>
            <div className='flex justify-between px-[40px] pt-[20px]' >
                <img className='w-12 h-12 ' src={Zyrax_icon} alt="store logo" />
                <h1 className='text-4xl font-extrabold'>Zyrax.Store</h1>
                <div className='w-12 h-12'></div>
            </div>
            <div className='border-[1px] border-b-[#CFCBCB] mt-2 mx-[20px]' ></div>
        </>
    )
}

export default Header