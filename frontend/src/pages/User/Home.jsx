import Banner from "../../components/Banner"
import CatergoryCard from "../../components/CatergoryCard"
import Newsletter from "../../components/Newsletter"
import Row from "../../components/Row"

function Home() {
  return (
    <>
      <div className="px-[20px]">
        <div className="ml-auto mr-auto w-fit mt-4">
          <button className="px-10 py-4 border-[1px] border-black rounded-full bg-black text-white">Men</button>
          <button className="px-10 py-4 border-[1px] border-black rounded-full text-black ml-2">Women</button>
        </div>
        <Banner></Banner>
        <p className="mt-2">Catelogs</p>
        <p className="text-center text-4xl">Fresh arrivals and new collections.</p>
        <div>
          <CatergoryCard name='shirts' img={''}></CatergoryCard>
        </div>
        <Row title='All New Topwears' rowId={1}></Row>
        <Row title='All New Bottomwears' rowId={2}></Row>
        <Newsletter></Newsletter>
      </div>
    </>
  )
}

export default Home