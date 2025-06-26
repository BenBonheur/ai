"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { BookingModal } from "@/components/booking/booking-modal"
import { MapPin, Car, Search, Filter, Map } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

interface ParkingLot {
  id: string
  name: string
  address: string
  totalSpaces: number
  availableSpaces: number
  pricePerHour: number
  distance: number
  amenities: string[]
  rating: number
  imageUrl: string
  coordinates: {
    lat: number
    lng: number
  }
}

export default function AvailableParkingPage() {
  const { toast } = useToast()
  const [parkingLots, setParkingLots] = useState<ParkingLot[]>([])
  const [filteredLots, setFilteredLots] = useState<ParkingLot[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [priceFilter, setPriceFilter] = useState("all")
  const [distanceFilter, setDistanceFilter] = useState("all")
  const [selectedLot, setSelectedLot] = useState<ParkingLot | null>(null)
  const [isBookingModalOpen, setIsBookingModalOpen] = useState(false)
  const [viewMode, setViewMode] = useState<"list" | "map">("list")

  // Mock data
  const mockParkingLots: ParkingLot[] = [
    {
      id: "1",
      name: "Kigali Heights Parking",
      address: "KN 4 Ave, Kigali",
      totalSpaces: 150,
      availableSpaces: 45,
      pricePerHour: 500,
      distance: 0.8,
      amenities: ["Security", "CCTV", "24/7 Access"],
      rating: 4.5,
      imageUrl: "/placeholder.svg?height=200&width=300",
      coordinates: { lat: -1.9441, lng: 30.0619 },
    },
    {
      id: "2",
      name: "City Center Mall Parking",
      address: "KN 3 Ave, Kigali",
      totalSpaces: 200,
      availableSpaces: 78,
      pricePerHour: 400,
      distance: 1.2,
      amenities: ["Covered", "Security", "EV Charging"],
      rating: 4.2,
      imageUrl: "/placeholder.svg?height=200&width=300",
      coordinates: { lat: -1.9506, lng: 30.0588 },
    },
    {
      id: "3",
      name: "Kimisagara Parking Lot",
      address: "KG 15 Ave, Kigali",
      totalSpaces: 80,
      availableSpaces: 12,
      pricePerHour: 300,
      distance: 2.1,
      amenities: ["Security", "Motorcycle Parking"],
      rating: 3.8,
      imageUrl: "/placeholder.svg?height=200&width=300",
      coordinates: { lat: -1.9659, lng: 30.0588 },
    },
    {
      id: "4",
      name: "Nyamirambo Commercial Center",
      address: "Nyamirambo, Kigali",
      totalSpaces: 120,
      availableSpaces: 67,
      pricePerHour: 350,
      distance: 3.5,
      amenities: ["Covered", "Security"],
      rating: 4.0,
      imageUrl: "/placeholder.svg?height=200&width=300",
      coordinates: { lat: -1.9706, lng: 30.0343 },
    },
  ]

  useEffect(() => {
    // Simulate API call
    const fetchParkingLots = async () => {
      setIsLoading(true)
      await new Promise((resolve) => setTimeout(resolve, 1000))
      setParkingLots(mockParkingLots)
      setFilteredLots(mockParkingLots)
      setIsLoading(false)
    }

    fetchParkingLots()
  }, [])

  useEffect(() => {
    let filtered = parkingLots.filter(
      (lot) =>
        lot.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        lot.address.toLowerCase().includes(searchTerm.toLowerCase()),
    )

    if (priceFilter !== "all") {
      if (priceFilter === "low") {
        filtered = filtered.filter((lot) => lot.pricePerHour <= 350)
      } else if (priceFilter === "medium") {
        filtered = filtered.filter((lot) => lot.pricePerHour > 350 && lot.pricePerHour <= 450)
      } else if (priceFilter === "high") {
        filtered = filtered.filter((lot) => lot.pricePerHour > 450)
      }
    }

    if (distanceFilter !== "all") {
      if (distanceFilter === "near") {
        filtered = filtered.filter((lot) => lot.distance <= 1)
      } else if (distanceFilter === "medium") {
        filtered = filtered.filter((lot) => lot.distance > 1 && lot.distance <= 3)
      } else if (distanceFilter === "far") {
        filtered = filtered.filter((lot) => lot.distance > 3)
      }
    }

    setFilteredLots(filtered)
  }, [searchTerm, priceFilter, distanceFilter, parkingLots])

  const handleBooking = (lot: ParkingLot) => {
    setSelectedLot(lot)
    setIsBookingModalOpen(true)
  }

  const handleBookingSuccess = () => {
    toast({
      title: "Booking Successful",
      description: "Your parking space has been reserved successfully!",
    })
    setIsBookingModalOpen(false)
    setSelectedLot(null)
  }

  if (isLoading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
          <p className="mt-2 text-sm text-muted-foreground">Loading parking lots...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Available Parking</h2>
          <p className="text-muted-foreground">Find and book parking spaces in Kigali</p>
        </div>
        <div className="flex gap-2">
          <Button variant={viewMode === "list" ? "default" : "outline"} onClick={() => setViewMode("list")}>
            <Filter className="mr-2 h-4 w-4" />
            List View
          </Button>
          <Button variant={viewMode === "map" ? "default" : "outline"} onClick={() => setViewMode("map")}>
            <Map className="mr-2 h-4 w-4" />
            Map View
          </Button>
        </div>
      </div>

      <div className="flex flex-col gap-4 md:flex-row md:items-center">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search by name or location..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        <Select value={priceFilter} onValueChange={setPriceFilter}>
          <SelectTrigger className="w-full md:w-[180px]">
            <SelectValue placeholder="Price Range" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Prices</SelectItem>
            <SelectItem value="low">Low (&lt; 350 RWF/hr)</SelectItem>
            <SelectItem value="medium">Medium (350-450 RWF/hr)</SelectItem>
            <SelectItem value="high">High (&gt; 450 RWF/hr)</SelectItem>
          </SelectContent>
        </Select>
        <Select value={distanceFilter} onValueChange={setDistanceFilter}>
          <SelectTrigger className="w-full md:w-[180px]">
            <SelectValue placeholder="Distance" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Distances</SelectItem>
            <SelectItem value="near">Near (&lt; 1 km)</SelectItem>
            <SelectItem value="medium">Medium (1-3 km)</SelectItem>
            <SelectItem value="far">Far (&gt; 3 km)</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {viewMode === "map" && (
        <Card>
          <CardHeader>
            <CardTitle>Parking Locations Map</CardTitle>
            <CardDescription>Interactive map showing available parking lots</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[400px] bg-muted rounded-lg flex items-center justify-center">
              <div className="text-center">
                <Map className="mx-auto h-12 w-12 text-muted-foreground" />
                <p className="mt-2 text-sm text-muted-foreground">Interactive map would be displayed here</p>
                <p className="text-xs text-muted-foreground">Integration with mapping service required</p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {viewMode === "list" && (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {filteredLots.map((lot) => (
            <Card key={lot.id} className="overflow-hidden">
              <div className="aspect-video relative">
                <img src={lot.imageUrl || "/placeholder.svg"} alt={lot.name} className="object-cover w-full h-full" />
                <div className="absolute top-2 right-2">
                  <Badge
                    variant={
                      lot.availableSpaces > 20 ? "default" : lot.availableSpaces > 5 ? "secondary" : "destructive"
                    }
                  >
                    {lot.availableSpaces} available
                  </Badge>
                </div>
              </div>
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle className="text-lg">{lot.name}</CardTitle>
                    <CardDescription className="flex items-center mt-1">
                      <MapPin className="mr-1 h-3 w-3" />
                      {lot.address}
                    </CardDescription>
                  </div>
                  <div className="text-right">
                    <div className="text-lg font-bold">{lot.pricePerHour} RWF</div>
                    <div className="text-xs text-muted-foreground">per hour</div>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center justify-between text-sm">
                    <div className="flex items-center">
                      <Car className="mr-1 h-3 w-3" />
                      {lot.availableSpaces}/{lot.totalSpaces} spaces
                    </div>
                    <div className="flex items-center">
                      <MapPin className="mr-1 h-3 w-3" />
                      {lot.distance} km away
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-1">
                    {lot.amenities.slice(0, 3).map((amenity) => (
                      <Badge key={amenity} variant="outline" className="text-xs">
                        {amenity}
                      </Badge>
                    ))}
                  </div>

                  <Button className="w-full" onClick={() => handleBooking(lot)} disabled={lot.availableSpaces === 0}>
                    {lot.availableSpaces === 0 ? "Full" : "Book Now"}
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {filteredLots.length === 0 && !isLoading && (
        <div className="text-center py-12">
          <Car className="mx-auto h-12 w-12 text-muted-foreground" />
          <h3 className="mt-4 text-lg font-semibold">No parking lots found</h3>
          <p className="text-muted-foreground">Try adjusting your search criteria</p>
        </div>
      )}

      {selectedLot && (
        <BookingModal
          isOpen={isBookingModalOpen}
          onClose={() => setIsBookingModalOpen(false)}
          parkingLot={selectedLot}
          onBookingSuccess={handleBookingSuccess}
        />
      )}
    </div>
  )
}
