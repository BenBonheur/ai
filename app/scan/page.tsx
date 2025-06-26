"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { useToast } from "@/hooks/use-toast"
import { QrCode, CheckCircle, XCircle, Camera, Keyboard } from "lucide-react"

interface BookingData {
  bookingId: string
  parkingLotName: string
  startTime: string
  endTime: string
  status: string
  vehicleNumber?: string
  totalAmount?: number
}

export default function ScanPage() {
  const { toast } = useToast()
  const [scanMode, setScanMode] = useState<"camera" | "manual">("manual")
  const [manualCode, setManualCode] = useState("")
  const [scannedData, setScannedData] = useState<BookingData | null>(null)
  const [isProcessing, setIsProcessing] = useState(false)

  const handleManualScan = async () => {
    if (!manualCode.trim()) {
      toast({
        title: "Invalid Input",
        description: "Please enter a QR code or booking ID",
        variant: "destructive",
      })
      return
    }

    setIsProcessing(true)

    try {
      // Simulate processing delay
      await new Promise((resolve) => setTimeout(resolve, 1500))

      // Try to parse as JSON (QR code data)
      let bookingData: BookingData

      try {
        const parsed = JSON.parse(manualCode)
        bookingData = parsed
      } catch {
        // If not JSON, treat as booking ID
        bookingData = {
          bookingId: manualCode,
          parkingLotName: "Kigali City Center Parking",
          startTime: new Date().toISOString(),
          endTime: new Date(Date.now() + 2 * 60 * 60 * 1000).toISOString(),
          status: "booked",
          vehicleNumber: "RAD 123 A",
          totalAmount: 1000,
        }
      }

      setScannedData(bookingData)
      toast({
        title: "QR Code Scanned Successfully",
        description: `Booking ${bookingData.bookingId} found`,
      })
    } catch (error) {
      toast({
        title: "Scan Failed",
        description: "Invalid QR code or booking ID",
        variant: "destructive",
      })
    } finally {
      setIsProcessing(false)
    }
  }

  const handleValidateEntry = () => {
    if (!scannedData) return

    toast({
      title: "Entry Validated",
      description: `Vehicle access granted for booking ${scannedData.bookingId}`,
    })

    // Update status to in_use
    setScannedData({ ...scannedData, status: "in_use" })
  }

  const handleValidateExit = () => {
    if (!scannedData) return

    toast({
      title: "Exit Validated",
      description: `Parking session completed for booking ${scannedData.bookingId}`,
    })

    // Update status to completed
    setScannedData({ ...scannedData, status: "completed" })
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

  const getStatusColor = (status: string) => {
    switch (status) {
      case "booked":
        return "bg-blue-50 text-blue-700"
      case "in_use":
        return "bg-green-50 text-green-700"
      case "completed":
        return "bg-gray-50 text-gray-700"
      default:
        return "bg-red-50 text-red-700"
    }
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-2xl">
      <div className="mb-8 text-center">
        <h1 className="text-3xl font-bold mb-2">QR Code Scanner</h1>
        <p className="text-muted-foreground">Scan parking booking QR codes for entry and exit validation</p>
      </div>

      {/* Scan Mode Toggle */}
      <div className="mb-6">
        <div className="flex rounded-lg border p-1">
          <Button
            variant={scanMode === "camera" ? "default" : "ghost"}
            size="sm"
            onClick={() => setScanMode("camera")}
            className="flex-1"
          >
            <Camera className="mr-2 h-4 w-4" />
            Camera Scan
          </Button>
          <Button
            variant={scanMode === "manual" ? "default" : "ghost"}
            size="sm"
            onClick={() => setScanMode("manual")}
            className="flex-1"
          >
            <Keyboard className="mr-2 h-4 w-4" />
            Manual Entry
          </Button>
        </div>
      </div>

      {/* Scanner Interface */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <QrCode className="h-5 w-5" />
            {scanMode === "camera" ? "Camera Scanner" : "Manual Entry"}
          </CardTitle>
          <CardDescription>
            {scanMode === "camera"
              ? "Position the QR code within the camera frame"
              : "Enter the QR code data or booking ID manually"}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {scanMode === "camera" ? (
            <div className="aspect-square bg-muted rounded-lg flex items-center justify-center">
              <div className="text-center">
                <Camera className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                <p className="text-muted-foreground">Camera scanner will be implemented here</p>
                <p className="text-sm text-muted-foreground mt-2">Use manual entry for now</p>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              <div>
                <Label htmlFor="manual-code">QR Code Data or Booking ID</Label>
                <Textarea
                  id="manual-code"
                  placeholder="Paste QR code JSON data or enter booking ID (e.g., B-1234567890)"
                  value={manualCode}
                  onChange={(e) => setManualCode(e.target.value)}
                  rows={4}
                />
              </div>
              <Button onClick={handleManualScan} disabled={isProcessing || !manualCode.trim()} className="w-full">
                {isProcessing ? "Processing..." : "Scan Code"}
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Scanned Data Display */}
      {scannedData && (
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CheckCircle className="h-5 w-5 text-green-600" />
              Booking Details
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <Label className="text-muted-foreground">Booking ID</Label>
                <p className="font-medium">{scannedData.bookingId}</p>
              </div>
              <div>
                <Label className="text-muted-foreground">Status</Label>
                <div>
                  <Badge className={getStatusColor(scannedData.status)}>
                    {scannedData.status.charAt(0).toUpperCase() + scannedData.status.slice(1).replace("_", " ")}
                  </Badge>
                </div>
              </div>
              <div>
                <Label className="text-muted-foreground">Parking Lot</Label>
                <p className="font-medium">{scannedData.parkingLotName}</p>
              </div>
              <div>
                <Label className="text-muted-foreground">Vehicle</Label>
                <p className="font-medium">{scannedData.vehicleNumber || "N/A"}</p>
              </div>
              <div>
                <Label className="text-muted-foreground">Start Time</Label>
                <p className="font-medium">{formatDateTime(scannedData.startTime)}</p>
              </div>
              <div>
                <Label className="text-muted-foreground">End Time</Label>
                <p className="font-medium">{formatDateTime(scannedData.endTime)}</p>
              </div>
            </div>

            {scannedData.totalAmount && (
              <>
                <Separator />
                <div className="flex justify-between items-center">
                  <Label className="text-muted-foreground">Total Amount</Label>
                  <p className="text-lg font-bold">{scannedData.totalAmount} RWF</p>
                </div>
              </>
            )}

            <Separator />

            {/* Action Buttons */}
            <div className="flex gap-2">
              {scannedData.status === "booked" && (
                <Button onClick={handleValidateEntry} className="flex-1">
                  <CheckCircle className="mr-2 h-4 w-4" />
                  Validate Entry
                </Button>
              )}
              {scannedData.status === "in_use" && (
                <Button onClick={handleValidateExit} variant="outline" className="flex-1 bg-transparent">
                  <XCircle className="mr-2 h-4 w-4" />
                  Validate Exit
                </Button>
              )}
              {scannedData.status === "completed" && (
                <div className="flex-1 text-center py-2">
                  <Badge className="bg-gray-50 text-gray-700">Session Completed</Badge>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Instructions */}
      <Card>
        <CardHeader>
          <CardTitle>How to Use</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2 text-sm text-muted-foreground">
          <p>1. Choose between camera scanning or manual entry</p>
          <p>2. For manual entry, paste the QR code JSON data or enter the booking ID</p>
          <p>3. Review the booking details after scanning</p>
          <p>4. Use "Validate Entry" when the vehicle arrives</p>
          <p>5. Use "Validate Exit" when the vehicle leaves</p>
        </CardContent>
      </Card>
    </div>
  )
}
