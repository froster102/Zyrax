import PropTypes from 'prop-types'
import { IoIosArrowDown } from 'react-icons/io'
import { motion } from 'framer-motion'
import _ from 'lodash'

function SidebarAccordion({ title, isOpen, index, subCategories, toggle }) {
    console.log(index)
    return (
        <>
            <div onClick={() => { toggle(index) }} className='pt-4 flex justify-between items-center'>{_.startCase(title)}<IoIosArrowDown className={`${isOpen?'rotate-180':'rotate-0'} transition ease-in duration-200`} /></div>
            {isOpen && <motion.ul
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className='ml-2 transition ease-in duration-500'>
                {subCategories.map((category, i) => <li className='pt-4 text-sm' key={i}>{_.startCase(category.name)}</li>)}
            </motion.ul>}
        </>
    )
}

SidebarAccordion.propTypes = {
    title: PropTypes.string.isRequired,
    isOpen: PropTypes.bool.isRequired,
    subCategories: PropTypes.array.isRequired,
    index : PropTypes.number.isRequired,
    toggle: PropTypes.func.isRequired
}

export default SidebarAccordion