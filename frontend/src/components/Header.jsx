import { Link } from 'react-router-dom'
import Zyrax_icon from '../assets/options-list.png'
import { useSelector } from 'react-redux'
import { selected_gender } from '../features/userSlice'

function Header() {
    const gender = useSelector(selected_gender)
    return (
        <>
            <div className='flex justify-between px-[40px] pt-[20px]' >
                <img className='w-12 h-12 ' src={Zyrax_icon} alt="store logo" />
                <Link to={`/${gender}`}><h1 className='text-4xl font-extrabold'>Zyrax.Store</h1></Link>
                <div className='w-12 h-12'></div>
            </div>
            <div className='border-[1px] border-b-[#CFCBCB] mt-2 mx-[20px]' ></div>
        </>
    )
}

export default Header