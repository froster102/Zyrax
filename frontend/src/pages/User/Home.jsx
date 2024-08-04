import { useState } from "react"
import Banner from "../../components/Banner"
import Newsletter from "../../components/Newsletter"
import Row from "../../components/Row"
import TrendingCard from "../../components/TrendingCard"

const TRENDING = new Array(10).fill(0)

function Home() {
  const [trendings, setTrendings] = useState(TRENDING)

  return (
    <>
      <div className="px-[20px]">
        <div className="ml-auto mr-auto w-fit mt-4">
          <button className="px-10 py-4 border-[1px] border-black rounded-full bg-black text-white">Men</button>
          <button className="px-10 py-4 border-[1px] border-black rounded-full text-black ml-2">Women</button>
        </div>
        <Banner></Banner>
        <p className="mt-2">Catelogs</p>
        <p className="text-center text-4xl">Fresh and trending collections</p>
        <div className="w-[1176px] overflow-x-scroll scroll-smooth whitespace-nowrap ml-auto mr-auto py-4 scrollbar-hide" id="slider">
          {
            trendings.map((trending) => {
              return <TrendingCard></TrendingCard>
            })
          }
        </div>
        <Row title='All New Topwears' rowId={1} products={new Array(10).fill(0)}></Row>
        <Row title='All New Bottomwears' rowId={2} products={new Array(10).fill(0)}></Row>
        <Newsletter></Newsletter>
      </div>
    </>
  )
}

export default Home