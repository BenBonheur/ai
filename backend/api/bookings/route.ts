import { type NextRequest, NextResponse } from "next/server"
import connectDB from "../../lib/mongodb"
import Booking from "../../models/Booking"
import ParkingLot from "../../models/ParkingLot"
import User from "../../models/User"
import QRCode from "qrcode"

export async function GET(request: NextRequest) {
  try {
    await connectDB()

    const { searchParams } = new URL(request.url)
    const userId = searchParams.get("userId")
    const status = searchParams.get("status")
    const limit = Number.parseInt(searchParams.get("limit") || "20")
    const page = Number.parseInt(searchParams.get("page") || "1")
    const skip = (page - 1) * limit

    // Build query
    const query: any = {}

    if (userId) {
      query.userId = userId
    }

    if (status) {
      query.status = status
    }

    // Execute query with population
    const bookings = await Booking.find(query)
      .populate("userId", "name phone email")
      .populate("parkingLotId", "name location address")
      .sort({ createdAt: -1 })
      .limit(limit)
      .skip(skip)
      .lean()

    // Get total count for pagination
    const total = await Booking.countDocuments(query)

    // Format response
    const formattedBookings = bookings.map((booking) => ({
      id: booking._id,
      userId: booking.userId._id,
      userName: booking.userId.name,
      userPhone: booking.userId.phone,
      userEmail: booking.userId.email,
      parkingLotId: booking.parkingLotId._id,
      parkingLotName: booking.parkingLotId.name,
      parkingLotLocation: booking.parkingLotId.location,
      parkingLotAddress: booking.parkingLotId.address,
      vehicleNumber: booking.vehicleNumber,
      vehicleType: booking.vehicleType,
      startTime: booking.startTime,
      endTime: booking.endTime,
      durationHours: booking.durationHours,
      totalCost: booking.totalCost,
      paymentMethod: booking.paymentMethod,
      paymentStatus: booking.paymentStatus,
      status: booking.status,
      qrCodeData: booking.qrCodeData,
      checkInTime: booking.checkInTime,
      checkOutTime: booking.checkOutTime,
      notes: booking.notes,
      createdAt: booking.createdAt,
      updatedAt: booking.updatedAt,
    }))

    return NextResponse.json({
      success: true,
      data: formattedBookings,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    })
  } catch (error: any) {
    console.error("Get bookings error:", error)
    return NextResponse.json({ success: false, error: "Internal server error" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    await connectDB()

    const data = await request.json()

    // Validate required fields
    const requiredFields = [
      "userId",
      "parkingLotId",
      "vehicleNumber",
      "vehicleType",
      "startTime",
      "endTime",
      "durationHours",
      "totalCost",
      "paymentMethod",
    ]
    for (const field of requiredFields) {
      if (!data[field]) {
        return NextResponse.json({ success: false, error: `${field} is required` }, { status: 400 })
      }
    }

    // Verify user exists
    const user = await User.findById(data.userId)
    if (!user) {
      return NextResponse.json({ success: false, error: "User not found" }, { status: 404 })
    }

    // Verify parking lot exists and has available slots
    const parkingLot = await ParkingLot.findById(data.parkingLotId)
    if (!parkingLot) {
      return NextResponse.json({ success: false, error: "Parking lot not found" }, { status: 404 })
    }

    if (parkingLot.availableSlots <= 0) {
      return NextResponse.json({ success: false, error: "No available slots" }, { status: 400 })
    }

    // Create booking
    const booking = await Booking.create(data)

    // Generate QR code
    const qrData = JSON.stringify({
      bookingId: booking._id,
      userId: booking.userId,
      parkingLotId: booking.parkingLotId,
      vehicleNumber: booking.vehicleNumber,
      startTime: booking.startTime,
      endTime: booking.endTime,
    })

    const qrCodeDataURL = await QRCode.toDataURL(qrData)

    // Update booking with QR code
    booking.qrCodeData = qrCodeDataURL
    await booking.save()

    // Update parking lot available slots
    await ParkingLot.findByIdAndUpdate(data.parkingLotId, { $inc: { availableSlots: -1 } })

    // Populate the booking for response
    await booking.populate("userId", "name phone email")
    await booking.populate("parkingLotId", "name location address")

    return NextResponse.json(
      {
        success: true,
        data: booking,
        message: "Booking created successfully",
      },
      { status: 201 },
    )
  } catch (error: any) {
    console.error("Create booking error:", error)

    if (error.name === "ValidationError") {
      const errors = Object.values(error.errors).map((err: any) => err.message)
      return NextResponse.json({ success: false, error: errors.join(", ") }, { status: 400 })
    }

    return NextResponse.json({ success: false, error: "Internal server error" }, { status: 500 })
  }
}
