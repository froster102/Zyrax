import { useState } from "react"
import { CalendarIcon } from "lucide-react"
import { format } from "date-fns"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuLabel,
    DropdownMenuRadioGroup,
    DropdownMenuRadioItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover"
import PropTypes from "prop-types"

function DateFilter({ filter, setFilter }) {
    const [date, setDate] = useState({ from: '', to: '' })

    function handlePeriodChange(period) {
        setFilter(prev => ({
            ...prev,
            period: period
        }))
    }

    function handleDateRangeChange(dateRange) {
        setDate(dateRange)
        if (date?.from && date?.to) {
            setFilter({
                startDate: date.from.toISOString(),
                endDate: date.to.toISOString()
            })
        }
    }

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button className="bg-stone-300" variant="outline">Filter By Date</Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56">
                <DropdownMenuLabel>Select an option</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuRadioGroup value={filter.period} onValueChange={handlePeriodChange}>
                    <DropdownMenuRadioItem value="lastDay">Last day</DropdownMenuRadioItem>
                    <DropdownMenuRadioItem value="lastWeek">Last Week</DropdownMenuRadioItem>
                    <DropdownMenuRadioItem value="lastMonth">Last Month</DropdownMenuRadioItem>
                    <DropdownMenuRadioItem value="lastYear">Last Year</DropdownMenuRadioItem>
                    <DropdownMenuSeparator />
                    <Popover>
                        <PopoverTrigger asChild>
                            <Button
                                id="date"
                                variant={"outline"}
                                className={cn(
                                    "w-full justify-start text-left font-normal",
                                    !date && "text-muted-foreground"
                                )}
                            >
                                <CalendarIcon className="mr-2 h-4 w-4" />
                                {date?.from ? (
                                    date.to ? (
                                        <>
                                            {format(date.from, "LLL dd, y")} -{" "}
                                            {format(date.to, "LLL dd, y")}
                                        </>
                                    ) : (
                                        format(date.from, "LLL dd, y")
                                    )
                                ) : (
                                    <span>Pick a date range</span>
                                )}
                            </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="start">
                            <Calendar
                                initialFocus
                                mode="range"
                                defaultMonth={date?.from}
                                selected={date}
                                onSelect={handleDateRangeChange}
                                numberOfMonths={1}
                            />
                        </PopoverContent>
                    </Popover>
                </DropdownMenuRadioGroup>
            </DropdownMenuContent>
        </DropdownMenu>
    )
}

DateFilter.propTypes = {
    filter: PropTypes.object,
    setFilter: PropTypes.func
}

export default DateFilter