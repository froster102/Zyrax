import { useEffect } from "react"
import Banner from "../../components/Banner"
import Newsletter from "../../components/Newsletter"
import Row from "../../components/Row"
import { useGetProductsQuery } from "../../store/api/productApiSlice"
import TrendingRow from "../../components/TrendingRow"
import { Link, useLocation } from "react-router-dom"
import { useDispatch, useSelector } from "react-redux"
import { selectActiveGender, selectGender } from "../../store/slices/userSlice"

function Home() {
  const { pathname } = useLocation()
  const activeGender = useSelector(selectActiveGender)
  const gender = pathname.replace(/\//g, '')
  const { data: topwears, isError: isTopwearsError, isLoading: isTopwearsLoading } = useGetProductsQuery({ category: 'topwears', gender })
  const { data: bottomwears, isError: isBottomwearsError, isLoading: isBottomwearsLoading } = useGetProductsQuery({ category: 'bottomwears', gender })
  const dispatch = useDispatch()

  useEffect(() => {
    dispatch(selectGender(pathname.replace(/\//g, '')))
  }, [pathname, dispatch])

  return (
    <>
      <div className="ml-auto mr-auto w-fit mt-4">
        <Link to={'/men'} ><button className={`${activeGender === 'men' ? 'bg-black text-white' : 'bg-transparent '} px-10 py-4 border-[1px] border-black rounded-full `}>Men</button></Link>
        <Link to={'/women'} ><button className={`${activeGender === 'women' ? 'bg-black text-white' : 'bg-transparent '} px-10 py-4 border-[1px] border-black rounded-full ml-2`}>Women</button></Link>
      </div>
      <Banner></Banner>
      <div className="px-[10px]">
        <p className="mt-2">Catelogs</p>
        <p className="text-center lg:text-4xl md:text-3xl text-2xl uppercase font-medium">Fresh and trending collections</p>
        <TrendingRow></TrendingRow>
        {!isTopwearsError && <Row title='All New Topwears' products={topwears} isLoading={isTopwearsLoading} ></Row>}
        {!isBottomwearsError && <Row title='All New Bottomwears' products={bottomwears} isLoading={isBottomwearsLoading}></Row>}
        <Newsletter></Newsletter>
      </div>
    </>
  )
}

export default Home