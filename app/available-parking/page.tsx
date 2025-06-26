"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { MapPin, Clock, Car, Search, Map } from "lucide-react"
import BookingModal from "@/components/booking/booking-modal"

interface ParkingLot {
  id: string
  name: string
  address: string
  pricePerHour: number
  pricePerDay: number
  availableSlots: number
  totalSlots: number
  operatingHours: {
    open: string
    close: string
  }
  distance: number
  amenities: string[]
  rating: number
  image: string
}

const mockParkingLots: ParkingLot[] = [
  {
    id: "1",
    name: "Kigali City Center Parking",
    address: "KN 3 Ave, Kigali",
    pricePerHour: 500,
    pricePerDay: 8000,
    availableSlots: 45,
    totalSlots: 100,
    operatingHours: { open: "06:00", close: "22:00" },
    distance: 0.5,
    amenities: ["Security", "CCTV", "Covered"],
    rating: 4.5,
    image: "/placeholder.svg?height=200&width=300",
  },
  {
    id: "2",
    name: "Nyarugenge Mall Parking",
    address: "KG 9 Ave, Nyarugenge",
    pricePerHour: 400,
    pricePerDay: 6000,
    availableSlots: 23,
    totalSlots: 80,
    operatingHours: { open: "07:00", close: "21:00" },
    distance: 1.2,
    amenities: ["Security", "Shopping Mall Access"],
    rating: 4.2,
    image: "/placeholder.svg?height=200&width=300",
  },
  {
    id: "3",
    name: "Kimisagara Business Park",
    address: "KG 15 Ave, Kimisagara",
    pricePerHour: 600,
    pricePerDay: 10000,
    availableSlots: 12,
    totalSlots: 60,
    operatingHours: { open: "05:00", close: "23:00" },
    distance: 2.1,
    amenities: ["Security", "CCTV", "Covered", "EV Charging"],
    rating: 4.8,
    image: "/placeholder.svg?height=200&width=300",
  },
  {
    id: "4",
    name: "Remera Taxi Park",
    address: "KG 5 Ave, Remera",
    pricePerHour: 300,
    pricePerDay: 4500,
    availableSlots: 67,
    totalSlots: 120,
    operatingHours: { open: "24/7", close: "24/7" },
    distance: 3.5,
    amenities: ["Security", "24/7 Access"],
    rating: 3.9,
    image: "/placeholder.svg?height=200&width=300",
  },
]

const mockUser = {
  id: "1",
  name: "John Doe",
  email: "john@example.com",
  role: "client",
}

export default function AvailableParkingPage() {
  const [parkingLots, setParkingLots] = useState<ParkingLot[]>(mockParkingLots)
  const [filteredLots, setFilteredLots] = useState<ParkingLot[]>(mockParkingLots)
  const [searchTerm, setSearchTerm] = useState("")
  const [priceFilter, setPriceFilter] = useState("all")
  const [distanceFilter, setDistanceFilter] = useState("all")
  const [selectedLot, setSelectedLot] = useState<ParkingLot | null>(null)
  const [isBookingModalOpen, setIsBookingModalOpen] = useState(false)
  const [viewMode, setViewMode] = useState<"list" | "map">("list")

  useEffect(() => {
    let filtered = parkingLots

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(
        (lot) =>
          lot.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          lot.address.toLowerCase().includes(searchTerm.toLowerCase()),
      )
    }

    // Price filter
    if (priceFilter !== "all") {
      filtered = filtered.filter((lot) => {
        if (priceFilter === "low") return lot.pricePerHour <= 400
        if (priceFilter === "medium") return lot.pricePerHour > 400 && lot.pricePerHour <= 600
        if (priceFilter === "high") return lot.pricePerHour > 600
        return true
      })
    }

    // Distance filter
    if (distanceFilter !== "all") {
      filtered = filtered.filter((lot) => {
        if (distanceFilter === "near") return lot.distance <= 1
        if (distanceFilter === "medium") return lot.distance > 1 && lot.distance <= 3
        if (distanceFilter === "far") return lot.distance > 3
        return true
      })
    }

    setFilteredLots(filtered)
  }, [searchTerm, priceFilter, distanceFilter, parkingLots])

  const handleBookNow = (lot: ParkingLot) => {
    setSelectedLot(lot)
    setIsBookingModalOpen(true)
  }

  const handleCloseBookingModal = () => {
    setIsBookingModalOpen(false)
    setSelectedLot(null)
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Available Parking Lots</h1>
        <p className="text-muted-foreground">Find and book parking spaces in Kigali</p>
      </div>

      {/* Search and Filters */}
      <div className="mb-6 space-y-4">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input
              placeholder="Search by name or location..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          <div className="flex gap-2">
            <Select value={priceFilter} onValueChange={setPriceFilter}>
              <SelectTrigger className="w-[140px]">
                <SelectValue placeholder="Price" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Prices</SelectItem>
                <SelectItem value="low">&lt; 400 RWF/hr</SelectItem>
                <SelectItem value="medium">400-600 RWF/hr</SelectItem>
                <SelectItem value="high">&gt; 600 RWF/hr</SelectItem>
              </SelectContent>
            </Select>
            <Select value={distanceFilter} onValueChange={setDistanceFilter}>
              <SelectTrigger className="w-[140px]">
                <SelectValue placeholder="Distance" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Distances</SelectItem>
                <SelectItem value="near">&lt; 1 km</SelectItem>
                <SelectItem value="medium">1-3 km</SelectItem>
                <SelectItem value="far">&gt; 3 km</SelectItem>
              </SelectContent>
            </Select>
            <Button
              variant={viewMode === "map" ? "default" : "outline"}
              size="icon"
              onClick={() => setViewMode(viewMode === "list" ? "map" : "list")}
            >
              <Map className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>

      {/* Results Count */}
      <div className="mb-4">
        <p className="text-sm text-muted-foreground">
          Showing {filteredLots.length} of {parkingLots.length} parking lots
        </p>
      </div>

      {/* Parking Lots Grid */}
      {viewMode === "list" ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredLots.map((lot) => (
            <Card key={lot.id} className="overflow-hidden hover:shadow-lg transition-shadow">
              <div className="aspect-video bg-muted relative">
                <img src={lot.image || "/placeholder.svg"} alt={lot.name} className="w-full h-full object-cover" />
                <Badge className="absolute top-2 right-2 bg-green-500">{lot.availableSlots} available</Badge>
              </div>
              <CardHeader className="pb-3">
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="text-lg">{lot.name}</CardTitle>
                    <CardDescription className="flex items-center gap-1 mt-1">
                      <MapPin className="h-3 w-3" />
                      {lot.address}
                    </CardDescription>
                  </div>
                  <div className="text-right">
                    <div className="text-lg font-bold">{lot.pricePerHour} RWF/hr</div>
                    <div className="text-sm text-muted-foreground">{lot.pricePerDay} RWF/day</div>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="pt-0">
                <div className="space-y-3">
                  <div className="flex items-center justify-between text-sm">
                    <span className="flex items-center gap-1">
                      <Clock className="h-3 w-3" />
                      {lot.operatingHours.open === "24/7"
                        ? "24/7"
                        : `${lot.operatingHours.open} - ${lot.operatingHours.close}`}
                    </span>
                    <span>{lot.distance} km away</span>
                  </div>
                  <div className="flex items-center gap-1 text-sm">
                    <Car className="h-3 w-3" />
                    <span>
                      {lot.availableSlots}/{lot.totalSlots} slots available
                    </span>
                  </div>
                  <div className="flex flex-wrap gap-1">
                    {lot.amenities.map((amenity) => (
                      <Badge key={amenity} variant="secondary" className="text-xs">
                        {amenity}
                      </Badge>
                    ))}
                  </div>
                  <Button onClick={() => handleBookNow(lot)} className="w-full" disabled={lot.availableSlots === 0}>
                    {lot.availableSlots === 0 ? "Fully Booked" : "Book Now"}
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <div className="bg-muted rounded-lg p-8 text-center">
          <Map className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
          <h3 className="text-lg font-semibold mb-2">Map View</h3>
          <p className="text-muted-foreground">Interactive map view will be implemented here</p>
        </div>
      )}

      {/* No Results */}
      {filteredLots.length === 0 && (
        <div className="text-center py-12">
          <div className="text-muted-foreground mb-4">
            <Car className="h-12 w-12 mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">No parking lots found</h3>
            <p>Try adjusting your search criteria or filters</p>
          </div>
          <Button
            variant="outline"
            onClick={() => {
              setSearchTerm("")
              setPriceFilter("all")
              setDistanceFilter("all")
            }}
          >
            Clear Filters
          </Button>
        </div>
      )}

      {/* Booking Modal */}
      {selectedLot && (
        <BookingModal
          isOpen={isBookingModalOpen}
          onClose={handleCloseBookingModal}
          parkingLot={selectedLot}
          user={mockUser}
        />
      )}
    </div>
  )
}
