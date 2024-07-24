import { Route, Routes } from "react-router-dom"
import Login from "../pages/Admin/Login"
import Dashboard from '../pages/Admin/Dashboard'
import Products from '../pages/Admin/Products'
import NotFound from "../pages/User/NotFound"

function AdminRoutes() {
  return (
    <Routes>
      <Route path="/login" element={<Login></Login>} ></Route>
      <Route path="/dashboard" element={<Dashboard></Dashboard>}></Route>
      <Route path="/dashboard/products" element={<Products></Products>}></Route>
      <Route path='*' element={<NotFound></NotFound>} ></Route>
    </Routes>
  )
}

export default AdminRoutes