import { type NextRequest, NextResponse } from "next/server"
import { getParkingLots } from "@/lib/database"

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)

    const filters = {
      location: searchParams.get("location") || undefined,
      priceMin: searchParams.get("price_min") ? Number(searchParams.get("price_min")) : undefined,
      priceMax: searchParams.get("price_max") ? Number(searchParams.get("price_max")) : undefined,
      availableOnly: searchParams.get("available_only") === "true",
      limit: searchParams.get("limit") ? Number(searchParams.get("limit")) : 20,
      offset: searchParams.get("offset") ? Number(searchParams.get("offset")) : 0,
    }

    const result = await getParkingLots(filters)

    if (result.success) {
      return NextResponse.json({
        success: true,
        data: {
          parking_lots: result.data,
          total: result.data.length,
        },
      })
    } else {
      return NextResponse.json({ success: false, error: "Failed to fetch parking lots" }, { status: 500 })
    }
  } catch (error) {
    console.error("Parking lots API error:", error)
    return NextResponse.json({ success: false, error: "Internal server error" }, { status: 500 })
  }
}
