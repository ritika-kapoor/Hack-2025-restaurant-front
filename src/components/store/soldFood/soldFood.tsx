"use client"

import { TrendingUp } from "lucide-react"
import { Pie, PieChart } from "recharts"

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart"

export const description = "売上個数チャート"

const chartData = [
  { item: "キャベツ", count: 150, fill: "var(--chart-1)" },
  { item: "トマト", count: 100, fill: "var(--chart-2)" },
  { item: "きゅうり", count: 75, fill: "var(--chart-3)" },
]

const chartConfig = {
  count: {
    label: "販売数",
  },
  cabbage: {
    label: "キャベツ",
    color: "var(--chart-1)",
  },
  tomato: {
    label: "トマト", 
    color: "var(--chart-2)",
  },
  cucumber: {
    label: "きゅうり",
    color: "var(--chart-3)",
  },
} satisfies ChartConfig

export default function ChartPieSimple() {
  return (
    <Card className="flex flex-col">
      <CardHeader className="items-center pb-0">
        <CardTitle>野菜別販売数</CardTitle>
        <CardDescription>本日の販売実績</CardDescription>   
      </CardHeader>
      <CardContent className="flex-1 pb-0">
        <ChartContainer
          config={chartConfig}
          className="mx-auto aspect-square max-h-[250px]"
        >
          <PieChart>
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent />}
            />
            <Pie data={chartData} dataKey="count" nameKey="item" />
          </PieChart>
        </ChartContainer>
      </CardContent>
      <CardFooter className="flex-col gap-2 text-sm">
        <div className="flex items-center gap-2 leading-none font-medium">
          先月比 5.2%増加 <TrendingUp className="h-4 w-4" />
        </div>
        <div className="text-muted-foreground leading-none">
          今年の総販売数を表示しています
        </div>
      </CardFooter>
    </Card>
  )
}
