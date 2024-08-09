import { useSelector } from 'react-redux'
import { selectUserToken, seleUserRole } from '../features/authSlice'
import { Navigate, Outlet, useLocation } from 'react-router-dom'

function RequireUserAuth() {
    const token = useSelector(selectUserToken)
    const role = useSelector(seleUserRole)
    const location = useLocation()
    return (
        token && role === 'user' ? <Outlet></Outlet> : <Navigate to='/login' state={{ from: location }}></Navigate>
    )
}

export default RequireUserAuth