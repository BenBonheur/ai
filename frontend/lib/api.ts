const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "/backend/api"

interface ApiResponse<T = any> {
  success: boolean
  data?: T
  error?: string
  message?: string
  pagination?: {
    page: number
    limit: number
    total: number
    pages: number
  }
}

class ApiClient {
  private baseURL: string
  private token: string | null = null

  constructor(baseURL: string) {
    this.baseURL = baseURL
    if (typeof window !== "undefined") {
      this.token = localStorage.getItem("token")
    }
  }

  setToken(token: string) {
    this.token = token
    if (typeof window !== "undefined") {
      localStorage.setItem("token", token)
    }
  }

  removeToken() {
    this.token = null
    if (typeof window !== "undefined") {
      localStorage.removeItem("token")
    }
  }

  private async request<T>(endpoint: string, options: RequestInit = {}): Promise<ApiResponse<T>> {
    const url = `${this.baseURL}${endpoint}`

    const headers: HeadersInit = {
      "Content-Type": "application/json",
      ...options.headers,
    }

    if (this.token) {
      headers.Authorization = `Bearer ${this.token}`
    }

    try {
      const response = await fetch(url, {
        ...options,
        headers,
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || "Request failed")
      }

      return data
    } catch (error) {
      console.error("API request error:", error)
      throw error
    }
  }

  // Auth methods
  async register(userData: {
    name: string
    email: string
    phone: string
    password: string
    role?: string
  }) {
    return this.request("/auth/register", {
      method: "POST",
      body: JSON.stringify(userData),
    })
  }

  async login(credentials: { email: string; password: string }) {
    const response = await this.request("/auth/login", {
      method: "POST",
      body: JSON.stringify(credentials),
    })

    if (response.success && response.data?.token) {
      this.setToken(response.data.token)
    }

    return response
  }

  async logout() {
    this.removeToken()
  }

  // Parking lots methods
  async getParkingLots(params?: {
    location?: string
    priceMin?: number
    priceMax?: number
    availableOnly?: boolean
    limit?: number
    page?: number
  }) {
    const searchParams = new URLSearchParams()

    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          searchParams.append(key, value.toString())
        }
      })
    }

    const queryString = searchParams.toString()
    const endpoint = `/parking-lots${queryString ? `?${queryString}` : ""}`

    return this.request(endpoint)
  }

  async createParkingLot(parkingLotData: any) {
    return this.request("/parking-lots", {
      method: "POST",
      body: JSON.stringify(parkingLotData),
    })
  }

  // Bookings methods
  async getBookings(params?: {
    userId?: string
    status?: string
    limit?: number
    page?: number
  }) {
    const searchParams = new URLSearchParams()

    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          searchParams.append(key, value.toString())
        }
      })
    }

    const queryString = searchParams.toString()
    const endpoint = `/bookings${queryString ? `?${queryString}` : ""}`

    return this.request(endpoint)
  }

  async createBooking(bookingData: any) {
    return this.request("/bookings", {
      method: "POST",
      body: JSON.stringify(bookingData),
    })
  }

  // Dashboard methods
  async getDashboardStats() {
    return this.request("/dashboard/stats")
  }
}

export const apiClient = new ApiClient(API_BASE_URL)
export default apiClient
