import Header from '../components/Header'
import { Route, Routes } from 'react-router-dom'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import Login from '../pages/User/Login'
import Register from '../pages/User/Register'
import NotFound from '../pages/User/NotFound'
import Home from '../pages/User/Home'
import Account from '../pages/User/Account'
import RequireUserAuth from '../components/RequireUserAuth'
import ProductDetails from '../components/ProductDetails'
import Wishlist from '../pages/User/Wishlist'
import Cart from '../pages/User/Cart'
import { Flip, ToastContainer } from 'react-toastify'
import LayoutWithWidth from '../components/LayoutWithWidth'
import ProductLists from '../components/ProductLists'
import ForgotPassword from '../components/ForgotPassword'
import ResetPassword from '../components/ResetPassword'

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
                <Route path='/login' element={<LayoutWithWidth><Login /></LayoutWithWidth>} ></Route>
                <Route path='/register' element={<LayoutWithWidth> <Register /></LayoutWithWidth>} ></Route>
                <Route path='/men' element={<LayoutWithWidth><Home /></LayoutWithWidth>}></Route>
                <Route path='/women' element={<LayoutWithWidth><Home /></LayoutWithWidth>}></Route>
                <Route path='/wishlist' element={<LayoutWithWidth><Wishlist /></LayoutWithWidth>} ></Route>
                <Route path='/cart' element={<Cart></Cart>} ></Route>
                <Route path='/products/:category' element={<LayoutWithWidth><ProductLists /></LayoutWithWidth>} ></Route>
                <Route path='/product/:name' element={<LayoutWithWidth><ProductDetails /></LayoutWithWidth>}></Route>
                <Route path='/forgot-password' element={<LayoutWithWidth><ForgotPassword /></LayoutWithWidth>}></Route>
                <Route path='/reset-password/:token' element={<LayoutWithWidth><ResetPassword /></LayoutWithWidth>} ></Route>
                <Route element={<RequireUserAuth />}>
                    <Route path='/account/*' element={<LayoutWithWidth><Account /></LayoutWithWidth>} ></Route>
                </Route>
                <Route path='*' element={<NotFound></NotFound>} ></Route>
            </Routes>
            <Footer></Footer>
        </>
    )
}

export default UserRoutes