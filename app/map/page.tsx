"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { MapPin, Navigation, Star, Clock, Car } from "lucide-react"

// Mock parking lots data
const mockParkingLots = [
  {
    id: 1,
    name: "Kigali Heights Parking",
    location: "Kigali City Center",
    address: "KG 7 Ave, Kigali",
    latitude: -1.9441,
    longitude: 30.0619,
    availableSlots: 45,
    totalSlots: 120,
    pricePerHour: 500,
    rating: 4.5,
    distance: 0.8,
    amenities: ["Security", "CCTV", "24/7 Access"],
  },
  {
    id: 2,
    name: "Kimisagara Mall Parking",
    location: "Kimisagara",
    address: "KG 11 Ave, Kigali",
    latitude: -1.9506,
    longitude: 30.0588,
    availableSlots: 23,
    totalSlots: 80,
    pricePerHour: 400,
    rating: 4.2,
    distance: 1.2,
    amenities: ["Security", "Covered"],
  },
  {
    id: 3,
    name: "Nyamirambo Parking",
    location: "Nyamirambo",
    address: "KG 15 Ave, Kigali",
    latitude: -1.9667,
    longitude: 30.0444,
    availableSlots: 12,
    totalSlots: 60,
    pricePerHour: 300,
    rating: 4.0,
    distance: 2.1,
    amenities: ["Security"],
  },
]

export default function MapPage() {
  const [selectedLot, setSelectedLot] = useState<number | null>(null)
  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>(null)

  useEffect(() => {
    // Get user's current location
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          })
        },
        (error) => {
          console.log("Error getting location:", error)
          // Default to Kigali center
          setUserLocation({ lat: -1.9441, lng: 30.0619 })
        },
      )
    }
  }, [])

  const handleBookNow = (lotId: number) => {
    // Navigate to booking page
    window.location.href = `/booking/${lotId}`
  }

  const getAvailabilityColor = (available: number, total: number) => {
    const percentage = (available / total) * 100
    if (percentage > 50) return "bg-green-500"
    if (percentage > 20) return "bg-yellow-500"
    return "bg-red-500"
  }

  return (
    <div className="container mx-auto p-4 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Find Parking</h1>
        <Button variant="outline" className="flex items-center gap-2">
          <Navigation className="h-4 w-4" />
          My Location
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Map Placeholder */}
        <Card className="lg:col-span-1">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MapPin className="h-5 w-5" />
              Interactive Map
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="bg-gray-100 rounded-lg h-96 flex items-center justify-center">
              <div className="text-center text-gray-500">
                <MapPin className="h-12 w-12 mx-auto mb-2" />
                <p>Interactive map will be displayed here</p>
                <p className="text-sm">Showing parking lots near you</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Parking Lots List */}
        <div className="space-y-4">
          <h2 className="text-xl font-semibold">Available Parking Lots</h2>

          {mockParkingLots.map((lot) => (
            <Card
              key={lot.id}
              className={`cursor-pointer transition-all ${selectedLot === lot.id ? "ring-2 ring-blue-500" : ""}`}
              onClick={() => setSelectedLot(lot.id)}
            >
              <CardContent className="p-4">
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <h3 className="font-semibold text-lg">{lot.name}</h3>
                    <p className="text-gray-600 text-sm">{lot.address}</p>
                  </div>
                  <div className="text-right">
                    <div className="flex items-center gap-1 mb-1">
                      <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                      <span className="text-sm">{lot.rating}</span>
                    </div>
                    <p className="text-xs text-gray-500">{lot.distance} km away</p>
                  </div>
                </div>

                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <Car className="h-4 w-4" />
                    <span className="text-sm">
                      {lot.availableSlots}/{lot.totalSlots} available
                    </span>
                    <div
                      className={`w-2 h-2 rounded-full ${getAvailabilityColor(lot.availableSlots, lot.totalSlots)}`}
                    />
                  </div>
                  <div className="text-right">
                    <p className="font-semibold">RWF {lot.pricePerHour}/hr</p>
                  </div>
                </div>

                <div className="flex flex-wrap gap-1 mb-3">
                  {lot.amenities.map((amenity) => (
                    <Badge key={amenity} variant="secondary" className="text-xs">
                      {amenity}
                    </Badge>
                  ))}
                </div>

                <div className="flex gap-2">
                  <Button
                    className="flex-1"
                    onClick={(e) => {
                      e.stopPropagation()
                      handleBookNow(lot.id)
                    }}
                  >
                    Book Now
                  </Button>
                  <Button variant="outline" size="sm">
                    <Navigation className="h-4 w-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-4 text-center">
            <Car className="h-8 w-8 mx-auto mb-2 text-blue-500" />
            <p className="text-2xl font-bold">{mockParkingLots.reduce((sum, lot) => sum + lot.availableSlots, 0)}</p>
            <p className="text-sm text-gray-600">Available Spots</p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4 text-center">
            <MapPin className="h-8 w-8 mx-auto mb-2 text-green-500" />
            <p className="text-2xl font-bold">{mockParkingLots.length}</p>
            <p className="text-sm text-gray-600">Parking Lots</p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4 text-center">
            <Clock className="h-8 w-8 mx-auto mb-2 text-orange-500" />
            <p className="text-2xl font-bold">RWF 400</p>
            <p className="text-sm text-gray-600">Avg. Price/Hour</p>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
