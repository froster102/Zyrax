import { FaBox, FaUsers } from "react-icons/fa";
import CountCard from "../../components/CountCard";
import { RiShoppingBag3Line } from "react-icons/ri";
import { RiMoneyDollarCircleFill } from "react-icons/ri";
import RadarChartComponent from "@/components/RadarChartComponent";
import BarChartComponent from "@/components/BarChartComponent";
import { useRef } from "react";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import DateFilter from "@/components/DateFilter";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import OrderTable from "@/components/OrderTable";


function Overview() {
  const printRef = useRef()

  function generatePdf() {
    const element = printRef.current
    html2canvas(element, { scale: 2 }).then((canvas) => {
      const imgData = canvas.toDataURL('image/png')
      const pdf = new jsPDF({
        orientation: 'landscape',
        unit: 'mm',
        format: 'a4',
        putOnlyUsedFonts: true,
        floatPrecision: 16
      })
      const imgWidth = pdf.internal.pageSize.getWidth()
      const imgHeight = (canvas.height * imgWidth) / canvas.width
      pdf.addImage(imgData, 'PNG', 0, 0, imgWidth, imgHeight)
      pdf.save('report.pdf')
    })
  }

  return (
    <>
      <div ref={printRef} className='border-[1px] border-black w-full ml-4 rounded-lg bg-[#F1F1F1] shadow-inner pt-[40px] px-[20px]'>
        <h1 className='text-3xl font-semibold'>Overview</h1>
        <div className="flex w-full justify-end">
          <div>
            <button className="mr-4 text-sm font-medium rounded-md bg-stone-300 px-4 py-2" onClick={generatePdf} >Generate report</button>
            <DateFilter />
          </div>
        </div>
        <div className="flex gap-4 pt-4">
          <div className="w-full">
            <div className="flex gap-4">
              <CountCard title="Total Customers" count={'543,0053'} Icon={FaUsers} />
              <CountCard title="Total Orders" count={'5430,053'} Icon={RiShoppingBag3Line} />
              <CountCard title="Total Revenue" count={'543,0053'} Icon={RiMoneyDollarCircleFill} />
              <CountCard title="Total Products" count={'5430,053'} Icon={FaBox} />
            </div>
            <div className="flex w-full gap-4">
              <BarChartComponent />
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
              <CardContent>
                {/* <OrderTable /> */}
              </CardContent>
            </CardHeader>
          </Card>
          <Card className="max-w-[424px] w-full">
            <CardHeader>
              <CardTitle>Top Products</CardTitle>
            </CardHeader>
          </Card>
        </div>
      </div>
    </>
  )
}

export default Overview