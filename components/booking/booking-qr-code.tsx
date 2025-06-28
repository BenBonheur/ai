"use client"

import { useState } from "react"
import QRCode from "react-qr-code"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Download, Share2, MapPin, Clock, Car, CreditCard } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

interface Booking {
  id: string
  parkingLotName: string
  parkingLotAddress: string
  startTime: string
  endTime: string
  duration: string
  totalCost: number
  vehicleNumber: string
  paymentMethod: string
  status: string
  qrCode: string
  createdAt: string
}

interface BookingQRCodeProps {
  booking: Booking
}

export function BookingQRCode({ booking }: BookingQRCodeProps) {
  const { toast } = useToast()
  const [isDownloading, setIsDownloading] = useState(false)

  const qrValue = JSON.stringify({
    bookingId: booking.id,
    parkingLot: booking.parkingLotName,
    vehicleNumber: booking.vehicleNumber,
    startTime: booking.startTime,
    endTime: booking.endTime,
    status: booking.status,
  })

  const handleDownload = async () => {
    setIsDownloading(true)
    try {
      // Create a canvas element to convert QR code to image
      const canvas = document.createElement("canvas")
      const ctx = canvas.getContext("2d")
      const svg = document.querySelector("#qr-code-svg") as SVGElement

      if (svg && ctx) {
        const svgData = new XMLSerializer().serializeToString(svg)
        const img = new Image()

        img.onload = () => {
          canvas.width = img.width
          canvas.height = img.height
          ctx.drawImage(img, 0, 0)

          // Download the image
          const link = document.createElement("a")
          link.download = `parking-qr-${booking.id}.png`
          link.href = canvas.toDataURL()
          link.click()

          toast({
            title: "QR Code Downloaded",
            description: "Your parking QR code has been saved to your device.",
          })
        }

        img.src = `data:image/svg+xml;base64,${btoa(svgData)}`
      }
    } catch (error) {
      toast({
        title: "Download Failed",
        description: "Failed to download QR code. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsDownloading(false)
    }
  }

  const handleShare = async () => {
    try {
      if (navigator.share) {
        await navigator.share({
          title: "Parking Booking QR Code",
          text: `Parking booking for ${booking.parkingLotName}`,
          url: window.location.href,
        })
      } else {
        // Fallback: copy to clipboard
        await navigator.clipboard.writeText(qrValue)
        toast({
          title: "Copied to Clipboard",
          description: "QR code data has been copied to your clipboard.",
        })
      }
    } catch (error) {
      toast({
        title: "Share Failed",
        description: "Failed to share QR code. Please try again.",
        variant: "destructive",
      })
    }
  }

  const formatDateTime = (dateTime: string) => {
    return new Date(dateTime).toLocaleString("en-RW", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "active":
        return "bg-green-500"
      case "pending":
        return "bg-yellow-500"
      case "expired":
        return "bg-red-500"
      case "cancelled":
        return "bg-gray-500"
      default:
        return "bg-blue-500"
    }
  }

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader className="text-center">
        <CardTitle className="flex items-center justify-center gap-2">
          <Car className="h-5 w-5" />
          Parking Booking
        </CardTitle>
        <CardDescription>Scan this QR code at the parking entrance</CardDescription>
      </CardHeader>

      <CardContent className="space-y-6">
        {/* QR Code */}
        <div className="flex justify-center p-4 bg-white rounded-lg">
          <QRCode
            id="qr-code-svg"
            value={qrValue}
            size={200}
            style={{ height: "auto", maxWidth: "100%", width: "100%" }}
            viewBox="0 0 256 256"
          />
        </div>

        {/* Booking Details */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium">Booking ID:</span>
            <span className="text-sm font-mono">{booking.id}</span>
          </div>

          <div className="flex items-center justify-between">
            <span className="text-sm font-medium">Status:</span>
            <Badge className={getStatusColor(booking.status)}>
              {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
            </Badge>
          </div>

          <Separator />

          <div className="space-y-2">
            <div className="flex items-center gap-2 text-sm">
              <MapPin className="h-4 w-4 text-muted-foreground" />
              <div>
                <div className="font-medium">{booking.parkingLotName}</div>
                <div className="text-muted-foreground">{booking.parkingLotAddress}</div>
              </div>
            </div>
          </div>

          <Separator />

          <div className="space-y-2">
            <div className="flex items-center gap-2 text-sm">
              <Clock className="h-4 w-4 text-muted-foreground" />
              <div>
                <div className="font-medium">Duration: {booking.duration}</div>
                <div className="text-muted-foreground">
                  {formatDateTime(booking.startTime)} - {formatDateTime(booking.endTime)}
                </div>
              </div>
            </div>
          </div>

          <Separator />

          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span className="flex items-center gap-2">
                <Car className="h-4 w-4 text-muted-foreground" />
                Vehicle:
              </span>
              <span className="font-mono font-medium">{booking.vehicleNumber}</span>
            </div>

            <div className="flex items-center justify-between text-sm">
              <span className="flex items-center gap-2">
                <CreditCard className="h-4 w-4 text-muted-foreground" />
                Total Cost:
              </span>
              <span className="font-medium">RWF {booking.totalCost.toLocaleString()}</span>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={handleDownload}
            disabled={isDownloading}
            className="flex-1 bg-transparent"
          >
            <Download className="h-4 w-4 mr-2" />
            {isDownloading ? "Downloading..." : "Download"}
          </Button>
          <Button variant="outline" size="sm" onClick={handleShare} className="flex-1 bg-transparent">
            <Share2 className="h-4 w-4 mr-2" />
            Share
          </Button>
        </div>

        {/* Instructions */}
        <div className="text-xs text-muted-foreground text-center space-y-1">
          <p>Present this QR code at the parking entrance</p>
          <p>Keep this code until you exit the parking lot</p>
        </div>
      </CardContent>
    </Card>
  )
}
