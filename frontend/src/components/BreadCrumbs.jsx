import _ from 'lodash'
import { useSelector } from 'react-redux'
import { Link } from 'react-router-dom'
import { selectActiveGender } from '../features/userSlice'
import PropTypes from 'prop-types'
import { IoHomeSharp } from "react-icons/io5";


function BreadCrumbs({ category, name }) {
    const activeGender = useSelector(selectActiveGender)
    return (
        <>
            <div className='lg:block hidden mt-2 pl-4'>
                <p className='text-gray-700 font-semibold text-sm flex items-center'>
                    <Link to={`/${activeGender}`}><span className='flex items-center gap-1'><IoHomeSharp />Home</span></Link>
                    {'>'} <Link to={`/${category}`}>{_.startCase(category)}</Link> {name && '>'} {name && _.startCase(name)} </p>
            </div>
        </>
    )
}

BreadCrumbs.propTypes = {
    category: PropTypes.string,
    name: PropTypes.string
}

export default BreadCrumbs