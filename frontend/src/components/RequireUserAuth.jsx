import { useSelector } from 'react-redux'
import { selectUserToken } from '../features/authSlice'
import { Navigate, Outlet, useLocation } from 'react-router-dom'

function RequireUserAuth() {
    const token = useSelector(selectUserToken)
    const location = useLocation()
    return (
        token ? <Outlet></Outlet> : <Navigate to='/login' state={{ from: location }}></Navigate>
    )
}

export default RequireUserAuth