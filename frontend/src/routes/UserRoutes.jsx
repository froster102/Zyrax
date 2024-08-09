import Header from '../components/Header'
import { Route, Routes } from 'react-router-dom'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import Login from '../pages/User/Login'
import Register from '../pages/User/Register'
import Reset from '../pages/User/Reset'
import NotFound from '../pages/User/NotFound'
import MobileSignIn from '../pages/User/MobileSignIn'
import VerifyEmail from '../pages/User/VerifyEmail'
import Home from '../pages/User/Home'
import Profile from '../pages/User/Profile'
import RequireUserAuth from '../components/RequireUserAuth'
import ProductDetails from '../components/ProductDetails'
import BreadCrumbs from '../components/BreadCrumbs'

function UserRoutes() {
    return (
        <>
            <Header></Header>
            <Navbar></Navbar>
            <Routes>
                <Route path='/login' element={<Login></Login>} ></Route>
                <Route path='/register' element={<Register></Register>} ></Route>
                <Route path='/verify-email' element={<VerifyEmail></VerifyEmail>}></Route>
                <Route path='/reset-password' element={<Reset></Reset>} ></Route>
                <Route path='/mobile-signin' element={<MobileSignIn></MobileSignIn>}></Route>
                <Route path='/' element={<Home></Home>}></Route>
                <Route path='/product/:name' element={<ProductDetails></ProductDetails>}></Route>
                <Route element={<RequireUserAuth />}>
                    <Route path='/profile' element={<Profile></Profile>} ></Route>
                </Route>
                <Route path='*' element={<NotFound></NotFound>} ></Route>
            </Routes>
            <Footer></Footer>
        </>
    )
}

export default UserRoutes