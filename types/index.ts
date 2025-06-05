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
  createdAt: string
  updatedAt: string
}

export interface Booking {
  id: string
  userId: string
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

export interface Review {
  id: string
  userId: string
  parkingLotId: string
  bookingId?: string
  rating: number
  title?: string
  comment?: string
  isVerified: boolean
  helpfulCount: number
  createdAt: string
  updatedAt: string
}

export interface Employee {
  id: string
  userId: string
  parkingLotId: string
  position: string
  salary?: number
  hireDate: string
  isActive: boolean
  assignedAt: string
}

export interface DashboardStats {
  totalParkingLots: number
  activeBookings: number
  totalRevenue: number
  totalUsers: number
}

export interface ApiResponse<T = any> {
  success: boolean
  data?: T
  error?: string
  message?: string
}
