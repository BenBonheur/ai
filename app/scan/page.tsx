"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { useToast } from "@/hooks/use-toast"
import { getCurrentUser } from "@/lib/auth"
import { AlertCircle, CheckCircle2, QrCode } from "lucide-react"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"

export default function ScanQRPage() {
  const router = useRouter()
  const { toast } = useToast()
  const [user, setUser] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [manualBookingId, setManualBookingId] = useState("")
  const [manualQRData, setManualQRData] = useState("")
  const [scanResult, setScanResult] = useState<{
    success: boolean
    message: string
    booking?: any
  } | null>(null)

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const currentUser = await getCurrentUser()
        if (!currentUser) {
          router.push("/login")
          return
        }

        // Only employees and admins can access this page
        if (currentUser.role !== "employee" && currentUser.role !== "admin") {
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

  const processQRData = async (data: string) => {
    try {
      // Parse QR code data
      const bookingData = JSON.parse(data)

      // In a real app, you would validate this against your database
      await new Promise((resolve) => setTimeout(resolve, 1000))

      // For demo purposes, we'll simulate different scenarios based on status
      if (bookingData.status === "booked") {
        // Check in - update status to in_use
        setScanResult({
          success: true,
          message: "Check-in successful! Parking session started.",
          booking: {
            ...bookingData,
            status: "in_use",
          },
        })
      } else if (bookingData.status === "in_use") {
        // Check out - update status to completed
        setScanResult({
          success: true,
          message: "Check-out successful! Parking session completed.",
          booking: {
            ...bookingData,
            status: "completed",
          },
        })
      } else if (bookingData.status === "completed") {
        // Already completed
        setScanResult({
          success: false,
          message: "This booking has already been completed.",
          booking: bookingData,
        })
      } else if (bookingData.status === "cancelled") {
        // Cancelled booking
        setScanResult({
          success: false,
          message: "This booking has been cancelled and is not valid.",
          booking: bookingData,
        })
      }
    } catch (error) {
      console.error("Error processing QR code:", error)
      setScanResult({
        success: false,
        message: "Invalid QR code data. Please try again.",
      })
    }
  }

  const handleManualEntry = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!manualBookingId) {
      toast({
        title: "Error",
        description: "Please enter a booking ID",
        variant: "destructive",
      })
      return
    }

    try {
      // In a real app, you would fetch the booking from your API
      await new Promise((resolve) => setTimeout(resolve, 1000))

      // For demo purposes, we'll simulate a successful scan
      setScanResult({
        success: true,
        message: "Booking found and validated successfully.",
        booking: {
          bookingId: manualBookingId,
          parkingLotName: "Kigali Heights Parking",
          startTime: new Date().toISOString(),
          endTime: new Date(Date.now() + 4 * 60 * 60 * 1000).toISOString(),
          status: "in_use",
        },
      })
    } catch (error) {
      setScanResult({
        success: false,
        message: "Booking not found or invalid.",
      })
    }
  }

  const handleManualQREntry = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!manualQRData) {
      toast({
        title: "Error",
        description: "Please enter QR code data",
        variant: "destructive",
      })
      return
    }

    await processQRData(manualQRData)
  }

  const resetScan = () => {
    setScanResult(null)
    setManualBookingId("")
    setManualQRData("")
  }

  if (isLoading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
          <p className="mt-2 text-sm text-muted-foreground">Loading...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Scan Parking QR Code</h2>
          <p className="text-muted-foreground">Validate parking bookings by scanning QR codes</p>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>QR Code Scanner</CardTitle>
            <CardDescription>
              Camera-based QR scanning is not available in this demo. Use manual entry instead.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="aspect-square max-h-[400px] flex items-center justify-center rounded-lg border bg-muted/50">
              <div className="text-center">
                <QrCode className="mx-auto h-12 w-12 text-muted-foreground" />
                <p className="mt-2 text-sm text-muted-foreground">QR Scanner not available</p>
                <p className="text-xs text-muted-foreground">Use manual entry below</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Manual Booking ID Entry</CardTitle>
              <CardDescription>Enter the booking ID manually if the QR code cannot be scanned</CardDescription>
            </CardHeader>
            <form onSubmit={handleManualEntry}>
              <CardContent>
                <div className="space-y-2">
                  <Label htmlFor="bookingId">Booking ID</Label>
                  <Input
                    id="bookingId"
                    placeholder="e.g. B-1234"
                    value={manualBookingId}
                    onChange={(e) => setManualBookingId(e.target.value)}
                  />
                </div>
              </CardContent>
              <CardFooter>
                <Button type="submit" className="w-full">
                  Validate Booking
                </Button>
              </CardFooter>
            </form>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Manual QR Data Entry</CardTitle>
              <CardDescription>Paste the QR code data directly if you have it</CardDescription>
            </CardHeader>
            <form onSubmit={handleManualQREntry}>
              <CardContent>
                <div className="space-y-2">
                  <Label htmlFor="qrData">QR Code Data (JSON)</Label>
                  <Textarea
                    id="qrData"
                    placeholder='{"bookingId":"B-1234","parkingLotName":"Example Parking","status":"booked"}'
                    value={manualQRData}
                    onChange={(e) => setManualQRData(e.target.value)}
                    rows={4}
                  />
                </div>
              </CardContent>
              <CardFooter>
                <Button type="submit" className="w-full">
                  Process QR Data
                </Button>
              </CardFooter>
            </form>
          </Card>

          {scanResult && (
            <Alert
              variant={scanResult.success ? "default" : "destructive"}
              className={scanResult.success ? "border-green-500 bg-green-50" : ""}
            >
              <div className="flex items-start gap-4">
                {scanResult.success ? (
                  <CheckCircle2 className="h-5 w-5 text-green-600" />
                ) : (
                  <AlertCircle className="h-5 w-5" />
                )}
                <div>
                  <AlertTitle>{scanResult.success ? "Success" : "Error"}</AlertTitle>
                  <AlertDescription className="mt-1">{scanResult.message}</AlertDescription>

                  {scanResult.booking && (
                    <div className="mt-4 space-y-2 rounded-md bg-background p-3">
                      <div className="flex justify-between">
                        <span className="text-sm font-medium">Booking ID:</span>
                        <span className="text-sm">{scanResult.booking.bookingId}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm font-medium">Parking:</span>
                        <span className="text-sm">{scanResult.booking.parkingLotName}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm font-medium">Status:</span>
                        <span
                          className={`text-sm font-medium ${
                            scanResult.booking.status === "in_use"
                              ? "text-green-600"
                              : scanResult.booking.status === "completed"
                                ? "text-blue-600"
                                : "text-gray-600"
                          }`}
                        >
                          {scanResult.booking.status.charAt(0).toUpperCase() +
                            scanResult.booking.status.slice(1).replace("_", " ")}
                        </span>
                      </div>
                    </div>
                  )}

                  <div className="mt-4 flex justify-end">
                    <Button size="sm" onClick={resetScan}>
                      {scanResult.success ? "Scan Another" : "Try Again"}
                    </Button>
                  </div>
                </div>
              </div>
            </Alert>
          )}
        </div>
      </div>
    </div>
  )
}
