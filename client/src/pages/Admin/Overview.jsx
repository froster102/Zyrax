import { FaBox, FaUsers } from "react-icons/fa";
import CountCard from "../../components/CountCard";
import { RiShoppingBag3Line } from "react-icons/ri";
import { RiMoneyDollarCircleFill } from "react-icons/ri";
import RadarChartComponent from "@/components/RadarChartComponent";
import BarChartComponent from "@/components/BarChartComponent";
import { useRef, useState } from "react";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import DateFilter from "@/components/DateFilter";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import OrderTable from "@/components/OrderTable";
import { useFetchProductsQuery, useGetAnalyticsGraphDataQuery, useGetOverviewDataQuery } from "@/store/api/adminApiSlice";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import ProductCard from "@/components/ProductCard";

function Overview() {
  const [filter, setFilter] = useState({
    limit: 10,
    period: '',
  })

  const [chartFilter, setChartFilter] = useState({
    period: 'month'
  })

  const revenueChartRef = useRef()

  const { data: {
    totalProducts = 0,
    totalCustomers = 0,
    totalRevenue = 0,
    totalProductsSold = 0,
    totalOfferAmount = 0,
    totalCouponAmount = 0,
    orders = []
  } = {} } = useGetOverviewDataQuery({ filter, sort: '' })
  const { data: { products = [] } = {} } = useFetchProductsQuery({ filter, sort: '' })
  const { data: { chartData = [] } = {} } = useGetAnalyticsGraphDataQuery({ filter: chartFilter, sort: '' })

  function generatePdf() {

    const pdf = new jsPDF({
      orientation: 'landscape',
      unit: 'mm',
      format: 'a4',
      putOnlyUsedFonts: true,
      floatPrecision: 16
    })

    pdf.setFontSize(25)
    pdf.text('Sales Report', 10, 10)

    pdf.setFontSize(14)
    pdf.text(`Total Products: ${totalProducts}`, 10, 30)
    pdf.text(`Total Customers: ${totalCustomers}`, 10, 40)
    pdf.text(`Total Revenue: ${totalRevenue}`, 10, 50)
    pdf.text(`Total Products Sold: ${totalProductsSold}`, 10, 60)
    pdf.text(`Total Offer Amount: ${totalOfferAmount}`, 10, 70)
    pdf.text(`Total Coupon Amount: ${totalCouponAmount}`, 10, 80)

    pdf.text('Orders', 10, 100)

    const startY = 110
    const rowHeight = 10

    pdf.setFontSize(12);
    const headers = ['Order ID', 'Total Amount', 'Status', 'Date'];
    const headerWidths = [40, 40, 40, 40];

    headers.forEach((header, index) => {
      pdf.text(header, 10 + index * headerWidths[index], startY);
    });

    orders.forEach((order, index) => {
      const yPosition = startY + (index + 1) * rowHeight;
      pdf.text(order.orderId, 10, yPosition);
      pdf.text(`${order.totalAmount}`, 10 + headerWidths[0], yPosition);
      pdf.text(order.status, 10 + headerWidths[0] + headerWidths[1], yPosition);
      pdf.text(new Date(order.createdAt).toLocaleDateString(), 10 + headerWidths[0] + headerWidths[1] + headerWidths[2], yPosition);
    });

    pdf.save('report.pdf')
  }

  return (
    <>
      <div className='border-[1px] border-black w-full ml-4 rounded-lg bg-[#F1F1F1] shadow-inner pt-[40px] px-[20px] pb-10'>
        <h1 className='text-3xl font-semibold'>Overview</h1>
        <div className="flex w-full justify-end">
          <div>
            <button className="mr-4 text-sm font-medium rounded-md bg-stone-300 px-4 py-2" onClick={generatePdf} >Generate report</button>
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
            <div ref={revenueChartRef} className="flex w-full gap-4">
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
              <CardTitle>Notifications</CardTitle>
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
            <CardContent>
              <ScrollArea className='h-[324px]'>
                <div className="relative overflow-x-auto shadow-xl mt-4 bg-neutral-200 rounded-lg">
                  <OrderTable
                    orders={orders}
                  />
                </div>
                <ScrollBar orientation="vertical"
                />
              </ScrollArea>
            </CardContent>
          </Card>
          <Card className="max-w-[424px] w-full">
            <CardHeader>
              <CardTitle>Top Products</CardTitle>
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