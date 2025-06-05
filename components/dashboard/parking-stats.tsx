"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { Car, MapPin, Users, DollarSign } from "lucide-react"
import { mockParkingStats } from "@/lib/mock-data"

interface ParkingStatsProps {
  isLoading: boolean
}

export function ParkingStats({ isLoading }: ParkingStatsProps) {
  const stats = [
    {
      title: "Total Parking Slots",
      value: mockParkingStats.totalSlots.toLocaleString(),
      icon: MapPin,
      description: "Across all locations",
    },
    {
      title: "Available Slots",
      value: mockParkingStats.availableSlots.toLocaleString(),
      icon: Car,
      description: `${mockParkingStats.occupiedSlots} occupied`,
    },
    {
      title: "Active Users",
      value: mockParkingStats.totalUsers.toLocaleString(),
      icon: Users,
      description: "Registered users",
    },
    {
      title: "Monthly Revenue",
      value: `RWF ${(mockParkingStats.revenue / 1000).toFixed(0)}K`,
      icon: DollarSign,
      description: "This month",
    },
  ]

  if (isLoading) {
    return (
      <>
        {stats.map((_, index) => (
          <Card key={index}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <Skeleton className="h-4 w-32" />
              <Skeleton className="h-4 w-4" />
            </CardHeader>
            <CardContent>
              <Skeleton className="h-8 w-20 mb-1" />
              <Skeleton className="h-3 w-24" />
            </CardContent>
          </Card>
        ))}
      </>
    )
  }

  return (
    <>
      {stats.map((stat, index) => (
        <Card key={index}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
            <stat.icon className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stat.value}</div>
            <p className="text-xs text-muted-foreground">{stat.description}</p>
          </CardContent>
        </Card>
      ))}
    </>
  )
}
