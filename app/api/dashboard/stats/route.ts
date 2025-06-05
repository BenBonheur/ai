import { type NextRequest, NextResponse } from "next/server"

export async function GET(request: NextRequest) {
  try {
    // For demo purposes, return mock stats
    const mockStats = {
      totalParkingLots: 8,
      activeBookings: 15,
      totalRevenue: 2450000,
      totalUsers: 1247,
    }

    return NextResponse.json({
      success: true,
      data: mockStats,
    })
  } catch (error) {
    console.error("Dashboard stats API error:", error)
    return NextResponse.json({ success: false, error: "Internal server error" }, { status: 500 })
  }
}
