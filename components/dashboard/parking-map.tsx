"use client"

import { useEffect, useRef, useState } from "react"
import { Skeleton } from "@/components/ui/skeleton"

interface ParkingMapProps {
  isLoading: boolean
}

export function ParkingMap({ isLoading }: ParkingMapProps) {
  const mapRef = useRef<HTMLDivElement>(null)
  const [mapLoaded, setMapLoaded] = useState(false)

  useEffect(() => {
    if (isLoading) return

    // This is a placeholder for the actual map implementation
    // In a real app, you would use Google Maps or Leaflet
    const timer = setTimeout(() => {
      setMapLoaded(true)
    }, 1000)

    return () => clearTimeout(timer)
  }, [isLoading])

  if (isLoading) {
    return <Skeleton className="h-[400px] w-full" />
  }

  return (
    <div className="relative h-[400px] w-full overflow-hidden rounded-b-lg">
      {!mapLoaded ? (
        <div className="flex h-full w-full items-center justify-center bg-muted">
          <p className="text-muted-foreground">Loading map...</p>
        </div>
      ) : (
        <div className="h-full w-full bg-[#e5e3df]" ref={mapRef}>
          {/* Map placeholder with some markers */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="relative h-full w-full">
              <div className="absolute left-1/4 top-1/3 h-4 w-4 rounded-full bg-primary shadow-lg"></div>
              <div className="absolute left-1/2 top-1/2 h-4 w-4 rounded-full bg-primary shadow-lg"></div>
              <div className="absolute left-2/3 top-1/4 h-4 w-4 rounded-full bg-primary shadow-lg"></div>
              <div className="absolute left-3/4 top-2/3 h-4 w-4 rounded-full bg-primary shadow-lg"></div>
              <div className="absolute left-1/5 top-3/4 h-4 w-4 rounded-full bg-primary shadow-lg"></div>
              <div className="absolute inset-0 flex items-center justify-center">
                <p className="rounded-md bg-background/80 p-2 text-sm font-medium shadow-md">Rwanda Parking Map</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
