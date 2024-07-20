import { useState } from 'react'
import Header from './components/Header'
import { Route, Routes } from 'react-router-dom'
import Login from './pages/Login'
import Register from './pages/Register'
import Reset from './pages/Reset'
import NotFound from './pages/NotFound'


function App() {

  return (
    <>
      <Routes>
        <Route path='/login' element={<Login></Login>} ></Route>
        <Route path='/register' element={<Register></Register>} ></Route> 
        <Route path='/reset-password' element={<Reset></Reset>} ></Route>
        <Route path='*' element={<NotFound></NotFound>} ></Route>
      </Routes>
    </>
  )
}

export default App
