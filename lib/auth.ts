// Frontend-only authentication using localStorage
export interface User {
  id: string
  name: string
  email: string
  phone: string
  role: "client" | "admin" | "employee" | "owner"
  isActive: boolean
  createdAt: string
}

// Mock users for demo
const MOCK_USERS: User[] = [
  {
    id: "1",
    name: "Admin User",
    email: "admin@rwandaparking.com",
    phone: "+250 78 123 4567",
    role: "admin",
    isActive: true,
    createdAt: "2023-01-01T00:00:00Z",
  },
  {
    id: "2",
    name: "Parking Owner",
    email: "owner@rwandaparking.com",
    phone: "+250 78 234 5678",
    role: "owner",
    isActive: true,
    createdAt: "2023-01-01T00:00:00Z",
  },
  {
    id: "3",
    name: "Employee User",
    email: "employee@rwandaparking.com",
    phone: "+250 78 345 6789",
    role: "employee",
    isActive: true,
    createdAt: "2023-01-01T00:00:00Z",
  },
  {
    id: "4",
    name: "Client User",
    email: "client@rwandaparking.com",
    phone: "+250 78 456 7890",
    role: "client",
    isActive: true,
    createdAt: "2023-01-01T00:00:00Z",
  },
]

export async function getCurrentUser(): Promise<User | null> {
  if (typeof window === "undefined") return null

  const userStr = localStorage.getItem("currentUser")
  if (!userStr) return null

  try {
    return JSON.parse(userStr)
  } catch {
    return null
  }
}

export async function loginUser(email: string, password: string, role: string) {
  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 1000))

  // Find user by email and role
  const user = MOCK_USERS.find((u) => u.email === email && u.role === role)

  if (!user) {
    return { success: false, error: "Invalid credentials" }
  }

  // Check demo passwords
  const validPasswords: Record<string, string> = {
    "admin@rwandaparking.com": "admin123",
    "owner@rwandaparking.com": "owner123",
    "employee@rwandaparking.com": "employee123",
    "client@rwandaparking.com": "client123",
  }

  if (validPasswords[email] !== password) {
    return { success: false, error: "Invalid password" }
  }

  // Store user in localStorage
  localStorage.setItem("currentUser", JSON.stringify(user))

  return { success: true, user }
}

export async function registerUser(userData: {
  name: string
  email: string
  phone: string
  password: string
  role: "client" | "admin" | "employee" | "owner"
}) {
  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 1000))

  // Check if user already exists
  const existingUser = MOCK_USERS.find((u) => u.email === userData.email)
  if (existingUser) {
    return { success: false, error: "User already exists" }
  }

  // Create new user
  const newUser: User = {
    id: Date.now().toString(),
    name: userData.name,
    email: userData.email,
    phone: userData.phone,
    role: userData.role,
    isActive: true,
    createdAt: new Date().toISOString(),
  }

  // Store user in localStorage
  localStorage.setItem("currentUser", JSON.stringify(newUser))

  return { success: true, user: newUser }
}

export async function logout() {
  localStorage.removeItem("currentUser")
  window.location.href = "/login"
}

export function canAccessRoute(userRole: string, requiredRoles: string[]): boolean {
  return requiredRoles.includes(userRole)
}
