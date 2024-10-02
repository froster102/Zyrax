import { FaBox, FaFileDownload, FaFileExcel, FaUsers } from "react-icons/fa";
import CountCard from "../../components/CountCard";
import { RiShoppingBag3Line } from "react-icons/ri";
import { RiMoneyDollarCircleFill } from "react-icons/ri";
import RadarChartComponent from "@/components/RadarChartComponent";
import BarChartComponent from "@/components/BarChartComponent";
import { useState } from "react";
import DateFilter from "@/components/DateFilter";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import OrderTable from "@/components/OrderTable";
import { useGetAnalyticsGraphDataQuery, useGetOverviewDataQuery, useLazyGetSalesReportQuery } from "@/store/api/adminApiSlice";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import ProductCard from "@/components/ProductCard";
import { FaFilePdf } from "react-icons/fa";
import toast from "react-hot-toast";

function Overview() {
  const [triggerDownloadSalesReport] = useLazyGetSalesReportQuery()
  const [downloadFormat, setDownloadFormat] = useState('pdf')
  const [openDownloadDropdown, setopenDownloadDropdown] = useState(false)
  const [filter, setFilter] = useState({
    limit: 10,
    page: 1,
    period: '',
  })

  const [chartFilter, setChartFilter] = useState({
    period: 'month'
  })

  const { data: {
    totalProducts = 0,
    totalCustomers = 0,
    totalRevenue = 0,
    totalProductsSold = 0,
    orders = [],
    products = []
  } = {} } = useGetOverviewDataQuery({ filter, sort: '' })
  const { data: { chartData = [] } = {} } = useGetAnalyticsGraphDataQuery({ filter: chartFilter, sort: '' })

  async function handleDownloadSalesReport(format) {
    setDownloadFormat(format)
    try {
      const salesReport = await triggerDownloadSalesReport({ filter, format: downloadFormat }).unwrap()
      const url = window.URL.createObjectURL(new Blob([salesReport]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `${downloadFormat === 'pdf' ? 'Sales Report.pdf':'Sales Report.xlsx'}`);
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (error) {
      toast('Failed to download report')
    }
  }

  return (
    <>
      <div className='border-[1px] border-black w-full ml-4 rounded-lg bg-[#F1F1F1] shadow-inner pt-[40px] px-[20px] pb-10'>
        <h1 className='text-3xl font-semibold'>Overview</h1>
        <div className="flex w-full justify-end">
          <div className="flex items-center">
            <div onMouseEnter={() => setopenDownloadDropdown(!openDownloadDropdown)} onMouseLeave={() => setopenDownloadDropdown(!openDownloadDropdown)}>
              <button className="flex items-center hover:bg-white relative mr-4 text-sm font-medium rounded-md bg-stone-300 px-4 py-2">
                <FaFileDownload />
                <p>Download report</p>
              </button>
              <div className={`transition ease-in-out duration-300 ${openDownloadDropdown ? 'opacity-1' : 'opacity-0'} `}>
                <div className="absolute w-36">
                  <div className="pt-2">
                    <div className="bg-white border border-neutral-200 rounded-md">
                      <span className="px-2 font-semibold text-sm">Select file type</span>
                      <ul className="p-2 bg-white rounded-md">
                        <li onClick={() => handleDownloadSalesReport('pdf')} className="pt-2 px-2 flex items-center gap-2 cursor-pointer">
                          <FaFilePdf />
                          <p>Pdf</p>
                        </li>
                        <li onClick={() => handleDownloadSalesReport('excel')} className="pt-2 px-2 flex items-center gap-2 cursor-pointer">
                          <FaFileExcel />
                          <p>Excel</p>
                        </li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <DateFilter
              filter={filter}
              setFilter={setFilter}
            />
          </div>
        </div>
        <div className="flex gap-4 pt-4">
          <div className="w-full">
            <div className="flex gap-4">
              <CountCard title="Total Customers" count={String(totalCustomers)} Icon={FaUsers} />
              <CountCard title="Total Orders" count={String(orders.length)} Icon={RiShoppingBag3Line} />
              <CountCard title="Total Revenue" count={String('₹' + totalRevenue)} Icon={RiMoneyDollarCircleFill} />
              <CountCard title="Total Products" count={(String(totalProducts))} Icon={FaBox} />
              <CountCard title="Products Sold" count={(String(totalProductsSold))} Icon={FaBox} />
            </div>
            <div className="flex w-full gap-4">
              <BarChartComponent
                chartData={chartData}
                filter={chartFilter}
                setFilter={setChartFilter}
                chartMetaData={{
                  label: 'Revenue',
                  XAxis: chartFilter.period,
                  YAxis: 'revenue'
                }}
              />
              <RadarChartComponent />
            </div>
          </div>
          <Card className="border bg-stone-100 border-stone-200 shadow-lg rounded-lg max-w-[424px] w-full">
            <CardHeader>
              <CardTitle>Top 10 Categories</CardTitle>
              <CardContent>
              </CardContent>
            </CardHeader>
          </Card>
        </div>
        <div className="pt-4 flex gap-4">
          <Card className="w-full">
            <CardHeader>
              <CardTitle>Recent orders</CardTitle>
            </CardHeader>
            <CardContent onClick={() => window.print()}>
              <ScrollArea className='h-[324px]'>
                <div className="relative overflow-x-auto overflow-y-auto shadow-xl mt-4 bg-neutral-200 rounded-lg">
                  <OrderTable
                    orders={orders}
                    filter={filter}
                  />
                </div>
                <ScrollBar orientation="vertical"
                />
              </ScrollArea>
            </CardContent>
          </Card>
          <Card className="max-w-[424px] w-full">
            <CardHeader>
              <CardTitle>Top 10 Products</CardTitle>
            </CardHeader>
            <CardContent>
              <ScrollArea className='max-w-full whitespace-nowrap'>
                <div className="flex w-full space-x-4">
                  {
                    products.map((product, i) => (
                      <div key={i} className="max-w-[280px]">
                        <ProductCard
                          product={product}
                        />
                      </div>
                    ))
                  }
                </div>
                <ScrollBar orientation="horizontal" />
              </ScrollArea>
            </CardContent>
          </Card>
        </div>
      </div>
    </>
  )
}

export default Overview