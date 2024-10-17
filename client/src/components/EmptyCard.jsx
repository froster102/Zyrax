import { Link } from 'react-router-dom'
import LookingEmoji from '../assets/lookingEmoji.png'
import { useSelector } from 'react-redux'
import { selectActiveGender } from '../store/slices/userSlice'
import PropTypes from 'prop-types'

function EmptyCard({ title }) {
    const activeGender = useSelector(selectActiveGender)

    return (
        <>
            <div className='w-full flex flex-col justify-center items-center mt-24 mb-24' >
                <div className='w-96 h-fit bg-black p-10 rounded-lg  flex' >
                    <img className=' w-32' src={LookingEmoji} alt="" />
                    <h1 className=' text-white font-extrabold text-2xl ml-4' >Ahh! your {title} is empty</h1>
                </div>
                <Link to={`/${activeGender}`} ><button className='rounded-lg w-fit mt-4 py-2 text-black border border-black font-medium px-4'>Continue Shopping</button></Link>
            </div>
        </>
    )
}

EmptyCard.propTypes = {
    title: PropTypes.string
}

export default EmptyCard