import { apiClient } from "./api"

export interface AuthUser {
  id: string
  name: string
  email: string
  phone: string
  role: "client" | "admin" | "employee" | "owner"
  isActive: boolean
  createdAt: string
}

export interface LoginCredentials {
  email: string
  password: string
}

export interface RegisterData {
  name: string
  email: string
  phone: string
  password: string
  role?: string
}

class AuthService {
  private user: AuthUser | null = null

  constructor() {
    if (typeof window !== "undefined") {
      const savedUser = localStorage.getItem("user")
      if (savedUser) {
        try {
          this.user = JSON.parse(savedUser)
        } catch (error) {
          console.error("Error parsing saved user:", error)
          localStorage.removeItem("user")
        }
      }
    }
  }

  async login(credentials: LoginCredentials) {
    try {
      const response = await apiClient.login(credentials)

      if (response.success && response.data) {
        this.user = response.data.user
        if (typeof window !== "undefined") {
          localStorage.setItem("user", JSON.stringify(this.user))
        }
        return { success: true, user: this.user }
      }

      return { success: false, error: response.error || "Login failed" }
    } catch (error: any) {
      return { success: false, error: error.message || "Login failed" }
    }
  }

  async register(userData: RegisterData) {
    try {
      const response = await apiClient.register(userData)

      if (response.success) {
        return { success: true, message: response.message }
      }

      return { success: false, error: response.error || "Registration failed" }
    } catch (error: any) {
      return { success: false, error: error.message || "Registration failed" }
    }
  }

  async logout() {
    this.user = null
    if (typeof window !== "undefined") {
      localStorage.removeItem("user")
    }
    await apiClient.logout()
  }

  getCurrentUser(): AuthUser | null {
    return this.user
  }

  isAuthenticated(): boolean {
    return this.user !== null
  }

  hasRole(role: string): boolean {
    return this.user?.role === role
  }

  hasAnyRole(roles: string[]): boolean {
    return this.user ? roles.includes(this.user.role) : false
  }
}

export const authService = new AuthService()
export default authService
