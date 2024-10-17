import { Route, Routes, useLocation } from "react-router-dom"
import AdminRoutes from "./routes/AdminRoutes"
import UserRoutes from "./routes/UserRoutes"
import { Toaster } from "react-hot-toast"
import { useLazyTrackEventQuery } from "./store/api/userApiSlice"
import { useEffect } from "react"

function App() {
  const [triggerEvent] = useLazyTrackEventQuery()
  const location = useLocation()
  const pathname = location.pathname

  useEffect(() => {
    if (pathname.split('/')[1] !== 'admin') {
      triggerEvent({ eventType: 'visit' })
    }
  }, [pathname, triggerEvent])

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
