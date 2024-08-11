import { useEffect, useState } from "react"
import Banner from "../../components/Banner"
import Newsletter from "../../components/Newsletter"
import Row from "../../components/Row"
import { useGetProductsQuery } from "../../features/userApiSlice"
import TrendingRow from "../../components/TrendingRow"
import { Link, useLocation, useNavigate } from "react-router-dom"
import { useDispatch } from "react-redux"
import { selectGender } from "../../features/userSlice"
import Navbar from "../../components/Navbar"

function Home() {
  const { pathname } = useLocation()
  const gender = pathname.replace(/\//g, '')
  const [activeGender, setActiveGender] = useState(gender)
  const { data: topwears, isLoading: isTopwearsLoading } = useGetProductsQuery({ category: 'topwears', gender })
  const { data: bottomwears, error, isLoading: isBottomwearsLoading } = useGetProductsQuery({ category: 'bottomwears', gender })
  const dispatch = useDispatch()

  useEffect(() => {
    dispatch(selectGender(pathname.replace(/\//g, '')))
  }, [pathname, dispatch])

  console.log(activeGender)

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
        {!error && <Row title='All New Topwears' products={topwears} isLoading={isBottomwearsLoading} ></Row>}
        {!error && <Row title='All New Bottomwears' products={bottomwears} isLoading={isTopwearsLoading}></Row>}
        <Newsletter></Newsletter>
      </div>
    </>
  )
}

export default Home