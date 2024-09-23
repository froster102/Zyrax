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

const chartData = [
    { month: "January", desktop: 186 },
    { month: "February", desktop: 305 },
    { month: "March", desktop: 237 },
    { month: "April", desktop: 73 },
    { month: "May", desktop: 209 },
    { month: "June", desktop: 214 },
    { month: "July", desktop: 150 },
    { month: "August", desktop: 190 },
    { month: "September", desktop: 220 },
    { month: "October", desktop: 180 },
    { month: "November", desktop: 240 },
    { month: "December", desktop: 300 },
];

const chartConfig = {
    desktop: {
        label: "Desktop",
        color: "hsl(var(--chart-1))",
    },
};

function BarChartComponent() {
    return (
        <Card className="mt-4 bg-neutral-100 shadow-lg text-black w-full">
            <CardHeader>
                <CardTitle>Revenue Overview</CardTitle>
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
                            dataKey="month"
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
                        <Bar dataKey="desktop" fill="#171717" radius={8} />
                    </BarChart>
                </ChartContainer>
            </CardContent>
        </Card>
    )
}

export default BarChartComponent