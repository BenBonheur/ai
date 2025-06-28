"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Textarea } from "@/components/ui/textarea"
import { useToast } from "@/hooks/use-toast"
import { getCurrentUser } from "@/lib/auth"
import { QrCode, Camera, Type, CheckCircle, Clock, Car, MapPin } from "lucide-react"
import { useRouter } from "next/navigation"

interface ScannedBooking {
  bookingId: string
  parkingLot: string
  vehicleNumber: string
  startTime: string
  endTime: string
  status: string
  customerName?: string
  totalCost?: number
}

export default function ScanPage() {
  const router = useRouter()
  const { toast } = useToast()
  const [user, setUser] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [scanMode, setScanMode] = useState<"camera" | "manual">("manual")
  const [qrInput, setQrInput] = useState("")
  const [scannedData, setScannedData] = useState<ScannedBooking | null>(null)
  const [isProcessing, setIsProcessing] = useState(false)

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const currentUser = await getCurrentUser()
        if (!currentUser) {
          router.push("/login")
          return
        }

        // Only allow employees and admins to access scan page
        if (!["employee", "admin"].includes(currentUser.role)) {
          toast({
            title: "Access Denied",
            description: "You don't have permission to access this page.",
            variant: "destructive",
          })
          router.push("/")
          return
        }

        setUser(currentUser)
      } catch (error) {
        console.error("Auth check failed:", error)
        router.push("/login")
      } finally {
        setIsLoading(false)
      }
    }

    checkAuth()
  }, [router, toast])

  const handleManualScan = async () => {
    if (!qrInput.trim()) {
      toast({
        title: "Invalid Input",
        description: "Please enter QR code data or booking ID.",
        variant: "destructive",
      })
      return
    }

    setIsProcessing(true)

    try {
      // Simulate processing delay
      await new Promise((resolve) => setTimeout(resolve, 1500))

      let bookingData: ScannedBooking

      try {
        // Try to parse as JSON (QR code data)
        const parsed = JSON.parse(qrInput)
        bookingData = {
          bookingId: parsed.bookingId,
          parkingLot: parsed.parkingLot,
          vehicleNumber: parsed.vehicleNumber,
          startTime: parsed.startTime,
          endTime: parsed.endTime,
          status: parsed.status,
          customerName: "John Doe", // Mock data
          totalCost: 2500, // Mock data
        }
      } catch {
        // If not JSON, treat as booking ID
        bookingData = {
          bookingId: qrInput.trim(),
          parkingLot: "Kigali City Center Parking",
          vehicleNumber: "RAD 123 A",
          startTime: new Date().toISOString(),
          endTime: new Date(Date.now() + 2 * 60 * 60 * 1000).toISOString(),
          status: "active",
          customerName: "John Doe",
          totalCost: 1000,
        }
      }

      setScannedData(bookingData)

      toast({
        title: "QR Code Scanned Successfully",
        description: `Booking ${bookingData.bookingId} found.`,
      })
    } catch (error) {
      toast({
        title: "Scan Failed",
        description: "Invalid QR code or booking ID. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsProcessing(false)
    }
  }

  const handleValidateEntry = async () => {
    if (!scannedData) return

    setIsProcessing(true)

    try {
      // Simulate API call to validate entry
      await new Promise((resolve) => setTimeout(resolve, 1000))

      // Update booking status to "checked-in"
      setScannedData({
        ...scannedData,
        status: "checked-in",
      })

      toast({
        title: "Entry Validated",
        description: `Vehicle ${scannedData.vehicleNumber} has been checked in successfully.`,
      })
    } catch (error) {
      toast({
        title: "Validation Failed",
        description: "Failed to validate entry. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsProcessing(false)
    }
  }

  const handleValidateExit = async () => {
    if (!scannedData) return

    setIsProcessing(true)

    try {
      // Simulate API call to validate exit
      await new Promise((resolve) => setTimeout(resolve, 1000))

      // Update booking status to "completed"
      setScannedData({
        ...scannedData,
        status: "completed",
      })

      toast({
        title: "Exit Validated",
        description: `Vehicle ${scannedData.vehicleNumber} has been checked out successfully.`,
      })
    } catch (error) {
      toast({
        title: "Validation Failed",
        description: "Failed to validate exit. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsProcessing(false)
    }
  }

  const resetScan = () => {
    setQrInput("")
    setScannedData(null)
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
        return "bg-blue-500"
      case "checked-in":
        return "bg-green-500"
      case "completed":
        return "bg-gray-500"
      case "expired":
        return "bg-red-500"
      case "cancelled":
        return "bg-red-500"
      default:
        return "bg-gray-500"
    }
  }

  const getStatusText = (status: string) => {
    switch (status.toLowerCase()) {
      case "active":
        return "Ready for Check-in"
      case "checked-in":
        return "Checked In"
      case "completed":
        return "Completed"
      case "expired":
        return "Expired"
      case "cancelled":
        return "Cancelled"
      default:
        return status
    }
  }

  if (isLoading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
          <p className="mt-2 text-sm text-muted-foreground">Loading scanner...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-2xl">
      <div className="space-y-6">
        <div className="text-center">
          <h1 className="text-3xl font-bold">QR Code Scanner</h1>
          <p className="text-muted-foreground mt-2">Scan parking booking QR codes for entry/exit validation</p>
        </div>

        {/* Scan Mode Selection */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <QrCode className="h-5 w-5" />
              Scan Method
            </CardTitle>
            <CardDescription>Choose how you want to scan the QR code</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4">
              <Button
                variant={scanMode === "camera" ? "default" : "outline"}
                onClick={() => setScanMode("camera")}
                className="h-20 flex-col gap-2"
                disabled
              >
                <Camera className="h-6 w-6" />
                <span>Camera Scan</span>
                <span className="text-xs text-muted-foreground">(Coming Soon)</span>
              </Button>
              <Button
                variant={scanMode === "manual" ? "default" : "outline"}
                onClick={() => setScanMode("manual")}
                className="h-20 flex-col gap-2"
              >
                <Type className="h-6 w-6" />
                <span>Manual Entry</span>
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Manual Entry */}
        {scanMode === "manual" && !scannedData && (
          <Card>
            <CardHeader>
              <CardTitle>Manual QR Code Entry</CardTitle>
              <CardDescription>Enter the QR code data or booking ID manually</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="qr-input">QR Code Data or Booking ID</Label>
                <Textarea
                  id="qr-input"
                  placeholder="Paste QR code data here or enter booking ID (e.g., B-1234567890)"
                  value={qrInput}
                  onChange={(e) => setQrInput(e.target.value)}
                  rows={4}
                />
              </div>
              <div className="flex gap-2">
                <Button onClick={handleManualScan} disabled={isProcessing} className="flex-1">
                  {isProcessing ? "Processing..." : "Scan QR Code"}
                </Button>
                <Button variant="outline" onClick={() => setQrInput("")}>
                  Clear
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Camera Scanner Placeholder */}
        {scanMode === "camera" && (
          <Card>
            <CardHeader>
              <CardTitle>Camera Scanner</CardTitle>
              <CardDescription>Camera-based QR code scanning</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="aspect-video bg-muted rounded-lg flex items-center justify-center">
                <div className="text-center">
                  <Camera className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                  <h3 className="text-lg font-semibold mb-2">Camera Scanner</h3>
                  <p className="text-muted-foreground">Camera-based scanning will be available soon</p>
                  <p className="text-sm text-muted-foreground mt-2">Please use manual entry for now</p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Scanned Data Display */}
        {scannedData && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span className="flex items-center gap-2">
                  <CheckCircle className="h-5 w-5 text-green-500" />
                  Booking Found
                </span>
                <Badge className={getStatusColor(scannedData.status)}>{getStatusText(scannedData.status)}</Badge>
              </CardTitle>
              <CardDescription>Booking details and validation options</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="font-medium">Booking ID:</span>
                  <p className="font-mono">{scannedData.bookingId}</p>
                </div>
                <div>
                  <span className="font-medium">Customer:</span>
                  <p>{scannedData.customerName || "N/A"}</p>
                </div>
              </div>

              <Separator />

              <div className="space-y-2">
                <div className="flex items-center gap-2 text-sm">
                  <MapPin className="h-4 w-4 text-muted-foreground" />
                  <span className="font-medium">{scannedData.parkingLot}</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <Car className="h-4 w-4 text-muted-foreground" />
                  <span>Vehicle: {scannedData.vehicleNumber}</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <Clock className="h-4 w-4 text-muted-foreground" />
                  <span>
                    {formatDateTime(scannedData.startTime)} - {formatDateTime(scannedData.endTime)}
                  </span>
                </div>
                {scannedData.totalCost && (
                  <div className="flex items-center gap-2 text-sm">
                    <span className="font-medium">Total Cost: RWF {scannedData.totalCost.toLocaleString()}</span>
                  </div>
                )}
              </div>

              <Separator />

              <div className="flex gap-2">
                {scannedData.status === "active" && (
                  <Button onClick={handleValidateEntry} disabled={isProcessing} className="flex-1">
                    {isProcessing ? "Processing..." : "Validate Entry"}
                  </Button>
                )}
                {scannedData.status === "checked-in" && (
                  <Button onClick={handleValidateExit} disabled={isProcessing} className="flex-1">
                    {isProcessing ? "Processing..." : "Validate Exit"}
                  </Button>
                )}
                {scannedData.status === "completed" && (
                  <div className="flex-1 text-center py-2 text-green-600 font-medium">✓ Booking Completed</div>
                )}
                <Button variant="outline" onClick={resetScan}>
                  New Scan
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Instructions */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Instructions</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 text-sm text-muted-foreground">
            <p>• Use manual entry to paste QR code data or enter booking ID</p>
            <p>• Validate entry when customer arrives at the parking lot</p>
            <p>• Validate exit when customer leaves the parking lot</p>
            <p>• Camera scanning will be available in a future update</p>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
