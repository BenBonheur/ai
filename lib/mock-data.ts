// Mock data for frontend-only development

export const mockParkingStats = {
  totalSlots: 860,
  occupiedSlots: 542,
  availableSlots: 318,
  revenue: 2450000,
  activeBookings: 127,
  totalUsers: 3456,
}

export const mockRevenueData = Array.from({ length: 30 }, (_, i) => ({
  date: new Date(Date.now() - (29 - i) * 24 * 60 * 60 * 1000).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
  }),
  revenue: Math.floor(Math.random() * 150000) + 50000,
}))

export const mockUserStats = [
  { name: "Clients", value: 2800, color: "#3b82f6" },
  { name: "Owners", value: 120, color: "#10b981" },
  { name: "Employees", value: 500, color: "#f59e0b" },
  { name: "Admins", value: 36, color: "#6366f1" },
]

export const mockBookings = [
  {
    id: "B-1234",
    user: "Jean Mutoni",
    parkingLot: "Kigali Heights Parking",
    startTime: "2023-05-28 10:00:00",
    endTime: "2023-05-28 14:00:00",
    duration: "4 hours",
    totalCost: 2000,
    status: "in_use",
  },
  {
    id: "B-1235",
    user: "Eric Mugisha",
    parkingLot: "Kigali Convention Center",
    startTime: "2023-05-28 09:30:00",
    endTime: "2023-05-28 17:00:00",
    duration: "7.5 hours",
    totalCost: 6000,
    status: "booked",
  },
]

export const mockParkingLots = [
  {
    id: "1",
    name: "Kigali Heights Parking",
    location: "Kigali City Center",
    address: "KG 7 Ave, Kigali",
    totalSlots: 120,
    availableSlots: 45,
    pricePerHour: 500,
    pricePerDay: 8000,
    isActive: true,
    rating: 4.5,
    distance: 0.8,
    amenities: ["Security", "CCTV", "24/7 Access", "EV Charging"],
    operatingHours: { open: "00:00", close: "23:59" },
    owner: "Kigali Heights Ltd",
  },
  {
    id: "2",
    name: "Kigali Convention Center",
    location: "Kimihurura",
    address: "KG 2 Roundabout, Kimihurura",
    totalSlots: 200,
    availableSlots: 78,
    pricePerHour: 800,
    pricePerDay: 12000,
    isActive: true,
    rating: 4.8,
    distance: 2.1,
    amenities: ["Security", "WiFi", "Restaurant", "EV Charging"],
    operatingHours: { open: "06:00", close: "22:00" },
    owner: "Rwanda Convention Bureau",
  },
]
