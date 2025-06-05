import { neon } from "@neondatabase/serverless"

if (!process.env.NEON_NEON_DATABASE_URL) {
  throw new Error("NEON_DATABASE_URL is not set")
}

const sql = neon(process.env.NEON_DATABASE_URL)

export { sql }

// Database utility functions
export async function executeQuery(query: string, params: any[] = []) {
  try {
    const result = await sql(query, params)
    return { success: true, data: result }
  } catch (error) {
    console.error("Database query error:", error)
    return { success: false, error: error.message }
  }
}

// User database operations
export async function createUser(userData: {
  name: string
  email: string
  phone: string
  password: string
  role: string
}) {
  const query = `
    INSERT INTO users (name, email, phone, password, role)
    VALUES ($1, $2, $3, $4, $5)
    RETURNING id, name, email, phone, role, created_at
  `

  return executeQuery(query, [userData.name, userData.email, userData.phone, userData.password, userData.role])
}

export async function getUserByEmail(email: string) {
  const query = `
    SELECT id, name, email, phone, password, role, is_active, created_at
    FROM users 
    WHERE email = $1 AND is_active = true
  `

  const result = await executeQuery(query, [email])
  return result.success ? result.data[0] : null
}

export async function getUserById(id: string) {
  const query = `
    SELECT id, name, email, phone, role, is_active, created_at
    FROM users 
    WHERE id = $1 AND is_active = true
  `

  const result = await executeQuery(query, [id])
  return result.success ? result.data[0] : null
}

// Parking lot database operations
export async function getParkingLots(
  filters: {
    location?: string
    priceMin?: number
    priceMax?: number
    availableOnly?: boolean
    limit?: number
    offset?: number
  } = {},
) {
  let query = `
    SELECT 
      pl.*,
      u.name as owner_name
    FROM parking_lots pl
    JOIN users u ON pl.owner_id = u.id
    WHERE pl.is_active = true AND pl.is_approved = true
  `

  const params: any[] = []
  let paramCount = 0

  if (filters.location) {
    paramCount++
    query += ` AND (pl.location ILIKE $${paramCount} OR pl.address ILIKE $${paramCount})`
    params.push(`%${filters.location}%`)
  }

  if (filters.priceMin) {
    paramCount++
    query += ` AND pl.price_per_hour >= $${paramCount}`
    params.push(filters.priceMin)
  }

  if (filters.priceMax) {
    paramCount++
    query += ` AND pl.price_per_hour <= $${paramCount}`
    params.push(filters.priceMax)
  }

  if (filters.availableOnly) {
    query += ` AND pl.available_slots > 0`
  }

  query += ` ORDER BY pl.rating DESC, pl.available_slots DESC`

  if (filters.limit) {
    paramCount++
    query += ` LIMIT $${paramCount}`
    params.push(filters.limit)
  }

  if (filters.offset) {
    paramCount++
    query += ` OFFSET $${paramCount}`
    params.push(filters.offset)
  }

  return executeQuery(query, params)
}

export async function getParkingLotById(id: string) {
  const query = `
    SELECT 
      pl.*,
      u.name as owner_name,
      u.phone as owner_phone
    FROM parking_lots pl
    JOIN users u ON pl.owner_id = u.id
    WHERE pl.id = $1 AND pl.is_active = true
  `

  const result = await executeQuery(query, [id])
  return result.success ? result.data[0] : null
}

// Booking database operations
export async function createBooking(bookingData: {
  id: string
  userId: string
  parkingLotId: string
  vehicleNumber: string
  startTime: string
  endTime: string
  durationHours: number
  totalCost: number
  paymentMethod: string
}) {
  const query = `
    INSERT INTO bookings (
      id, user_id, parking_lot_id, vehicle_number, 
      start_time, end_time, duration_hours, total_cost, payment_method
    )
    VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
    RETURNING *
  `

  return executeQuery(query, [
    bookingData.id,
    bookingData.userId,
    bookingData.parkingLotId,
    bookingData.vehicleNumber,
    bookingData.startTime,
    bookingData.endTime,
    bookingData.durationHours,
    bookingData.totalCost,
    bookingData.paymentMethod,
  ])
}

export async function getUserBookings(userId: string, status?: string) {
  let query = `
    SELECT 
      b.*,
      pl.name as parking_lot_name,
      pl.location as parking_lot_location,
      pl.address as parking_lot_address
    FROM bookings b
    JOIN parking_lots pl ON b.parking_lot_id = pl.id
    WHERE b.user_id = $1
  `

  const params = [userId]

  if (status) {
    query += ` AND b.status = $2`
    params.push(status)
  }

  query += ` ORDER BY b.created_at DESC`

  return executeQuery(query, params)
}

export async function getBookingById(id: string) {
  const query = `
    SELECT 
      b.*,
      pl.name as parking_lot_name,
      pl.location as parking_lot_location,
      pl.address as parking_lot_address,
      u.name as user_name,
      u.phone as user_phone
    FROM bookings b
    JOIN parking_lots pl ON b.parking_lot_id = pl.id
    JOIN users u ON b.user_id = u.id
    WHERE b.id = $1
  `

  const result = await executeQuery(query, [id])
  return result.success ? result.data[0] : null
}

export async function updateBookingStatus(id: string, status: string, updatedBy?: string) {
  let query = `
    UPDATE bookings 
    SET status = $2, updated_at = CURRENT_TIMESTAMP
  `
  const params = [id, status]

  if (status === "in_use" && updatedBy) {
    query += `, check_in_time = CURRENT_TIMESTAMP, checked_in_by = $3`
    params.push(updatedBy)
  } else if (status === "completed" && updatedBy) {
    query += `, check_out_time = CURRENT_TIMESTAMP, checked_out_by = $3`
    params.push(updatedBy)
  }

  query += ` WHERE id = $1 RETURNING *`

  return executeQuery(query, params)
}

// Analytics functions
export async function getDashboardStats() {
  const queries = {
    totalParkingLots: `SELECT COUNT(*) as count FROM parking_lots WHERE is_active = true`,
    activeBookings: `SELECT COUNT(*) as count FROM bookings WHERE status IN ('booked', 'in_use')`,
    totalRevenue: `SELECT COALESCE(SUM(total_cost), 0) as total FROM bookings WHERE payment_status = 'paid'`,
    totalUsers: `SELECT COUNT(*) as count FROM users WHERE is_active = true`,
  }

  const results = await Promise.all([
    executeQuery(queries.totalParkingLots),
    executeQuery(queries.activeBookings),
    executeQuery(queries.totalRevenue),
    executeQuery(queries.totalUsers),
  ])

  return {
    totalParkingLots: results[0].success ? results[0].data[0].count : 0,
    activeBookings: results[1].success ? results[1].data[0].count : 0,
    totalRevenue: results[2].success ? results[2].data[0].total : 0,
    totalUsers: results[3].success ? results[3].data[0].count : 0,
  }
}
