import _ from 'lodash'
import { Link } from 'react-router-dom'

function BreadCrumbs({ category, name }) {
    return (
        <>
            <div className='ml-48 mt-2'>
                <p className='text-gray-700 font-semibold text-sm'><Link to={'/'}>Home</Link> / {_.startCase(category)} / {_.startCase(name)} </p>
            </div>
        </>
    )
}

export default BreadCrumbs