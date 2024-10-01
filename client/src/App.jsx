import { Route, Routes } from "react-router-dom"
import AdminRoutes from "./routes/AdminRoutes"
import UserRoutes from "./routes/UserRoutes"
import { Toaster } from "react-hot-toast"

function App() {

  return (
    <>
      <Toaster
        position="top-center"
        toastOptions={{
          style: {
            backgroundColor: 'black',
            color: 'white',
          },
          duration: 2000
        }}
      />
      <Routes>
        <Route path="/*" element={<UserRoutes></UserRoutes>}></Route>
        <Route path="/admin/*" element={<AdminRoutes></AdminRoutes>}></Route>
      </Routes>
    </>
  )
}

export default App
