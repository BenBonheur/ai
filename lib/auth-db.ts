// Simplified authentication system with JWT
import bcrypt from "bcryptjs"
import jwt from "jsonwebtoken"
import { createUser, getUserByEmail } from "./database"

export interface User {
  id: string
  name: string
  email: string
  phone: string
  role: "client" | "admin" | "employee" | "owner"
  createdAt: string
  isActive: boolean
}

export interface LoginResult {
  success: boolean
  user?: User
  error?: string
  token?: string
}

export interface RegisterData {
  name: string
  email: string
  phone: string
  password: string
  role: "client" | "admin" | "employee" | "owner"
}

// Mock user data for demo purposes
const mockUsers = [
  {
    id: "1",
    email: "admin@rwanda-parking.com",
    password: "$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi", // password
    name: "Admin User",
    role: "admin",
    createdAt: new Date(),
  },
  {
    id: "2",
    email: "employee@rwanda-parking.com",
    password: "$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi", // password
    name: "Employee User",
    role: "employee",
    createdAt: new Date(),
  },
  {
    id: "3",
    email: "owner@rwanda-parking.com",
    password: "$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi", // password
    name: "Owner User",
    role: "owner",
    createdAt: new Date(),
  },
  {
    id: "4",
    email: "client@rwanda-parking.com",
    password: "$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi", // password
    name: "Client User",
    role: "client",
    createdAt: new Date(),
  },
]

export async function registerUser(userData: RegisterData): Promise<LoginResult> {
  try {
    // Check if user already exists
    const existingUser = await getUserByEmail(userData.email)
    if (existingUser) {
      return {
        success: false,
        error: "User with this email already exists",
      }
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(userData.password, 12)

    // Create user in database
    const result = await createUser({
      ...userData,
      password: hashedPassword,
    })

    if (!result.success) {
      return {
        success: false,
        error: "Failed to create user",
      }
    }

    const newUser = result.data[0]

    // Generate JWT token
    const token = jwt.sign(
      { userId: newUser.id, email: newUser.email, role: newUser.role },
      process.env.JWT_SECRET || "fallback-secret",
      { expiresIn: "7d" },
    )

    return {
      success: true,
      user: {
        id: newUser.id,
        name: newUser.name,
        email: newUser.email,
        phone: newUser.phone,
        role: newUser.role,
        createdAt: newUser.created_at,
        isActive: true,
      },
      token,
    }
  } catch (error) {
    console.error("Registration error:", error)
    return {
      success: false,
      error: "Registration failed",
    }
  }
}

export async function loginUser(email: string, password: string, role: string): Promise<LoginResult> {
  try {
    // Get user from database
    const user = await getUserByEmail(email)

    if (!user || user.role !== role) {
      return {
        success: false,
        error: "Invalid email, password, or role",
      }
    }

    // Verify password
    const isValidPassword = await bcrypt.compare(password, user.password)
    if (!isValidPassword) {
      return {
        success: false,
        error: "Invalid email, password, or role",
      }
    }

    // Generate JWT token
    const token = jwt.sign(
      { userId: user.id, email: user.email, role: user.role },
      process.env.JWT_SECRET || "fallback-secret",
      { expiresIn: "7d" },
    )

    return {
      success: true,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        role: user.role,
        createdAt: user.created_at,
        isActive: user.is_active,
      },
      token,
    }
  } catch (error) {
    console.error("Login error:", error)
    return {
      success: false,
      error: "Login failed",
    }
  }
}

export async function getCurrentUser(): Promise<User | null> {
  // This would be used in server components
  // For client components, we'll use a different approach
  return null
}

// Client-side auth functions (for browser)
export async function getCurrentUserClient(): Promise<User | null> {
  if (typeof window === "undefined") return null

  const userStr = localStorage.getItem("user")
  if (!userStr) return null

  try {
    const user = JSON.parse(userStr)
    return user
  } catch (error) {
    console.error("Auth verification error:", error)
    localStorage.removeItem("user")
  }

  return null
}

export async function logout(): Promise<void> {
  if (typeof window !== "undefined") {
    localStorage.removeItem("user")
  }
}

export async function isAuthenticated(): Promise<boolean> {
  const user = await getCurrentUserClient()
  return user !== null
}

export async function verifyToken(token: string) {
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || "fallback-secret") as any
    const user = mockUsers.find((u) => u.id === decoded.userId)

    if (!user) {
      return { success: false, error: "User not found" }
    }

    return {
      success: true,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
      },
    }
  } catch (error) {
    console.error("Token verification error:", error)
    return { success: false, error: "Invalid token" }
  }
}
