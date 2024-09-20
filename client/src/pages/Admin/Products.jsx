import { Toaster } from "react-hot-toast";
import ProductTable from "../../components/ProductTable";
import { useFetchProductsQuery } from "../../store/api/adminApiSlice";
import { useState } from "react";

function Products() {
  const [currentPage, setCurrentPage] = useState(1)
  const limit = 10
  const { data: products, isLoading: isProductsLoading, refetch } = useFetchProductsQuery({ currentPage, limit })

  return (
    <>
      <Toaster
        position="top-center"
        toastOptions={{
          style: {
            backgroundColor: 'black',
            color: 'white',
          },
          duration: 3000
        }}
      />
      <div className='border border-black w-full ml-4 rounded-lg bg-neutral-50 shadow-inner pt-[40px] px-[20px]'>
        <h1 className='text-3xl font-semibold'>Products</h1>
        <ProductTable
          currentPage={currentPage}
          setCurrentPage={setCurrentPage}
          products={products?.products}
          totalCount={products?.totalCount}
          isProductsLoading={isProductsLoading}
          refetch={refetch}
        />
      </div>

    </>
  )
}

export default Products