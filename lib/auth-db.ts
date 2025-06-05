// Simplified authentication system without JWT
import bcrypt from "bcryptjs"
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
}

export interface RegisterData {
  name: string
  email: string
  phone: string
  password: string
  role: "client" | "admin" | "employee" | "owner"
}

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
