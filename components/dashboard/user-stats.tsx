"use client"

import { Skeleton } from "@/components/ui/skeleton"
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from "recharts"

interface UserStatsProps {
  isLoading: boolean
}

export function UserStats({ isLoading }: UserStatsProps) {
  const data = [
    { name: "Clients", value: 2800, color: "#3b82f6" },
    { name: "Owners", value: 120, color: "#10b981" },
    { name: "Employees", value: 500, color: "#f59e0b" },
    { name: "Admins", value: 36, color: "#6366f1" },
  ]

  if (isLoading) {
    return <Skeleton className="h-[250px] w-full" />
  }

  return (
    <div className="h-[250px] w-full">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            labelLine={false}
            outerRadius={80}
            fill="#8884d8"
            dataKey="value"
            label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
          >
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.color} />
            ))}
          </Pie>
          <Tooltip formatter={(value) => [`${value} users`, "Count"]} />
          <Legend />
        </PieChart>
      </ResponsiveContainer>
    </div>
  )
}
