import bcrypt from "bcryptjs"
import jwt from "jsonwebtoken"

// Mock database - in production, this would be replaced with actual database calls
const users: Array<{
  id: string
  email: string
  password: string
  name: string
  role: "admin" | "client" | "employee" | "owner"
  createdAt: string
  isActive: boolean
}> = [
  {
    id: "1",
    email: "admin@parking.rw",
    password: "$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewdBPj6ukx.LrUpm", // password123
    name: "Admin User",
    role: "admin",
    createdAt: new Date().toISOString(),
    isActive: true,
  },
  {
    id: "2",
    email: "client@example.com",
    password: "$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewdBPj6ukx.LrUpm", // password123
    name: "John Doe",
    role: "client",
    createdAt: new Date().toISOString(),
    isActive: true,
  },
  {
    id: "3",
    email: "employee@parking.rw",
    password: "$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewdBPj6ukx.LrUpm", // password123
    name: "Jane Smith",
    role: "employee",
    createdAt: new Date().toISOString(),
    isActive: true,
  },
  {
    id: "4",
    email: "owner@parking.rw",
    password: "$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewdBPj6ukx.LrUpm", // password123
    name: "Parking Owner",
    role: "owner",
    createdAt: new Date().toISOString(),
    isActive: true,
  },
]

const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key-here"

export interface User {
  id: string
  email: string
  name: string
  role: "admin" | "client" | "employee" | "owner"
  createdAt: string
  isActive: boolean
}

export interface LoginCredentials {
  email: string
  password: string
}

export interface RegisterData {
  email: string
  password: string
  name: string
  role?: "client" | "employee" | "owner"
}

export async function loginUser(credentials: LoginCredentials): Promise<{
  success: boolean
  user?: User
  token?: string
  message?: string
}> {
  try {
    const { email, password } = credentials

    // Find user by email
    const user = users.find((u) => u.email.toLowerCase() === email.toLowerCase())

    if (!user) {
      return {
        success: false,
        message: "Invalid email or password",
      }
    }

    if (!user.isActive) {
      return {
        success: false,
        message: "Account is deactivated. Please contact support.",
      }
    }

    // Verify password
    const isPasswordValid = await bcrypt.compare(password, user.password)

    if (!isPasswordValid) {
      return {
        success: false,
        message: "Invalid email or password",
      }
    }

    // Generate JWT token
    const token = jwt.sign(
      {
        userId: user.id,
        email: user.email,
        role: user.role,
      },
      JWT_SECRET,
      { expiresIn: "7d" },
    )

    // Return user data without password
    const { password: _, ...userWithoutPassword } = user

    return {
      success: true,
      user: userWithoutPassword,
      token,
    }
  } catch (error) {
    console.error("Login error:", error)
    return {
      success: false,
      message: "An error occurred during login. Please try again.",
    }
  }
}

export async function registerUser(userData: RegisterData): Promise<{
  success: boolean
  user?: User
  token?: string
  message?: string
}> {
  try {
    const { email, password, name, role = "client" } = userData

    // Check if user already exists
    const existingUser = users.find((u) => u.email.toLowerCase() === email.toLowerCase())

    if (existingUser) {
      return {
        success: false,
        message: "User with this email already exists",
      }
    }

    // Validate password strength
    if (password.length < 6) {
      return {
        success: false,
        message: "Password must be at least 6 characters long",
      }
    }

    // Hash password
    const saltRounds = 12
    const hashedPassword = await bcrypt.hash(password, saltRounds)

    // Create new user
    const newUser = {
      id: (users.length + 1).toString(),
      email: email.toLowerCase(),
      password: hashedPassword,
      name,
      role,
      createdAt: new Date().toISOString(),
      isActive: true,
    }

    // Add to mock database
    users.push(newUser)

    // Generate JWT token
    const token = jwt.sign(
      {
        userId: newUser.id,
        email: newUser.email,
        role: newUser.role,
      },
      JWT_SECRET,
      { expiresIn: "7d" },
    )

    // Return user data without password
    const { password: _, ...userWithoutPassword } = newUser

    return {
      success: true,
      user: userWithoutPassword,
      token,
    }
  } catch (error) {
    console.error("Registration error:", error)
    return {
      success: false,
      message: "An error occurred during registration. Please try again.",
    }
  }
}

export async function verifyToken(token: string): Promise<{
  success: boolean
  user?: User
  message?: string
}> {
  try {
    const decoded = jwt.verify(token, JWT_SECRET) as {
      userId: string
      email: string
      role: string
    }

    // Find user by ID
    const user = users.find((u) => u.id === decoded.userId)

    if (!user || !user.isActive) {
      return {
        success: false,
        message: "User not found or account deactivated",
      }
    }

    // Return user data without password
    const { password: _, ...userWithoutPassword } = user

    return {
      success: true,
      user: userWithoutPassword,
    }
  } catch (error) {
    return {
      success: false,
      message: "Invalid or expired token",
    }
  }
}

export async function getUserById(id: string): Promise<User | null> {
  const user = users.find((u) => u.id === id)
  if (!user) return null

  const { password: _, ...userWithoutPassword } = user
  return userWithoutPassword
}

export async function updateUserProfile(
  userId: string,
  updates: Partial<Pick<User, "name" | "email">>,
): Promise<{
  success: boolean
  user?: User
  message?: string
}> {
  try {
    const userIndex = users.findIndex((u) => u.id === userId)

    if (userIndex === -1) {
      return {
        success: false,
        message: "User not found",
      }
    }

    // Check if email is being updated and if it already exists
    if (updates.email) {
      const emailExists = users.some((u) => u.email.toLowerCase() === updates.email!.toLowerCase() && u.id !== userId)

      if (emailExists) {
        return {
          success: false,
          message: "Email already in use by another account",
        }
      }
    }

    // Update user
    users[userIndex] = {
      ...users[userIndex],
      ...updates,
      email: updates.email?.toLowerCase() || users[userIndex].email,
    }

    const { password: _, ...userWithoutPassword } = users[userIndex]

    return {
      success: true,
      user: userWithoutPassword,
    }
  } catch (error) {
    console.error("Update profile error:", error)
    return {
      success: false,
      message: "An error occurred while updating profile",
    }
  }
}

export async function changePassword(
  userId: string,
  currentPassword: string,
  newPassword: string,
): Promise<{
  success: boolean
  message?: string
}> {
  try {
    const user = users.find((u) => u.id === userId)

    if (!user) {
      return {
        success: false,
        message: "User not found",
      }
    }

    // Verify current password
    const isCurrentPasswordValid = await bcrypt.compare(currentPassword, user.password)

    if (!isCurrentPasswordValid) {
      return {
        success: false,
        message: "Current password is incorrect",
      }
    }

    // Validate new password
    if (newPassword.length < 6) {
      return {
        success: false,
        message: "New password must be at least 6 characters long",
      }
    }

    // Hash new password
    const saltRounds = 12
    const hashedNewPassword = await bcrypt.hash(newPassword, saltRounds)

    // Update password
    const userIndex = users.findIndex((u) => u.id === userId)
    users[userIndex].password = hashedNewPassword

    return {
      success: true,
      message: "Password updated successfully",
    }
  } catch (error) {
    console.error("Change password error:", error)
    return {
      success: false,
      message: "An error occurred while changing password",
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
