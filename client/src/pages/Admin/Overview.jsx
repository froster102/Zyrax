import { FaBox, FaUsers } from "react-icons/fa";
import CountCard from "../../components/CountCard";
import { RiShoppingBag3Line } from "react-icons/ri";
import { RiMoneyDollarCircleFill } from "react-icons/ri";
import RadarChartComponent from "@/components/RadarChartComponent";
import BarChartComponent from "@/components/BarChartComponent";


function Overview() {
  return (
    <>
      <div className='border-[1px] border-black w-full ml-4 rounded-lg bg-[#F1F1F1] shadow-inner pt-[40px] px-[20px]'>
        <h1 className='text-3xl font-semibold'>Overview</h1>
        {/* <div className="flex gap-4 pt-4">
          <p>Last 24 hours</p>
          <p>Last week</p>
          <p>Last month</p>
          <p>Last Year</p>
          <p></p>
        </div> */}
        <div className="flex mt-6 gap-4">
          <CountCard title="Total Customers" count={'543,0053'} Icon={FaUsers} />
          <CountCard title="Total Orders" count={'5430,053'} Icon={RiShoppingBag3Line} />
          <CountCard title="Total Revenue" count={'543,0053'} Icon={RiMoneyDollarCircleFill} />
          <CountCard title="Total Products" count={'5430,053'} Icon={FaBox} />
          {/* <CountCard title="Total Customers" count={5430053} Icon={FaUsers} /> */}
        </div>
        <div className="flex w-full gap-12">
          <BarChartComponent />
          <RadarChartComponent />
        </div>
      </div>
    </>
  )
}

export default Overview