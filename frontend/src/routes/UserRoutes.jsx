import Header from '../components/Header'
import { Route, Routes } from 'react-router-dom'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import Login from '../pages/User/Login'
import Register from '../pages/User/Register'
import ResetPassword from '../pages/User/ResetPassword'
import NotFound from '../pages/User/NotFound'
import VerifyEmail from '../pages/User/VerifyEmail'
import Home from '../pages/User/Home'
import Profile from '../pages/User/Profile'
import RequireUserAuth from '../components/RequireUserAuth'
import ProductDetails from '../components/ProductDetails'
import Wishlist from '../pages/User/Wishlist'
import Cart from '../pages/User/Cart'
import { Flip, ToastContainer } from 'react-toastify'

function UserRoutes() {
    return (
        <>
            <ToastContainer className='mt-10 rounded-lg font-semibold text-center'
                position='top-center'
                autoClose='1000'
                theme='dark'
                hideProgressBar={true}
                transition={Flip}
            ></ToastContainer>
            <Header></Header>
            <Navbar></Navbar>
            <Routes>
                <Route path='/login' element={<Login></Login>} ></Route>
                <Route path='/register' element={<Register></Register>} ></Route>
                <Route path='/verify-email' element={<VerifyEmail></VerifyEmail>}></Route>
                <Route path='/reset-password' element={<ResetPassword></ResetPassword>} ></Route>
                <Route path='/men' element={<Home></Home>}></Route>
                <Route path='/women' element={<Home></Home>}></Route>
                <Route path='/wishlist' element={<Wishlist></Wishlist>} ></Route>
                <Route path='/cart' element={<Cart></Cart>} ></Route>
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