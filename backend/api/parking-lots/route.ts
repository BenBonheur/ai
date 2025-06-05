import { type NextRequest, NextResponse } from "next/server"
import connectDB from "../../lib/mongodb"
import ParkingLot from "../../models/ParkingLot"
import User from "../../models/User"

export async function GET(request: NextRequest) {
  try {
    await connectDB()

    const { searchParams } = new URL(request.url)
    const location = searchParams.get("location")
    const priceMin = searchParams.get("priceMin")
    const priceMax = searchParams.get("priceMax")
    const availableOnly = searchParams.get("availableOnly") === "true"
    const limit = Number.parseInt(searchParams.get("limit") || "20")
    const page = Number.parseInt(searchParams.get("page") || "1")
    const skip = (page - 1) * limit

    // Build query
    const query: any = { isActive: true, isApproved: true }

    if (location) {
      query.$or = [
        { location: { $regex: location, $options: "i" } },
        { address: { $regex: location, $options: "i" } },
        { name: { $regex: location, $options: "i" } },
      ]
    }

    if (priceMin) {
      query.pricePerHour = { ...query.pricePerHour, $gte: Number.parseFloat(priceMin) }
    }

    if (priceMax) {
      query.pricePerHour = { ...query.pricePerHour, $lte: Number.parseFloat(priceMax) }
    }

    if (availableOnly) {
      query.availableSlots = { $gt: 0 }
    }

    // Execute query with population
    const parkingLots = await ParkingLot.find(query)
      .populate("ownerId", "name phone")
      .sort({ rating: -1, availableSlots: -1 })
      .limit(limit)
      .skip(skip)
      .lean()

    // Get total count for pagination
    const total = await ParkingLot.countDocuments(query)

    // Format response
    const formattedParkingLots = parkingLots.map((lot) => ({
      id: lot._id,
      name: lot.name,
      description: lot.description,
      location: lot.location,
      address: lot.address,
      latitude: lot.latitude,
      longitude: lot.longitude,
      totalSlots: lot.totalSlots,
      availableSlots: lot.availableSlots,
      pricePerHour: lot.pricePerHour,
      pricePerDay: lot.pricePerDay,
      operatingHours: lot.operatingHours,
      amenities: lot.amenities,
      features: lot.features,
      images: lot.images,
      rating: lot.rating,
      totalReviews: lot.totalReviews,
      isActive: lot.isActive,
      isApproved: lot.isApproved,
      ownerId: lot.ownerId._id,
      ownerName: lot.ownerId.name,
      ownerPhone: lot.ownerId.phone,
      createdAt: lot.createdAt,
      updatedAt: lot.updatedAt,
    }))

    return NextResponse.json({
      success: true,
      data: formattedParkingLots,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    })
  } catch (error: any) {
    console.error("Get parking lots error:", error)
    return NextResponse.json({ success: false, error: "Internal server error" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    await connectDB()

    const data = await request.json()

    // Validate required fields
    const requiredFields = [
      "name",
      "location",
      "address",
      "latitude",
      "longitude",
      "totalSlots",
      "pricePerHour",
      "pricePerDay",
      "operatingHours",
      "ownerId",
    ]
    for (const field of requiredFields) {
      if (!data[field]) {
        return NextResponse.json({ success: false, error: `${field} is required` }, { status: 400 })
      }
    }

    // Verify owner exists
    const owner = await User.findById(data.ownerId)
    if (!owner) {
      return NextResponse.json({ success: false, error: "Owner not found" }, { status: 404 })
    }

    // Set available slots to total slots initially
    data.availableSlots = data.totalSlots

    // Create parking lot
    const parkingLot = await ParkingLot.create(data)

    return NextResponse.json(
      {
        success: true,
        data: parkingLot,
        message: "Parking lot created successfully",
      },
      { status: 201 },
    )
  } catch (error: any) {
    console.error("Create parking lot error:", error)

    if (error.name === "ValidationError") {
      const errors = Object.values(error.errors).map((err: any) => err.message)
      return NextResponse.json({ success: false, error: errors.join(", ") }, { status: 400 })
    }

    return NextResponse.json({ success: false, error: "Internal server error" }, { status: 500 })
  }
}
