"use client"

import { useState } from "react"
import QRCode from "qrcode.react"
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

  const handleDownload = () => {
    const canvas = document.getElementById("booking-qr-code") as HTMLCanvasElement
    if (!canvas) return

    const url = canvas.toDataURL("image/png")
    const link = document.createElement("a")
    link.href = url
    link.download = `parking-qr-${bookingId}.png`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)

    toast({
      title: "QR Code Downloaded",
      description: "Your parking QR code has been downloaded successfully.",
    })
  }

  const handleShare = async () => {
    try {
      setIsSharing(true)
      const canvas = document.getElementById("booking-qr-code") as HTMLCanvasElement
      if (!canvas) return

      const blob = await new Promise<Blob>((resolve) => {
        canvas.toBlob((blob) => {
          if (blob) {
            resolve(blob)
          }
        }, "image/png")
      })

      if (navigator.share) {
        await navigator.share({
          title: "Rwanda Parking QR Code",
          text: `Parking booking for ${parkingLotName}`,
          files: [new File([blob], "parking-qr.png", { type: "image/png" })],
        })
        toast({
          title: "QR Code Shared",
          description: "Your parking QR code has been shared successfully.",
        })
      } else {
        toast({
          title: "Sharing not supported",
          description: "Your browser doesn't support sharing files.",
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error("Error sharing:", error)
      toast({
        title: "Sharing failed",
        description: "Failed to share QR code. Please try downloading instead.",
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
        <div className="bg-white p-4 rounded-lg shadow-sm">
          <QRCode id="booking-qr-code" value={qrData} size={200} level="H" includeMargin={true} renderAs="canvas" />
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
        <Button onClick={handleShare} disabled={isSharing || !navigator.canShare}>
          <Share2 className="mr-2 h-4 w-4" />
          {isSharing ? "Sharing..." : "Share"}
        </Button>
      </CardFooter>
    </Card>
  )
}
