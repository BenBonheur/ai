"use client"

import type React from "react"
import { useState } from "react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Separator } from "@/components/ui/separator"
import { useToast } from "@/hooks/use-toast"
import { CreditCard, Car, MapPin, Loader2 } from "lucide-react"

interface ParkingLot {
  id: string
  name: string
  address: string
  pricePerHour: number
  pricePerDay: number
  availableSlots: number
  operatingHours: {
    open: string
    close: string
  }
}

interface User {
  id: string
  name: string
  email: string
  role: string
}

interface BookingModalProps {
  isOpen: boolean
  onClose: () => void
  parkingLot: ParkingLot
  user: User
}

export default function BookingModal({ isOpen, onClose, parkingLot, user }: BookingModalProps) {
  const { toast } = useToast()
  const [isLoading, setIsLoading] = useState(false)
  const [bookingData, setBookingData] = useState({
    startDate: "",
    startTime: "",
    endDate: "",
    endTime: "",
    duration: "2",
    durationType: "hours",
    vehicleNumber: "",
    paymentMethod: "mobile_money",
  })

  const calculateCost = () => {
    const duration = Number.parseInt(bookingData.duration)
    if (bookingData.durationType === "hours") {
      return duration * parkingLot.pricePerHour
    } else {
      return duration * parkingLot.pricePerDay
    }
  }

  const handleInputChange = (field: string, value: string) => {
    setBookingData((prev) => ({ ...prev, [field]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      // Validate form
      if (!bookingData.startDate || !bookingData.startTime || !bookingData.vehicleNumber) {
        toast({
          title: "Missing Information",
          description: "Please fill in all required fields.",
          variant: "destructive",
        })
        return
      }

      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 2000))

      // Create booking
      const booking = {
        id: `B-${Date.now()}`,
        userId: user.id,
        parkingLotId: parkingLot.id,
        parkingLotName: parkingLot.name,
        startTime: `${bookingData.startDate}T${bookingData.startTime}:00`,
        endTime:
          bookingData.endDate && bookingData.endTime
            ? `${bookingData.endDate}T${bookingData.endTime}:00`
            : new Date(
                new Date(`${bookingData.startDate}T${bookingData.startTime}:00`).getTime() +
                  Number.parseInt(bookingData.duration) * (bookingData.durationType === "hours" ? 3600000 : 86400000),
              ).toISOString(),
        duration: `${bookingData.duration} ${bookingData.durationType}`,
        totalCost: calculateCost(),
        status: "booked",
        vehicleNumber: bookingData.vehicleNumber,
        paymentMethod: bookingData.paymentMethod,
        createdAt: new Date().toISOString(),
      }

      toast({
        title: "Booking Confirmed!",
        description: `Your parking spot has been reserved. Booking ID: ${booking.id}`,
      })

      onClose()

      // In a real app, you would redirect to the booking details page
      // router.push(`/bookings/${booking.id}`)
    } catch (error) {
      toast({
        title: "Booking Failed",
        description: "Failed to create booking. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const today = new Date().toISOString().split("T")[0]
  const currentTime = new Date().toTimeString().slice(0, 5)

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Book Parking Space</DialogTitle>
          <DialogDescription>Reserve your parking spot at {parkingLot.name}</DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Parking Lot Info */}
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <Car className="h-4 w-4 text-muted-foreground" />
              <span className="font-medium">{parkingLot.name}</span>
            </div>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <MapPin className="h-4 w-4" />
              <span>{parkingLot.address}</span>
            </div>
            <div className="text-sm text-muted-foreground">Available slots: {parkingLot.availableSlots}</div>
          </div>

          <Separator />

          {/* Date and Time */}
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="startDate">Start Date *</Label>
                <Input
                  id="startDate"
                  type="date"
                  min={today}
                  value={bookingData.startDate}
                  onChange={(e) => handleInputChange("startDate", e.target.value)}
                  required
                />
              </div>
              <div>
                <Label htmlFor="startTime">Start Time *</Label>
                <Input
                  id="startTime"
                  type="time"
                  min={bookingData.startDate === today ? currentTime : parkingLot.operatingHours.open}
                  max={parkingLot.operatingHours.close}
                  value={bookingData.startTime}
                  onChange={(e) => handleInputChange("startTime", e.target.value)}
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="duration">Duration *</Label>
                <Input
                  id="duration"
                  type="number"
                  min="1"
                  max={bookingData.durationType === "hours" ? "24" : "30"}
                  value={bookingData.duration}
                  onChange={(e) => handleInputChange("duration", e.target.value)}
                  required
                />
              </div>
              <div>
                <Label htmlFor="durationType">Duration Type</Label>
                <Select
                  value={bookingData.durationType}
                  onValueChange={(value) => handleInputChange("durationType", value)}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="hours">Hours</SelectItem>
                    <SelectItem value="days">Days</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          <Separator />

          {/* Vehicle Information */}
          <div>
            <Label htmlFor="vehicleNumber">Vehicle Number *</Label>
            <Input
              id="vehicleNumber"
              placeholder="e.g. RAD 123 A"
              value={bookingData.vehicleNumber}
              onChange={(e) => handleInputChange("vehicleNumber", e.target.value.toUpperCase())}
              required
            />
          </div>

          <Separator />

          {/* Payment Method */}
          <div>
            <Label htmlFor="paymentMethod">Payment Method</Label>
            <Select
              value={bookingData.paymentMethod}
              onValueChange={(value) => handleInputChange("paymentMethod", value)}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="mobile_money">Mobile Money</SelectItem>
                <SelectItem value="credit_card">Credit Card</SelectItem>
                <SelectItem value="cash">Cash (Pay on arrival)</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <Separator />

          {/* Cost Summary */}
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <CreditCard className="h-4 w-4 text-muted-foreground" />
              <span className="font-medium">Cost Summary</span>
            </div>
            <div className="bg-muted p-3 rounded-lg space-y-2">
              <div className="flex justify-between text-sm">
                <span>Duration:</span>
                <span>
                  {bookingData.duration} {bookingData.durationType}
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span>Rate:</span>
                <span>
                  RWF {bookingData.durationType === "hours" ? parkingLot.pricePerHour : parkingLot.pricePerDay} per{" "}
                  {bookingData.durationType.slice(0, -1)}
                </span>
              </div>
              <Separator />
              <div className="flex justify-between font-medium">
                <span>Total Cost:</span>
                <span>RWF {calculateCost().toLocaleString()}</span>
              </div>
            </div>
          </div>

          <DialogFooter className="flex gap-2">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Processing...
                </>
              ) : (
                "Confirm Booking"
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
