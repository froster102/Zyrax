import { AnimatePresence, motion } from "framer-motion"
import { useDispatch } from "react-redux"
import { userLogout } from "../features/authSlice"


function UserDropdown() {
    const dispatch = useDispatch()

    return (
        <>
            <AnimatePresence>
                <motion.ul
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ ease: 'easeIn', duration: 0.2 }}
                    className='bg-[#E7E7E7] w-24 rounded-xl py-2 z-10 absolute top-full left-1/2 transform -translate-x-1/2 mt-2 '>
                    <li className='mt-2 text-center hover:text-[#147efb] transition ease-in-out'>Profile</li>
                    <li className='mt-2 text-center hover:text-[#147efb] transition ease-in-out' >Wallet</li>
                    <li onClick={() => { dispatch(userLogout()) }} className='mt-2 text-center hover:text-[#147efb] transition ease-in-out'>Logout</li>
                </motion.ul>
            </AnimatePresence>
        </>
    )
}

export default UserDropdown