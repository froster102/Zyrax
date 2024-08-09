import Sidebar from '../../components/Sidebar'
import { Route, Routes } from 'react-router-dom'
import Products from './Products'
import Overview from './Overview'
import NotFound from '../User/NotFound'
import AddProduct from './AddProduct'
import Users from './Users'
import { Flip, ToastContainer } from 'react-toastify'
import EditProduct from './EditProduct'
import Manage from './Manage'

function Dashboard() {
  return (
    <>
      <ToastContainer className='mt-10 rounded-lg font-semibold text-center'
        position='top-center'
        autoClose='1000'
        theme='dark'
        hideProgressBar={true}
        transition={Flip}
      ></ToastContainer>
      <div className='p-[20px] bg-white flex w-full'>
        <Sidebar></Sidebar>
        <Routes>
          <Route path='/' element={<Overview></Overview>} ></Route>
          <Route path='products' element={<Products></Products>}></Route>
          <Route path='products/add' element={<AddProduct></AddProduct>} ></Route>
          <Route path='/products/:id/edit' element={<AddProduct mode={'edit'}></AddProduct>}></Route>
          <Route path='users' element={<Users></Users>} ></Route>
          <Route path='manage/*' element={<Manage></Manage>}></Route>
          <Route path='*' element={<NotFound></NotFound>} ></Route>
        </Routes>

      </div>
    </>
  )
}

export default Dashboard