import { IoSearchOutline } from "react-icons/io5";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import ProductTable from "../../components/ProductTable";
import { useFetchProductsQuery } from "../../features/adminApiSlice";


function Products() {
  const { data, refetch } = useFetchProductsQuery()

  return (
    <>
      <div className='border-[1px] border-black w-full ml-4 rounded-lg bg-[#F1F1F1] shadow-inner pt-[40px] px-[20px]'>
        <h1 className='text-3xl font-semibold'>Products</h1>
        <div className="flex justify-between items-center">
          <div></div>
          <Link to='/admin/dashboard/products/add' ><button className="bg-black text-white font-medium rounded-3xl w-fit h-fit px-8 py-4">Add Product</button></Link>
        </div>
        <div className="relative overflow-x-auto shadow-md sm:rounded-lg">
          <ProductTable products={data?.products || []} refetch={refetch}></ProductTable>
        </div>
      </div>

    </>
  )
}

export default Products