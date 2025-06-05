"use client"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { Badge } from "@/components/ui/badge"
import { BookingQRCode } from "@/components/booking/booking-qr-code"
import { useToast } from "@/hooks/use-toast"
import { ArrowLeft, Calendar, Clock, MapPin, Car, CreditCard } from "lucide-react"
import { getCurrentUser } from "@/lib/auth"

export default function BookingDetailsPage() {
  const params = useParams()
  const router = useRouter()
  const { toast } = useToast()
  const [booking, setBooking] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [user, setUser] = useState<any>(null)

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Get current user
        const currentUser = await getCurrentUser()
        setUser(currentUser)

        // In a real app, you would fetch the booking from your API
        // For demo purposes, we'll use mock data
        await new Promise((resolve) => setTimeout(resolve, 1000))

        // Mock booking data
        const mockBooking = {
          id: params.id as string,
          userId: "4", // client user ID
          parkingLotId: "1",
          parkingLot: {
            name: "Kigali Heights Parking",
            location: "KG 7 Ave, Kigali",
            totalSlots: 120,
            availableSlots: 45,
          },
          startTime: "2023-05-28T10:00:00",
          endTime: "2023-05-28T14:00:00",
          duration: "4 hours",
          totalCost: 2000,
          status: "booked", // booked, in_use, completed, cancelled
          paymentStatus: "paid", // paid, pending, failed
          paymentMethod: "Mobile Money",
          createdAt: "2023-05-27T15:30:00",
        }

        setBooking(mockBooking)
      } catch (error) {
        console.error("Error fetching booking:", error)
        toast({
          title: "Error",
          description: "Failed to load booking details",
          variant: "destructive",
        })
      } finally {
        setIsLoading(false)
      }
    }

    fetchData()
  }, [params.id, toast])

  const formatDateTime = (dateTimeStr: string) => {
    const date = new Date(dateTimeStr)
    return date.toLocaleString("en-US", {
      weekday: "short",
      month: "short",
      day: "numeric",
      hour: "numeric",
      minute: "numeric",
      hour12: true,
    })
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "booked":
        return <Badge className="bg-blue-50 text-blue-700 hover:bg-blue-50">Booked</Badge>
      case "in_use":
        return <Badge className="bg-green-50 text-green-700 hover:bg-green-50">In Use</Badge>
      case "completed":
        return <Badge className="bg-gray-50 text-gray-700 hover:bg-gray-50">Completed</Badge>
      case "cancelled":
        return <Badge className="bg-red-50 text-red-700 hover:bg-red-50">Cancelled</Badge>
      default:
        return <Badge>Unknown</Badge>
    }
  }

  const getPaymentStatusBadge = (status: string) => {
    switch (status) {
      case "paid":
        return <Badge className="bg-green-50 text-green-700 hover:bg-green-50">Paid</Badge>
      case "pending":
        return <Badge className="bg-yellow-50 text-yellow-700 hover:bg-yellow-50">Pending</Badge>
      case "failed":
        return <Badge className="bg-red-50 text-red-700 hover:bg-red-50">Failed</Badge>
      default:
        return <Badge>Unknown</Badge>
    }
  }

  const handleCancelBooking = async () => {
    try {
      // In a real app, you would call your API to cancel the booking
      await new Promise((resolve) => setTimeout(resolve, 1000))

      toast({
        title: "Booking cancelled",
        description: "Your booking has been cancelled successfully",
      })

      // Update booking status locally
      setBooking((prev: any) => ({ ...prev, status: "cancelled" }))
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to cancel booking",
        variant: "destructive",
      })
    }
  }

  if (isLoading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
          <p className="mt-2 text-sm text-muted-foreground">Loading booking details...</p>
        </div>
      </div>
    )
  }

  if (!booking) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <div className="text-center">
          <p className="text-lg font-medium">Booking not found</p>
          <p className="mt-2 text-sm text-muted-foreground">The booking you're looking for doesn't exist</p>
          <Button className="mt-4" onClick={() => router.push("/bookings")}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Bookings
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div className="flex items-center gap-2">
          <Button variant="outline" size="icon" onClick={() => router.push("/bookings")}>
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div>
            <h2 className="text-3xl font-bold tracking-tight">Booking Details</h2>
            <p className="text-muted-foreground">Booking ID: {booking.id}</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          {getStatusBadge(booking.status)}
          {getPaymentStatusBadge(booking.paymentStatus)}
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Booking Information</CardTitle>
              <CardDescription>Details about your parking booking</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-1">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Car className="h-4 w-4" />
                  <span>Parking Location</span>
                </div>
                <p className="font-medium">{booking.parkingLot.name}</p>
                <p className="text-sm flex items-center gap-1">
                  <MapPin className="h-3 w-3" />
                  {booking.parkingLot.location}
                </p>
              </div>

              <Separator />

              <div className="space-y-1">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Calendar className="h-4 w-4" />
                  <span>Date & Time</span>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-muted-foreground">Start Time</p>
                    <p className="font-medium">{formatDateTime(booking.startTime)}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">End Time</p>
                    <p className="font-medium">{formatDateTime(booking.endTime)}</p>
                  </div>
                </div>
                <p className="text-sm flex items-center gap-1 mt-1">
                  <Clock className="h-3 w-3" />
                  Duration: {booking.duration}
                </p>
              </div>

              <Separator />

              <div className="space-y-1">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <CreditCard className="h-4 w-4" />
                  <span>Payment Information</span>
                </div>
                <div className="flex justify-between items-center">
                  <p className="text-sm text-muted-foreground">Total Cost</p>
                  <p className="font-medium">RWF {booking.totalCost.toLocaleString()}</p>
                </div>
                <div className="flex justify-between items-center">
                  <p className="text-sm text-muted-foreground">Payment Method</p>
                  <p className="font-medium">{booking.paymentMethod}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Only show cancel button for booked status and client users */}
          {booking.status === "booked" && user?.role === "client" && (
            <Button variant="destructive" className="w-full" onClick={handleCancelBooking}>
              Cancel Booking
            </Button>
          )}
        </div>

        <div>
          <BookingQRCode
            bookingId={booking.id}
            parkingLotName={booking.parkingLot.name}
            startTime={booking.startTime}
            endTime={booking.endTime}
            status={booking.status}
          />
        </div>
      </div>
    </div>
  )
}
