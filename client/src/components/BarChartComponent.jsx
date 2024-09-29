import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from "recharts"
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import {
    ChartContainer,
    ChartTooltip,
    ChartTooltipContent,
} from "@/components/ui/chart"
import PropTypes from "prop-types";


function BarChartComponent({ chartData, setFilter, chartMetaData }) {

    const chartConfig = {
        desktop: {
            label: chartMetaData?.label||'',
            color: "hsl(var(--chart-1))",
        },
    };

    function filterChange(filter){
        setFilter(prev=>({
            ...prev,
            period : filter
        }))
    }

    return (
        <Card className="mt-4 bg-neutral-100 shadow-lg text-black w-full">
            <CardHeader>
                <CardTitle className='flex justify-between items-center'>
                    <p>Revenue Overview</p>
                    <div>
                        <button onClick={()=>{filterChange('week')}} className="text-xs bg-neutral-300 rounded-md font-medium p-1">Weekly</button>
                        <button onClick={()=>{filterChange('month')}} className="text-xs bg-neutral-300 rounded-md font-medium p-1 ml-2">Monthly</button>
                    </div>
                </CardTitle>
                <CardDescription>
                    Showing total revenue for the last 6 months
                </CardDescription>
            </CardHeader>
            <CardContent>
                <ChartContainer config={chartConfig} className="max-h-[200px] w-full" >
                    <BarChart accessibilityLayer data={chartData}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#737373" vertical={false} />
                        <YAxis />
                        <XAxis
                            dataKey={chartMetaData?.XAxis || ''}
                            tick={{ fill: 'red' }}
                            tickLine={false}
                            tickMargin={10}
                            axisLine={false}
                            tickFormatter={(value) => value.slice(0, 3)}
                        />
                        <ChartTooltip
                            cursor={false}
                            content={<ChartTooltipContent hideLabel />}
                        />
                        <Bar dataKey={chartMetaData?.YAxis || ''} fill="#171717" radius={8} />
                    </BarChart>
                </ChartContainer>
            </CardContent>
        </Card>
    )
}

BarChartComponent.propTypes = {
    chartMetaData: PropTypes.object,
    chartData: PropTypes.array,
    setFilter: PropTypes.func
}

export default BarChartComponent