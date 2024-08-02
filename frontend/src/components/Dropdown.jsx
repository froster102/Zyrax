import React, { useState } from 'react'
import { BsChevronDown } from "react-icons/bs";
import { motion, AnimatePresence } from 'framer-motion'

function Dropdown({ title, options }) {
  const [showList, setShowList] = useState(false)
  return (
    <>
      <div className='relative'  onMouseEnter={() => { setShowList(true) }} onMouseLeave={() => { setShowList(false) }}>
        <div className='bg-[#E7E7E7] flex justify-between px-4 py-2 rounded-[21px]'>
          <p>{title}</p>
          <div className='p-1 bg-white rounded-full w-[24px] h-[24px] flex justify-center items-center ml-20'>
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

              className='bg-[#E7E7E7] p-4 rounded-xl mt-2 absolute top-10 w-full'>
              {options.map((option, i) => {
                return <li className='mt-2 hover:text-[#147efb] transition ease-in-out' key={i}>{option}</li>
              })}
            </motion.ul>
          }
        </AnimatePresence>
      </div>
    </>
  )
}

export default Dropdown