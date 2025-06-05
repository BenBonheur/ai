"use client"

import { useEffect, useRef, useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { MapPin, Navigation, Star, CreditCard } from "lucide-react"

interface ParkingLot {
  id: string
  name: string
  location: string
  address: string
  latitude: number
  longitude: number
  totalSlots: number
  availableSlots: number
  pricePerHour: number
  rating: number
  distance: number
}

interface ParkingMapProps {
  parkingLots: ParkingLot[]
  onSelectLot: (lot: ParkingLot) => void
}

export function ParkingMap({ parkingLots, onSelectLot }: ParkingMapProps) {
  const mapRef = useRef<HTMLDivElement>(null)
  const [selectedLot, setSelectedLot] = useState<ParkingLot | null>(null)
  const [mapLoaded, setMapLoaded] = useState(false)

  useEffect(() => {
    // Simulate map loading
    const timer = setTimeout(() => {
      setMapLoaded(true)
    }, 1000)

    return () => clearTimeout(timer)
  }, [])

  const getAvailabilityColor = (availableSlots: number, totalSlots: number) => {
    if (availableSlots === 0) return "bg-red-500"
    const percentage = (availableSlots / totalSlots) * 100
    if (percentage <= 20) return "bg-orange-500"
    if (percentage <= 50) return "bg-yellow-500"
    return "bg-green-500"
  }

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`h-3 w-3 ${i < Math.floor(rating) ? "fill-yellow-400 text-yellow-400" : "text-gray-300"}`}
      />
    ))
  }

  if (!mapLoaded) {
    return (
      <div className="h-[600px] flex items-center justify-center bg-muted">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
          <p className="mt-2 text-sm text-muted-foreground">Loading map...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="relative h-[600px] bg-[#e5e3df] overflow-hidden">
      {/* Map Background */}
      <div className="absolute inset-0">
        <div className="w-full h-full bg-gradient-to-br from-green-100 to-blue-100 opacity-50"></div>

        {/* Parking Lot Markers */}
        {parkingLots.map((lot, index) => {
          const availabilityColor = getAvailabilityColor(lot.availableSlots, lot.totalSlots)
          // Position markers based on a grid layout for demo
          const positions = [
            { top: "20%", left: "25%" },
            { top: "35%", left: "60%" },
            { top: "55%", left: "30%" },
            { top: "45%", left: "75%" },
            { top: "70%", left: "20%" },
            { top: "25%", left: "80%" },
          ]
          const position = positions[index % positions.length]

          return (
            <div
              key={lot.id}
              className="absolute transform -translate-x-1/2 -translate-y-1/2 cursor-pointer"
              style={{ top: position.top, left: position.left }}
              onClick={() => setSelectedLot(lot)}
            >
              <div
                className={`w-6 h-6 rounded-full ${availabilityColor} border-2 border-white shadow-lg hover:scale-110 transition-transform`}
              >
                <div className="w-full h-full rounded-full flex items-center justify-center">
                  <MapPin className="h-3 w-3 text-white" />
                </div>
              </div>
              {/* Availability indicator */}
              <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-white px-2 py-1 rounded text-xs font-medium shadow-md whitespace-nowrap">
                {lot.availableSlots} spots
              </div>
            </div>
          )
        })}

        {/* Map Legend */}
        <div className="absolute top-4 right-4 bg-white p-3 rounded-lg shadow-md">
          <h4 className="font-medium text-sm mb-2">Availability</h4>
          <div className="space-y-1">
            <div className="flex items-center gap-2 text-xs">
              <div className="w-3 h-3 bg-green-500 rounded-full"></div>
              <span>Available (50%+)</span>
            </div>
            <div className="flex items-center gap-2 text-xs">
              <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
              <span>Limited (20-50%)</span>
            </div>
            <div className="flex items-center gap-2 text-xs">
              <div className="w-3 h-3 bg-orange-500 rounded-full"></div>
              <span>Almost Full (1-20%)</span>
            </div>
            <div className="flex items-center gap-2 text-xs">
              <div className="w-3 h-3 bg-red-500 rounded-full"></div>
              <span>Full</span>
            </div>
          </div>
        </div>

        {/* Selected Lot Details */}
        {selectedLot && (
          <div className="absolute bottom-4 left-4 right-4 md:left-4 md:right-auto md:w-80">
            <Card>
              <CardContent className="p-4">
                <div className="space-y-3">
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="font-semibold">{selectedLot.name}</h3>
                      <div className="flex items-center gap-1 text-sm text-muted-foreground">
                        <MapPin className="h-3 w-3" />
                        <span>{selectedLot.address}</span>
                      </div>
                      <div className="flex items-center gap-1 mt-1">
                        {renderStars(selectedLot.rating)}
                        <span className="text-xs text-muted-foreground ml-1">({selectedLot.rating})</span>
                      </div>
                    </div>
                    <Button size="sm" variant="ghost" onClick={() => setSelectedLot(null)}>
                      ×
                    </Button>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="flex items-center gap-1">
                        <div
                          className={`w-3 h-3 rounded-full ${getAvailabilityColor(selectedLot.availableSlots, selectedLot.totalSlots)}`}
                        ></div>
                        <span className="text-sm font-medium">
                          {selectedLot.availableSlots} of {selectedLot.totalSlots} spots
                        </span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Navigation className="h-3 w-3 text-muted-foreground" />
                        <span className="text-sm text-muted-foreground">{selectedLot.distance} km</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1">
                      <CreditCard className="h-4 w-4 text-muted-foreground" />
                      <span className="font-semibold">RWF {selectedLot.pricePerHour}/hr</span>
                    </div>
                    <Button
                      size="sm"
                      onClick={() => onSelectLot(selectedLot)}
                      disabled={selectedLot.availableSlots === 0}
                    >
                      {selectedLot.availableSlots === 0 ? "Full" : "Book Now"}
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  )
}
