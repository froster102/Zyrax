import { useState } from "react";
import { BiSolidCoupon } from "react-icons/bi";
import { IoIosArrowDown } from "react-icons/io";
import PropTypes from 'prop-types'

function Accordion({ title, end }) {
    const [accordionOpen, setAccordinOpen] = useState(false)
    return (
        <>
            <div className="">
                <div onClick={() => setAccordinOpen(!accordionOpen)} className="flex justify-between items-center cursor-pointer py-1 px-4">
                    <p className="text-base font-semibold"><BiSolidCoupon className="inline mr-2" />{title}</p>
                    <IoIosArrowDown className={`${accordionOpen ? 'rotate-180' : 'rotate-0'} transition ease-in-out`} />
                </div>
                <div className={`grid overflow-hidden transition-all ease-in-out duration-300 ${accordionOpen ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0'}`} >
                    <div className="flex w-full justify-between items-center gap-2 pt-2 px-4 overflow-hidden">
                        <input className="rounded-lg border border-[#CFCBCB] focus:outline-none h-[32px] p-2 w-full" placeholder="Enter the code " type="text" />
                        <button className="px-1 border border-[#CFCBCB] rounded-md text-sm font-semibold text-[#686868] h-[32px] hover:bg-black hover:text-white transition ease-in duration-200">
                            Apply</button>
                    </div>
                </div>
                {!end && <div className="border-b border-b-[#CFCBCB] pt-1"></div>}
            </div>
        </>
    )
}

Accordion.propTypes = {
    title: PropTypes.string.isRequired,
    end: PropTypes.bool
}

export default Accordion