"use client"

import { Skeleton } from "@/components/ui/skeleton"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts"

interface RevenueChartProps {
  isLoading: boolean
}

export function RevenueChart({ isLoading }: RevenueChartProps) {
  // Generate mock data for the past 30 days
  const generateData = () => {
    const data = []
    const now = new Date()
    for (let i = 29; i >= 0; i--) {
      const date = new Date(now)
      date.setDate(date.getDate() - i)

      // Generate random revenue between 50,000 and 200,000 RWF
      const revenue = Math.floor(Math.random() * 150000) + 50000

      data.push({
        date: date.toLocaleDateString("en-US", { month: "short", day: "numeric" }),
        revenue,
      })
    }
    return data
  }

  const data = generateData()

  if (isLoading) {
    return <Skeleton className="h-[350px] w-full" />
  }

  return (
    <div className="h-[350px] w-full">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart
          data={data}
          margin={{
            top: 5,
            right: 30,
            left: 20,
            bottom: 5,
          }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="date" tick={{ fontSize: 12 }} tickFormatter={(value) => value.split(" ")[1]} />
          <YAxis
            tick={{ fontSize: 12 }}
            tickFormatter={(value) => `${value / 1000}k`}
            label={{
              value: "RWF",
              angle: -90,
              position: "insideLeft",
              style: { textAnchor: "middle" },
            }}
          />
          <Tooltip
            formatter={(value) => [`RWF ${value.toLocaleString()}`, "Revenue"]}
            labelFormatter={(label) => `Date: ${label}`}
          />
          <Line
            type="monotone"
            dataKey="revenue"
            stroke="#3b82f6"
            strokeWidth={2}
            dot={{ r: 2 }}
            activeDot={{ r: 6 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  )
}
