import { useSelector } from "react-redux"
import { selectUserToken, seleUserRole } from "../store/slices/authSlice"
import { Navigate, Outlet, useLocation } from "react-router-dom"

function RequireAdminAuth() {
    const token = useSelector(selectUserToken)
    const role = useSelector(seleUserRole)
    const location = useLocation()
    return (
        token && role === 'admin' ? <Outlet></Outlet> : <Navigate to='/admin/login' state={{ from: location }} ></Navigate>
    )
}

export default RequireAdminAuth