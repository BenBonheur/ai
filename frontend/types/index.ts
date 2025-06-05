export interface User {
  id: string
  name: string
  email: string
  phone: string
  role: "client" | "admin" | "employee" | "owner"
  createdAt: string
  isActive: boolean
}

export interface ParkingLot {
  id: string
  name: string
  description?: string
  location: string
  address: string
  latitude: number
  longitude: number
  totalSlots: number
  availableSlots: number
  pricePerHour: number
  pricePerDay: number
  operatingHours: {
    open: string
    close: string
  }
  amenities: string[]
  features: string[]
  images: string[]
  rating: number
  totalReviews: number
  isActive: boolean
  isApproved: boolean
  ownerId: string
  ownerName?: string
  ownerPhone?: string
  createdAt: string
  updatedAt: string
}

export interface Booking {
  id: string
  userId: string
  userName?: string
  userPhone?: string
  userEmail?: string
  parkingLotId: string
  parkingLotName?: string
  parkingLotLocation?: string
  parkingLotAddress?: string
  vehicleNumber: string
  vehicleType: "car" | "motorcycle" | "truck" | "bus"
  startTime: string
  endTime: string
  durationHours: number
  totalCost: number
  paymentMethod: "mobile_money" | "credit_card" | "cash" | "bank_transfer"
  paymentStatus: "pending" | "paid" | "failed" | "refunded"
  status: "booked" | "in_use" | "completed" | "cancelled" | "no_show"
  qrCodeData?: string
  checkInTime?: string
  checkOutTime?: string
  checkedInBy?: string
  checkedOutBy?: string
  notes?: string
  createdAt: string
  updatedAt: string
}

export interface DashboardStats {
  overview: {
    totalParkingLots: number
    activeBookings: number
    totalRevenue: number
    totalUsers: number
  }
  recentBookings: Array<{
    _id: string
    count: number
    revenue: number
  }>
  parkingUtilization: Array<{
    _id: string
    name: string
    location: string
    totalSlots: number
    availableSlots: number
    utilization: number
  }>
}

export interface ApiResponse<T = any> {
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
