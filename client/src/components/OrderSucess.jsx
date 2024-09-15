import { useEffect } from 'react'
import { useSelector } from 'react-redux'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { selectActiveGender } from '../features/userSlice'

function OrderSucess() {
    const navigate = useNavigate()
    const location = useLocation()
    const activeGender = useSelector(selectActiveGender)
    console.log(location.search)
    // useEffect(() => {
    //     if (!location?.state?.orderSucess) {
    //         navigate(`/${activeGender}`)
    //     }
    // }, [navigate, activeGender, location])

    return (
        <>
            <div className='w-full flex justify-center mt-24 mb-24' >
                <div>
                    <div className='h-fit bg-black p-10 rounded-lg flex items-center' >
                        <img className='w-40' src="/dummy/cargo.png" alt="" />
                        <h1 className='text-white font-extrabold text-4xl ml-4 text-center' >Order sucessfull</h1>
                    </div>
                    <div className='w-full pt-6 flex justify-center'>
                        <Link to={`/${activeGender}`} ><button className='px-4 py-2 border border-black rounded-lg'>Continue Shopping</button></Link>
                    </div>
                </div>
            </div>
        </>

    )
}
export default OrderSucess