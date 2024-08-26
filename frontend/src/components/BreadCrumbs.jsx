import _ from 'lodash'
import { useSelector } from 'react-redux'
import { Link } from 'react-router-dom'
import { selectActiveGender } from '../features/userSlice'

function BreadCrumbs({ category, name }) {
    const activeGender = useSelector(selectActiveGender)
    return (
        <>
            <div className='lg:block hidden mt-2 pl-4'>
                <p className='text-gray-700 font-semibold text-sm'><Link to={`/${activeGender}`}>Home</Link> {'>'} {_.startCase(category)} {'>'} {_.startCase(name)} </p>
            </div>
        </>
    )
}

export default BreadCrumbs