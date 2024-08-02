import { IoSearchOutline } from "react-icons/io5";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import ProductTable from "../../components/ProductTable";
import { useFetchProductsQuery } from "../../features/adminApiSlice";


function Products() {
  const [products, setProducts] = useState([])
  const data = useFetchProductsQuery()

  useEffect(() => {
    setProducts(data?.products)
  }, [])

  return (
    <>
      <div className='border-[1px] border-black w-full ml-4 rounded-lg bg-[#F1F1F1] shadow-inner pt-[40px] px-[20px]'>
        <h1 className='text-3xl font-semibold'>Products</h1>
        <div className="flex justify-between items-center">
          <div className="w-fit mt-4 px-2 flex items-center justify-items-center bg-white  rounded-md h-fit border-[1px] border-black">
            <IoSearchOutline size={20} color="gray" />
            <input className='h-[40px] rounded-md w-80 outline-none' type="text" placeholder='Search' />
          </div>
          <Link to='/admin/dashboard/add-product' ><button className="bg-black text-white font-medium rounded-3xl w-fit h-fit px-8 py-4">Add Product</button></Link>
        </div>
        <div className="relative overflow-x-auto shadow-md sm:rounded-lg mt-4">
          {products && <ProductTable products={products}></ProductTable>}
        </div>

      </div>
    </>
  )
}

export default Products