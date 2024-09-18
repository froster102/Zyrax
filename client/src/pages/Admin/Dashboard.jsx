import Sidebar from '../../components/Sidebar'
import { Route, Routes } from 'react-router-dom'
import Products from './Products'
import Overview from './Overview'
import NotFound from '../User/NotFound'
import AddProduct from './AddProduct'
import Users from './Users'
import Analytics from './Analytics'
import Orders from './Orders'
import Payments from './Payments'
import Returns from './Returns'
import Category from './Category'
import Offer from './Offer'
import Coupons from './Coupons'

function Dashboard() {
  return (
    <>
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
          <Route path='category' element={<Category />} ></Route>
          <Route path='offers' element={<Offer />} ></Route>
          <Route path='coupons' element={<Coupons />} ></Route>
          <Route path='returns' element={<Returns />} />
          <Route path='payments' element={<Payments></Payments>} />
          <Route path='*' element={<NotFound></NotFound>} />
        </Routes>

      </div>
    </>
  )
}

export default Dashboard