import { PolarAngleAxis, PolarGrid, Radar, RadarChart } from "recharts"

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

export const description = "A radar chart with a custom grid"

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
        label: "Visits",
        color: "hsl(var(--chart-1))",
    },
}

function RadarChartComponent() {
    return (
        <Card className="mt-4 bg-neutral-100 shadow-lg text-black w-full">
            <CardHeader>
                <CardTitle className='flex justify-between items-center'>
                    <p>Visits</p>
                    <div>
                        <button className="text-xs bg-neutral-300 rounded-md font-medium p-1">Weekly</button>
                        <button className="text-xs bg-neutral-300 rounded-md font-medium p-1 ml-2">Monthly</button>
                    </div>
                </CardTitle>
                <CardDescription>
                    Showing total visitors for the last 6 months
                </CardDescription>
            </CardHeader>
            <CardContent className="pb-0">
                <ChartContainer
                    config={chartConfig}
                    className="mx-auto aspect-square max-h-[250px]"
                >
                    <RadarChart data={chartData}>
                        <ChartTooltip
                            cursor={false}
                            content={<ChartTooltipContent hideLabel />}
                        />
                        <PolarGrid stroke="#d4d4d4" strokeWidth={1} />
                        <PolarAngleAxis dataKey="month" tickFormatter={v => v.slice(0, 3)} />
                        <Radar
                            dataKey="desktop"
                            fill="#171717"
                            fillOpacity={0.6}
                        />
                    </RadarChart>
                </ChartContainer>
            </CardContent>
        </Card>
    )
}

export default RadarChartComponent