import { useEffect, useState } from "react"
import Banner from "../../components/Banner"
import Newsletter from "../../components/Newsletter"
import Row from "../../components/Row"
import { useGetProductsQuery } from "../../features/userApiSlice"
import TrendingRow from "../../components/TrendingRow"
import { Link, useLocation } from "react-router-dom"
import { useDispatch } from "react-redux"
import { selectGender } from "../../features/userSlice"

function Home() {
  const { pathname } = useLocation()
  const gender = pathname.replace(/\//g, '')
  const [activeGender, setActiveGender] = useState(gender)
  const { data: topwears, isLoading: isTopwearsLoading } = useGetProductsQuery({ category: 'topwears', gender })
  const { data: bottomwears, isLoading: isBottomwearsLoading } = useGetProductsQuery({ category: 'bottomwears', gender })
  const dispatch = useDispatch()

  useEffect(() => {
    dispatch(selectGender(pathname.replace(/\//g, '')))
  }, [pathname, dispatch])

  return (
    <>
      <div className="px-[20px]">
        <div className="ml-auto mr-auto w-fit mt-4">
          <Link to={'/men'} ><button onClick={() => { setActiveGender('men') }} className={`${activeGender === 'men' ? 'bg-black text-white' : 'bg-transparent '} px-10 py-4 border-[1px] border-black rounded-full `}>Men</button></Link>
          <Link to={'/women'} ><button onClick={() => { setActiveGender('women') }} className={`${activeGender === 'women' ? 'bg-black text-white' : 'bg-transparent '} px-10 py-4 border-[1px] border-black rounded-full ml-2`}>Women</button></Link>
        </div>
        <Banner></Banner>
        <p className="mt-2">Catelogs</p>
        <p className="text-center text-4xl">Fresh and trending collections</p>
        <TrendingRow></TrendingRow>
        {<Row title='All New Topwears' products={topwears} isLoading={isTopwearsLoading} ></Row>}
        {<Row title='All New Bottomwears' products={bottomwears} isLoading={isBottomwearsLoading}></Row>}
        <Newsletter></Newsletter>
      </div>
    </>
  )
}

export default Home