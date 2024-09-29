import { Toaster } from "react-hot-toast";
import ProductTable from "../../components/ProductTable";
import { useFetchProductsQuery } from "../../store/api/adminApiSlice";
import { useState } from "react";

function Products() {
  const [filter, setFilter] = useState({
    limit: 10,
    page: 1
  })
  const { data: { products = [], totalCount = 0 } = {}, isLoading: isProductsLoading, refetch } = useFetchProductsQuery({ filter, sort:'' })

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
      <div className='border border-black w-full ml-4 rounded-lg bg-neutral-50 shadow-inner pt-[40px] px-[20px] pb-10'>
        <h1 className='text-3xl font-semibold'>Products</h1>
        <ProductTable
          filter={filter}
          setFilter={setFilter}
          products={products}
          totalCount={totalCount}
          isProductsLoading={isProductsLoading}
          refetch={refetch}
        />
      </div>

    </>
  )
}

export default Products