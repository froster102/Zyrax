import { useGetProductsQuery } from "@/store/api/productApiSlice";
import { useState } from "react";
import { IoSearchOutline } from "react-icons/io5";
import { useNavigate } from "react-router-dom";

function SearchBar() {
    const [search, setSearch] = useState('')
    const navigate = useNavigate()
    const { data: results, isLoading: isResultsLoading } = useGetProductsQuery({ filter: { search } })

    function handleSearch(e){
        if(e.key==='Enter') {
            setSearch('')
            navigate(`/products?search=${search}`)
        }
    }
    
    return (
        <>
            <div className='w-full lg:block hidden'>
                <div className='flex relative w-full bg-neutral-50 h-[40px] px-4 py-2 items-center rounded-[20px]'>
                    <input
                        className='bg-transparent outline-none w-full h-full'
                        placeholder='Search'
                        type="text"
                        value={search} 
                        onChange={(e)=>setSearch(e.target.value)}
                        onKeyDown={handleSearch}
                        />
                    <div className='bg-white h-[32px] w-[32px] flex items-center justify-center absolute right-[5px] rounded-full'>
                        <IoSearchOutline size={20} />
                    </div>
                </div>
            </div>

        </>
    )
}

export default SearchBar