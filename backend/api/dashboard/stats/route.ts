import { type NextRequest, NextResponse } from "next/server"
import connectDB from "../../../lib/mongodb"
import ParkingLot from "../../../models/ParkingLot"
import Booking from "../../../models/Booking"
import User from "../../../models/User"

export async function GET(request: NextRequest) {
  try {
    await connectDB()

    // Get dashboard statistics
    const [totalParkingLots, activeBookings, totalRevenue, totalUsers] = await Promise.all([
      ParkingLot.countDocuments({ isActive: true }),
      Booking.countDocuments({ status: { $in: ["booked", "in_use"] } }),
      Booking.aggregate([
        { $match: { paymentStatus: "paid" } },
        { $group: { _id: null, total: { $sum: "$totalCost" } } },
      ]),
      User.countDocuments({ isActive: true }),
    ])

    const revenue = totalRevenue.length > 0 ? totalRevenue[0].total : 0

    // Get recent bookings for chart data
    const recentBookings = await Booking.aggregate([
      {
        $match: {
          createdAt: { $gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) }, // Last 30 days
        },
      },
      {
        $group: {
          _id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } },
          count: { $sum: 1 },
          revenue: { $sum: { $cond: [{ $eq: ["$paymentStatus", "paid"] }, "$totalCost", 0] } },
        },
      },
      { $sort: { _id: 1 } },
    ])

    // Get parking lot utilization
    const parkingUtilization = await ParkingLot.aggregate([
      {
        $match: { isActive: true },
      },
      {
        $project: {
          name: 1,
          location: 1,
          totalSlots: 1,
          availableSlots: 1,
          utilization: {
            $multiply: [{ $divide: [{ $subtract: ["$totalSlots", "$availableSlots"] }, "$totalSlots"] }, 100],
          },
        },
      },
      { $sort: { utilization: -1 } },
      { $limit: 10 },
    ])

    return NextResponse.json({
      success: true,
      data: {
        overview: {
          totalParkingLots,
          activeBookings,
          totalRevenue: revenue,
          totalUsers,
        },
        recentBookings,
        parkingUtilization,
      },
    })
  } catch (error: any) {
    console.error("Dashboard stats error:", error)
    return NextResponse.json({ success: false, error: "Internal server error" }, { status: 500 })
  }
}
