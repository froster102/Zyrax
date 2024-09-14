import { Route, Routes } from "react-router-dom"
import Login from "../pages/Admin/Login"
import Dashboard from '../pages/Admin/Dashboard'
import NotFound from "../pages/User/NotFound"
import RequireAdminAuth from "../components/RequireAdminAuth"

function AdminRoutes() {
  return (
    <Routes>
      <Route path="/login" element={<Login></Login>} ></Route>
      <Route element={<RequireAdminAuth />}>
        <Route path="/dashboard/*" element={<Dashboard></Dashboard>}></Route>
      </Route>
      <Route path='*' element={<NotFound></NotFound>} ></Route>
    </Routes>
  )
}

export default AdminRoutes