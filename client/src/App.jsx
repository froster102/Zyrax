import { Route, Routes } from "react-router-dom"
import AdminRoutes from "./routes/AdminRoutes"
import UserRoutes from "./routes/UserRoutes"

function App() {

  return (
    <>
      <Routes>
        <Route path="/*" element={<UserRoutes></UserRoutes>}></Route>
        <Route path="/admin/*" element={<AdminRoutes></AdminRoutes>}></Route>
      </Routes>
    </>
  )
}

export default App
