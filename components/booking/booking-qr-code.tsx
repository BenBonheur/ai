"use client"

import { useState } from "react"
import QRCode from "react-qr-code"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Share2, Download } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

interface BookingQRCodeProps {
  bookingId: string
  parkingLotName: string
  startTime: string
  endTime: string
  status: string
}

export function BookingQRCode({ bookingId, parkingLotName, startTime, endTime, status }: BookingQRCodeProps) {
  const { toast } = useToast()
  const [isSharing, setIsSharing] = useState(false)

  // Create QR code data with booking information
  const qrData = JSON.stringify({
    bookingId,
    parkingLotName,
    startTime,
    endTime,
    status,
    timestamp: new Date().toISOString(),
  })

  const handleDownload = async () => {
    try {
      // Create a canvas element to render the QR code
      const canvas = document.createElement("canvas")
      const ctx = canvas.getContext("2d")
      if (!ctx) return

      // Set canvas size
      canvas.width = 256
      canvas.height = 256

      // Get the SVG element
      const svgElement = document.querySelector("#booking-qr-code svg") as SVGElement
      if (!svgElement) return

      const svgData = new XMLSerializer().serializeToString(svgElement)
      const svgBlob = new Blob([svgData], { type: "image/svg+xml;charset=utf-8" })
      const url = URL.createObjectURL(svgBlob)

      const img = new Image()
      img.onload = () => {
        ctx.drawImage(img, 0, 0, 256, 256)

        // Download the image
        const link = document.createElement("a")
        link.href = canvas.toDataURL("image/png")
        link.download = `parking-qr-${bookingId}.png`
        document.body.appendChild(link)
        link.click()
        document.body.removeChild(link)

        URL.revokeObjectURL(url)

        toast({
          title: "QR Code Downloaded",
          description: "Your parking QR code has been downloaded successfully.",
        })
      }
      img.src = url
    } catch (error) {
      console.error("Download error:", error)
      toast({
        title: "Download failed",
        description: "Failed to download QR code. Please try again.",
        variant: "destructive",
      })
    }
  }

  const handleShare = async () => {
    try {
      setIsSharing(true)

      if (navigator.share) {
        await navigator.share({
          title: "Rwanda Parking QR Code",
          text: `Parking booking for ${parkingLotName}`,
          url: window.location.href,
        })
        toast({
          title: "QR Code Shared",
          description: "Your parking QR code has been shared successfully.",
        })
      } else {
        // Fallback: copy to clipboard
        await navigator.clipboard.writeText(qrData)
        toast({
          title: "Copied to clipboard",
          description: "QR code data has been copied to your clipboard.",
        })
      }
    } catch (error) {
      console.error("Error sharing:", error)
      toast({
        title: "Sharing failed",
        description: "Failed to share QR code. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsSharing(false)
    }
  }

  const formatDateTime = (dateTimeStr: string) => {
    const date = new Date(dateTimeStr)
    return date.toLocaleString("en-US", {
      month: "short",
      day: "numeric",
      hour: "numeric",
      minute: "numeric",
      hour12: true,
    })
  }

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle>Parking QR Code</CardTitle>
        <CardDescription>
          Present this QR code to the parking attendant when entering or exiting the parking lot
        </CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col items-center">
        <div className="bg-white p-4 rounded-lg shadow-sm" id="booking-qr-code">
          <QRCode value={qrData} size={200} level="H" />
        </div>
        <div className="mt-4 text-center">
          <p className="font-medium">{parkingLotName}</p>
          <p className="text-sm text-muted-foreground">
            {formatDateTime(startTime)} - {formatDateTime(endTime)}
          </p>
          <div className="mt-2">
            <span
              className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                status === "booked"
                  ? "bg-blue-50 text-blue-700"
                  : status === "in_use"
                    ? "bg-green-50 text-green-700"
                    : status === "completed"
                      ? "bg-gray-50 text-gray-700"
                      : "bg-red-50 text-red-700"
              }`}
            >
              {status.charAt(0).toUpperCase() + status.slice(1).replace("_", " ")}
            </span>
          </div>
        </div>
      </CardContent>
      <CardFooter className="flex justify-between">
        <Button variant="outline" onClick={handleDownload}>
          <Download className="mr-2 h-4 w-4" />
          Download
        </Button>
        <Button onClick={handleShare} disabled={isSharing}>
          <Share2 className="mr-2 h-4 w-4" />
          {isSharing ? "Sharing..." : "Share"}
        </Button>
      </CardFooter>
    </Card>
  )
}
