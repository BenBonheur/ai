"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { useToast } from "@/hooks/use-toast"
import { getCurrentUser } from "@/lib/auth"
import {
  Search,
  MapPin,
  Car,
  Clock,
  CreditCard,
  Filter,
  Calendar,
  Star,
  Navigation,
  Wifi,
  Shield,
  Zap,
} from "lucide-react"
import { ParkingMap } from "@/components/parking/parking-map"
import { BookingModal } from "@/components/booking/booking-modal"

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
  pricePerDay: number
  isActive: boolean
  rating: number
  distance: number
  amenities: string[]
  images: string[]
  description: string
  operatingHours: {
    open: string
    close: string
  }
  owner: string
  features: string[]
}

export default function AvailableParkingPage() {
  const { toast } = useToast()
  const [user, setUser] = useState<any>(null)
  const [parkingLots, setParkingLots] = useState<ParkingLot[]>([])
  const [filteredLots, setFilteredLots] = useState<ParkingLot[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedLot, setSelectedLot] = useState<ParkingLot | null>(null)
  const [showBookingModal, setShowBookingModal] = useState(false)
  const [filters, setFilters] = useState({
    priceRange: "all",
    availability: "all",
    amenities: "all",
    distance: "all",
    rating: "all",
  })
  const [viewMode, setViewMode] = useState<"list" | "map">("list")

  useEffect(() => {
    const fetchData = async () => {
      try {
        const currentUser = await getCurrentUser()
        setUser(currentUser)

        // Simulate API call to fetch parking lots
        await new Promise((resolve) => setTimeout(resolve, 1000))

        const mockParkingLots: ParkingLot[] = [
          {
            id: "1",
            name: "Kigali Heights Parking",
            location: "Kigali City Center",
            address: "KG 7 Ave, Kigali",
            latitude: -1.9441,
            longitude: 30.0619,
            totalSlots: 120,
            availableSlots: 45,
            pricePerHour: 500,
            pricePerDay: 8000,
            isActive: true,
            rating: 4.5,
            distance: 0.8,
            amenities: ["Security", "CCTV", "24/7 Access", "EV Charging"],
            images: ["/placeholder.svg?height=200&width=300"],
            description: "Premium parking facility in the heart of Kigali with modern security systems.",
            operatingHours: { open: "00:00", close: "23:59" },
            owner: "Kigali Heights Ltd",
            features: ["Covered Parking", "Valet Service", "Car Wash"],
          },
          {
            id: "2",
            name: "Kigali Convention Center",
            location: "Kimihurura",
            address: "KG 2 Roundabout, Kimihurura",
            latitude: -1.9355,
            longitude: 30.0928,
            totalSlots: 200,
            availableSlots: 78,
            pricePerHour: 800,
            pricePerDay: 12000,
            isActive: true,
            rating: 4.8,
            distance: 2.1,
            amenities: ["Security", "WiFi", "Restaurant", "EV Charging"],
            images: ["/placeholder.svg?height=200&width=300"],
            description: "Large parking facility at the convention center with excellent amenities.",
            operatingHours: { open: "06:00", close: "22:00" },
            owner: "Rwanda Convention Bureau",
            features: ["Event Parking", "Shuttle Service", "Conference Rates"],
          },
          {
            id: "3",
            name: "Nyamirambo Stadium",
            location: "Nyamirambo",
            address: "Nyamirambo, Kigali",
            latitude: -1.9706,
            longitude: 30.0394,
            totalSlots: 80,
            availableSlots: 12,
            pricePerHour: 300,
            pricePerDay: 4500,
            isActive: true,
            rating: 3.9,
            distance: 3.5,
            amenities: ["Security", "Food Court"],
            images: ["/placeholder.svg?height=200&width=300"],
            description: "Affordable parking near the stadium with basic amenities.",
            operatingHours: { open: "07:00", close: "20:00" },
            owner: "City of Kigali",
            features: ["Event Parking", "Sports Events"],
          },
          {
            id: "4",
            name: "Remera Shopping Mall",
            location: "Remera",
            address: "KK 15 Rd, Remera",
            latitude: -1.9578,
            longitude: 30.1127,
            totalSlots: 60,
            availableSlots: 22,
            pricePerHour: 400,
            pricePerDay: 6000,
            isActive: true,
            rating: 4.2,
            distance: 4.2,
            amenities: ["Security", "Shopping", "WiFi", "Food Court"],
            images: ["/placeholder.svg?height=200&width=300"],
            description: "Convenient parking at the shopping mall with retail access.",
            operatingHours: { open: "08:00", close: "21:00" },
            owner: "Remera Investments Ltd",
            features: ["Shopping Discounts", "Covered Parking"],
          },
          {
            id: "5",
            name: "Kimironko Market",
            location: "Kimironko",
            address: "KG 11 Ave, Kimironko",
            latitude: -1.9403,
            longitude: 30.1059,
            totalSlots: 40,
            availableSlots: 5,
            pricePerHour: 200,
            pricePerDay: 3000,
            isActive: true,
            rating: 3.5,
            distance: 5.1,
            amenities: ["Security", "Market Access"],
            images: ["/placeholder.svg?height=200&width=300"],
            description: "Budget-friendly parking near the local market.",
            operatingHours: { open: "06:00", close: "18:00" },
            owner: "Market Association",
            features: ["Market Parking", "Local Access"],
          },
          {
            id: "6",
            name: "Kigali Airport Parking",
            location: "Kanombe",
            address: "Kigali International Airport",
            latitude: -1.9686,
            longitude: 30.1395,
            totalSlots: 300,
            availableSlots: 156,
            pricePerHour: 1000,
            pricePerDay: 15000,
            isActive: true,
            rating: 4.6,
            distance: 12.8,
            amenities: ["Security", "24/7 Access", "Shuttle", "WiFi"],
            images: ["/placeholder.svg?height=200&width=300"],
            description: "Premium airport parking with shuttle service to terminals.",
            operatingHours: { open: "00:00", close: "23:59" },
            owner: "Rwanda Airports Company",
            features: ["Airport Shuttle", "Long-term Rates", "Premium Security"],
          },
        ]

        setParkingLots(mockParkingLots)
        setFilteredLots(mockParkingLots)
      } catch (error) {
        console.error("Error fetching parking lots:", error)
        toast({
          title: "Error",
          description: "Failed to load parking lots",
          variant: "destructive",
        })
      } finally {
        setIsLoading(false)
      }
    }

    fetchData()
  }, [toast])

  useEffect(() => {
    const filtered = parkingLots.filter((lot) => {
      // Search filter
      const matchesSearch =
        lot.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        lot.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
        lot.address.toLowerCase().includes(searchQuery.toLowerCase())

      // Price filter
      const matchesPrice =
        filters.priceRange === "all" ||
        (filters.priceRange === "budget" && lot.pricePerHour <= 400) ||
        (filters.priceRange === "mid" && lot.pricePerHour > 400 && lot.pricePerHour <= 800) ||
        (filters.priceRange === "premium" && lot.pricePerHour > 800)

      // Availability filter
      const matchesAvailability =
        filters.availability === "all" ||
        (filters.availability === "high" && lot.availableSlots > 20) ||
        (filters.availability === "medium" && lot.availableSlots > 10 && lot.availableSlots <= 20) ||
        (filters.availability === "low" && lot.availableSlots <= 10 && lot.availableSlots > 0)

      // Distance filter
      const matchesDistance =
        filters.distance === "all" ||
        (filters.distance === "near" && lot.distance <= 2) ||
        (filters.distance === "medium" && lot.distance > 2 && lot.distance <= 5) ||
        (filters.distance === "far" && lot.distance > 5)

      // Rating filter
      const matchesRating =
        filters.rating === "all" ||
        (filters.rating === "4+" && lot.rating >= 4) ||
        (filters.rating === "3+" && lot.rating >= 3 && lot.rating < 4)

      return matchesSearch && matchesPrice && matchesAvailability && matchesDistance && matchesRating
    })

    // Sort by availability and rating
    filtered.sort((a, b) => {
      if (a.availableSlots === 0 && b.availableSlots > 0) return 1
      if (b.availableSlots === 0 && a.availableSlots > 0) return -1
      return b.rating - a.rating
    })

    setFilteredLots(filtered)
  }, [parkingLots, searchQuery, filters])

  const getAvailabilityStatus = (availableSlots: number, totalSlots: number) => {
    const percentage = (availableSlots / totalSlots) * 100
    if (availableSlots === 0) return { status: "Full", color: "bg-red-500", textColor: "text-red-700" }
    if (percentage <= 20) return { status: "Almost Full", color: "bg-orange-500", textColor: "text-orange-700" }
    if (percentage <= 50) return { status: "Limited", color: "bg-yellow-500", textColor: "text-yellow-700" }
    return { status: "Available", color: "bg-green-500", textColor: "text-green-700" }
  }

  const handleBookNow = (lot: ParkingLot) => {
    if (lot.availableSlots === 0) {
      toast({
        title: "Parking Full",
        description: "This parking lot is currently full. Please try another location.",
        variant: "destructive",
      })
      return
    }
    setSelectedLot(lot)
    setShowBookingModal(true)
  }

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`h-4 w-4 ${i < Math.floor(rating) ? "fill-yellow-400 text-yellow-400" : "text-gray-300"}`}
      />
    ))
  }

  if (isLoading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
          <p className="mt-2 text-sm text-muted-foreground">Loading available parking...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Available Parking</h2>
          <p className="text-muted-foreground">Find and book parking spaces across Rwanda</p>
        </div>
        <div className="flex gap-2">
          <Button variant={viewMode === "list" ? "default" : "outline"} onClick={() => setViewMode("list")}>
            List View
          </Button>
          <Button variant={viewMode === "map" ? "default" : "outline"} onClick={() => setViewMode("map")}>
            Map View
          </Button>
        </div>
      </div>

      {/* Search and Filters */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Filter className="h-5 w-5" />
            Search & Filters
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center gap-2">
            <Search className="h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search by name, location, or address..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="flex-1"
            />
          </div>

          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            <div>
              <Label htmlFor="price-filter">Price Range</Label>
              <Select
                value={filters.priceRange}
                onValueChange={(value) => setFilters((prev) => ({ ...prev, priceRange: value }))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="All Prices" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Prices</SelectItem>
                  <SelectItem value="budget">Budget (≤ 400 RWF/hr)</SelectItem>
                  <SelectItem value="mid">Mid-range (401-800 RWF/hr)</SelectItem>
                  <SelectItem value="premium">Premium (> 800 RWF/hr)</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="availability-filter">Availability</Label>
              <Select
                value={filters.availability}
                onValueChange={(value) => setFilters((prev) => ({ ...prev, availability: value }))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="All" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All</SelectItem>
                  <SelectItem value="high">High (20+ spots)</SelectItem>
                  <SelectItem value="medium">Medium (10-20 spots)</SelectItem>
                  <SelectItem value="low">Low (1-10 spots)</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="distance-filter">Distance</Label>
              <Select
                value={filters.distance}
                onValueChange={(value) => setFilters((prev) => ({ ...prev, distance: value }))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="All" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Distances</SelectItem>
                  <SelectItem value="near">Nearby (≤ 2 km)</SelectItem>
                  <SelectItem value="medium">Medium (2-5 km)</SelectItem>
                  <SelectItem value="far">Far (> 5 km)</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="rating-filter">Rating</Label>
              <Select
                value={filters.rating}
                onValueChange={(value) => setFilters((prev) => ({ ...prev, rating: value }))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="All" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Ratings</SelectItem>
                  <SelectItem value="4+">4+ Stars</SelectItem>
                  <SelectItem value="3+">3+ Stars</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex items-end">
              <Button
                variant="outline"
                onClick={() => {
                  setFilters({
                    priceRange: "all",
                    availability: "all",
                    amenities: "all",
                    distance: "all",
                    rating: "all",
                  })
                  setSearchQuery("")
                }}
                className="w-full"
              >
                Clear Filters
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Results Summary */}
      <div className="flex items-center justify-between">
        <p className="text-sm text-muted-foreground">
          Showing {filteredLots.length} of {parkingLots.length} parking locations
        </p>
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <div className="flex items-center gap-1">
            <div className="w-3 h-3 bg-green-500 rounded-full"></div>
            <span>Available</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
            <span>Limited</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-3 h-3 bg-red-500 rounded-full"></div>
            <span>Full</span>
          </div>
        </div>
      </div>

      {/* Content based on view mode */}
      {viewMode === "map" ? (
        <Card>
          <CardContent className="p-0">
            <ParkingMap parkingLots={filteredLots} onSelectLot={handleBookNow} />
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4">
          {filteredLots.map((lot) => {
            const availability = getAvailabilityStatus(lot.availableSlots, lot.totalSlots)
            return (
              <Card key={lot.id} className="overflow-hidden">
                <CardContent className="p-6">
                  <div className="flex flex-col md:flex-row gap-6">
                    {/* Image */}
                    <div className="w-full md:w-48 h-48 bg-muted rounded-lg overflow-hidden">
                      <img
                        src={lot.images[0] || "/placeholder.svg"}
                        alt={lot.name}
                        className="w-full h-full object-cover"
                      />
                    </div>

                    {/* Details */}
                    <div className="flex-1 space-y-4">
                      <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-2">
                        <div>
                          <h3 className="text-xl font-semibold">{lot.name}</h3>
                          <div className="flex items-center gap-1 text-sm text-muted-foreground">
                            <MapPin className="h-4 w-4" />
                            <span>{lot.address}</span>
                            <span>•</span>
                            <Navigation className="h-4 w-4" />
                            <span>{lot.distance} km away</span>
                          </div>
                          <div className="flex items-center gap-1 mt-1">
                            {renderStars(lot.rating)}
                            <span className="text-sm text-muted-foreground ml-1">({lot.rating})</span>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="flex items-center gap-2">
                            <div className={`w-3 h-3 rounded-full ${availability.color}`}></div>
                            <Badge variant="outline" className={availability.textColor}>
                              {availability.status}
                            </Badge>
                          </div>
                          <p className="text-sm text-muted-foreground mt-1">
                            {lot.availableSlots} of {lot.totalSlots} spots
                          </p>
                        </div>
                      </div>

                      <p className="text-sm text-muted-foreground">{lot.description}</p>

                      {/* Amenities */}
                      <div className="flex flex-wrap gap-2">
                        {lot.amenities.slice(0, 4).map((amenity) => (
                          <Badge key={amenity} variant="secondary" className="text-xs">
                            {amenity === "Security" && <Shield className="h-3 w-3 mr-1" />}
                            {amenity === "WiFi" && <Wifi className="h-3 w-3 mr-1" />}
                            {amenity === "EV Charging" && <Zap className="h-3 w-3 mr-1" />}
                            {amenity}
                          </Badge>
                        ))}
                        {lot.amenities.length > 4 && (
                          <Badge variant="outline" className="text-xs">
                            +{lot.amenities.length - 4} more
                          </Badge>
                        )}
                      </div>

                      {/* Pricing and Actions */}
                      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                        <div className="flex items-center gap-4">
                          <div className="flex items-center gap-1">
                            <CreditCard className="h-4 w-4 text-muted-foreground" />
                            <span className="font-semibold">RWF {lot.pricePerHour}/hr</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Calendar className="h-4 w-4 text-muted-foreground" />
                            <span className="text-sm text-muted-foreground">RWF {lot.pricePerDay}/day</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Clock className="h-4 w-4 text-muted-foreground" />
                            <span className="text-sm text-muted-foreground">
                              {lot.operatingHours.open} - {lot.operatingHours.close}
                            </span>
                          </div>
                        </div>
                        <Button
                          onClick={() => handleBookNow(lot)}
                          disabled={lot.availableSlots === 0}
                          className="w-full md:w-auto"
                        >
                          {lot.availableSlots === 0 ? "Full" : "Book Now"}
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )
          })}

          {filteredLots.length === 0 && (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-12">
                <Car className="h-12 w-12 text-muted-foreground mb-4" />
                <h3 className="text-lg font-semibold mb-2">No parking lots found</h3>
                <p className="text-muted-foreground text-center">
                  Try adjusting your search criteria or filters to find available parking.
                </p>
              </CardContent>
            </Card>
          )}
        </div>
      )}

      {/* Booking Modal */}
      {selectedLot && (
        <BookingModal
          isOpen={showBookingModal}
          onClose={() => {
            setShowBookingModal(false)
            setSelectedLot(null)
          }}
          parkingLot={selectedLot}
          user={user}
        />
      )}
    </div>
  )
}
