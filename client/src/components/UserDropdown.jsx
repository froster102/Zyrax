import { AnimatePresence, motion } from "framer-motion"
import { Link } from "react-router-dom"
import { FaRegUser } from "react-icons/fa"
import { useState } from "react"
import PropTypes from 'prop-types'

function UserDropdown({ user, logoutUser }) {
    const [show, setShow] = useState(false)

    return (
        <>
            <div className="relative" onMouseEnter={() => { setShow(true) }} onMouseLeave={() => { setShow(false) }} >
                <Link to={'/account'} ><div className='w-fit p-2 z-50 rounded-full h-fit  flex items-center justify-items-center hover:bg-[#cacaca] transition ease-in'>
                    <FaRegUser onClick={() => {
                    }} size={20}></FaRegUser>
                </div>
                </Link>
                <AnimatePresence>
                    {
                        user && show &&
                        <motion.ul
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            transition={{ ease: 'easeIn', duration: 0.2 }}
                            className='bg-[#E7E7E7] w-24 rounded-xl py-2 z-50 absolute top-full left-1/2 transform -translate-x-1/2 mt-2 '>
                            <Link to={'/profile'}><li className='mt-2 text-center hover:text-[#147efb] transition ease-in-out'>Profile</li></Link>
                            <li className='mt-2 text-center hover:text-[#147efb] transition ease-in-out' >Wallet</li>
                            <li onClick={() => { logoutUser() }} className='mt-2 text-center hover:text-[#147efb] transition ease-in-out'>Logout</li>
                        </motion.ul>
                    }
                </AnimatePresence>
            </div>

        </>
    )
}

UserDropdown.propTypes = {
    user : PropTypes.bool,
    logoutUser : PropTypes.func
}

export default UserDropdown