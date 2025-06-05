import { type NextRequest, NextResponse } from "next/server"

export async function GET(request: NextRequest) {
  try {
    // For demo purposes, return mock data
    // In a real app, you would get user from session/auth
    const mockBookings = [
      {
        id: "B-2023001",
        user_id: "1",
        parking_lot_id: "1",
        parking_lot_name: "Kigali Heights Parking",
        vehicle_number: "RAD 123 A",
        start_time: "2023-05-28T10:00:00",
        end_time: "2023-05-28T14:00:00",
        total_cost: 2000,
        status: "completed",
        payment_status: "paid",
        created_at: "2023-05-28T09:30:00",
      },
    ]

    return NextResponse.json({
      success: true,
      data: {
        bookings: mockBookings,
        total: mockBookings.length,
      },
    })
  } catch (error) {
    console.error("Bookings GET API error:", error)
    return NextResponse.json({ success: false, error: "Internal server error" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { parking_lot_id, start_time, end_time, vehicle_number, payment_method } = body

    // Validate required fields
    if (!parking_lot_id || !start_time || !end_time || !vehicle_number || !payment_method) {
      return NextResponse.json({ success: false, error: "Missing required fields" }, { status: 400 })
    }

    // Calculate duration and cost
    const startDate = new Date(start_time)
    const endDate = new Date(end_time)
    const durationHours = (endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60)

    // For now, use a base rate of 500 RWF/hour
    const totalCost = Math.ceil(durationHours * 500)

    // Generate booking ID
    const bookingId = `B-${Date.now()}`

    // For demo purposes, return success without actual database operation
    const mockBooking = {
      id: bookingId,
      user_id: "demo-user",
      parking_lot_id,
      vehicle_number,
      start_time,
      end_time,
      duration_hours: durationHours,
      total_cost: totalCost,
      payment_method,
      status: "booked",
      payment_status: "paid",
      created_at: new Date().toISOString(),
    }

    return NextResponse.json({
      success: true,
      data: {
        booking: mockBooking,
      },
    })
  } catch (error) {
    console.error("Booking creation API error:", error)
    return NextResponse.json({ success: false, error: "Internal server error" }, { status: 500 })
  }
}
