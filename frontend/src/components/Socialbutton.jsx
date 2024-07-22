import React from 'react'



function Socialbutton({icon}) {
    return (
        <>
            <div className='w-[58px] h-[42px] rounded-md bg-[#F1F1F1] border-[1px] border-black flex items-center justify-center transition ease-in hover:bg-[#cecdcd]' >
                {icon}
            </div>
        </>
    )
}

export default Socialbutton