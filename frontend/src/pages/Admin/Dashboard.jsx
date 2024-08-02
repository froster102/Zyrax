import Sidebar from '../../components/Sidebar'
import { Route, Routes } from 'react-router-dom'
import Products from './Products'
import Overview from './Overview'
import NotFound from '../User/NotFound'
import AddProduct from './AddProduct'
import Users from './Users'

function Dashboard() {
  return (
    <>
      <div className='p-[20px] bg-white flex w-full'>
        <Sidebar></Sidebar>
        <Routes>
          <Route path='/' element={<Overview></Overview>} ></Route>
          <Route path='/products' element={<Products></Products>}></Route>
          <Route path='/add-product' element={<AddProduct></AddProduct>} ></Route>
          <Route path='/users' element={<Users></Users>} ></Route>
          <Route path='*' element={<NotFound></NotFound>} ></Route>
        </Routes>
      </div>
    </>
  )
}

export default Dashboard