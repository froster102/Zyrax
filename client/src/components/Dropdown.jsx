import { useState } from 'react'
import { BsChevronDown } from "react-icons/bs";
import { motion, AnimatePresence } from 'framer-motion'
import PropTypes, { object } from 'prop-types'
import _ from 'lodash';
import { Link } from 'react-router-dom';

function Dropdown({ title, subCategories }) {
  const [showList, setShowList] = useState(false)

  return (
    <>
      <div className='relative' onMouseEnter={() => { setShowList(true) }} onMouseLeave={() => { setShowList(false) }}>
        <div className='bg-neutral-100 flex justify-between items-center px-2 py-2 rounded-[21px]'>
          <p>{title}</p>
          <div className='p-1 bg-white rounded-full w-[24px] h-[24px] flex justify-center items-center lg:ml-5'>
            <BsChevronDown size={30} color='#828282'></BsChevronDown>
          </div>
        </div>
        <AnimatePresence>
          {showList &&
            <motion.ul
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ ease: 'easeIn', duration: 0.2 }}
              className='bg-neutral-200 p-4 rounded-xl absolute top-10 z-50 w-40'>
              {subCategories?.map((category, i) => {
                return <Link to={`/products/${category.name}`} key={i}><li className='w-full pt-2 text-nowrap hover:text-[#147efb] transition ease-in-out'>{_.startCase(category?.name)}</li></Link>
              })}
            </motion.ul>
          }
        </AnimatePresence>
      </div>
    </>
  )
}

Dropdown.propTypes = {
  title: PropTypes.string.isRequired,
  subCategories: PropTypes.arrayOf(object).isRequired
}

export default Dropdown