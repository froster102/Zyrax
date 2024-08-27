import ProductTable from "../../components/ProductTable";
import { useFetchProductsQuery } from "../../features/adminApiSlice";


function Products() {
  const { data, refetch } = useFetchProductsQuery()

  return (
    <>
      <div className='border border-black w-full ml-4 rounded-lg bg-neutral-50 shadow-inner pt-[40px] px-[20px]'>
        <h1 className='text-3xl font-semibold'>Products</h1>
        <ProductTable products={data?.products || []} refetch={refetch}></ProductTable>
      </div>

    </>
  )
}

export default Products