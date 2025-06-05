import { type NextRequest, NextResponse } from "next/server"
import connectDB from "../../../lib/mongodb"
import User from "../../../models/User"

export async function POST(request: NextRequest) {
  try {
    await connectDB()

    const { name, email, phone, password, role = "client" } = await request.json()

    // Validate required fields
    if (!name || !email || !phone || !password) {
      return NextResponse.json({ success: false, error: "All fields are required" }, { status: 400 })
    }

    // Check if user already exists
    const existingUser = await User.findOne({ email })
    if (existingUser) {
      return NextResponse.json({ success: false, error: "User already exists with this email" }, { status: 400 })
    }

    // Create new user
    const user = await User.create({
      name,
      email,
      phone,
      password,
      role,
    })

    // Remove password from response
    const userResponse = {
      id: user._id,
      name: user.name,
      email: user.email,
      phone: user.phone,
      role: user.role,
      isActive: user.isActive,
      createdAt: user.createdAt,
    }

    return NextResponse.json(
      {
        success: true,
        data: userResponse,
        message: "User registered successfully",
      },
      { status: 201 },
    )
  } catch (error: any) {
    console.error("Registration error:", error)

    if (error.name === "ValidationError") {
      const errors = Object.values(error.errors).map((err: any) => err.message)
      return NextResponse.json({ success: false, error: errors.join(", ") }, { status: 400 })
    }

    return NextResponse.json({ success: false, error: "Internal server error" }, { status: 500 })
  }
}
