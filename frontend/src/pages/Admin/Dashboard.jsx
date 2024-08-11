import Sidebar from '../../components/Sidebar'
import { Route, Routes } from 'react-router-dom'
import Products from './Products'
import Overview from './Overview'
import NotFound from '../User/NotFound'
import AddProduct from './AddProduct'
import Users from './Users'
import { Flip, ToastContainer } from 'react-toastify'
import Manage from './Manage'
import Analytics from './Analytics'
import Orders from './Orders'
import Payments from './Payments'
import Refunds from './Refunds'
import Returns from './Returns'
import Notification from './Notifications'

function Dashboard() {
  return (
    <>
      <ToastContainer className='mt-10 rounded-lg font-semibold text-center'
        position='top-center'
        autoClose={1000}
        theme='dark'
        hideProgressBar={true}
        transition={Flip}
      ></ToastContainer>
      <div className='p-[20px] bg-white flex w-full'>
        <Sidebar></Sidebar>
        <Routes>
          <Route path='/' element={<Overview></Overview>} />
          <Route path='analytics' element={<Analytics></Analytics>} />
          <Route path='products' element={<Products></Products>} />
          <Route path='products/add' element={<AddProduct></AddProduct>} />
          <Route path='products/:id/edit' element={<AddProduct mode={'edit'}></AddProduct>} />
          <Route path='users' element={<Users></Users>} />
          <Route path='orders' element={<Orders></Orders>} />
          <Route path='manage/*' element={<Manage></Manage>} />
          <Route path='payments' element={<Payments></Payments>} />
          <Route path='*' element={<NotFound></NotFound>} />
        </Routes>

      </div>
    </>
  )
}

export default Dashboard