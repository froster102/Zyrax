import { useSelector } from "react-redux"
import { selectAdminToken } from "../features/authSlice"
import { Navigate, Outlet, useLocation } from "react-router-dom"

function RequireAdminAuth() {
    const token = useSelector(selectAdminToken)
    const location = useLocation()
    return (
        token ? <Outlet></Outlet> : <Navigate to='/admin/login' state={{ from: location }} ></Navigate>
    )
}

export default RequireAdminAuth