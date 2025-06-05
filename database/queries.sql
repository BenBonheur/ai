-- Rwanda Parking App - Useful SQL Queries
-- Common queries for application functionality

USE rwanda_parking;

-- =============================================
-- USER MANAGEMENT QUERIES
-- =============================================

-- Get all users with their role counts
SELECT 
    role,
    COUNT(*) as user_count,
    COUNT(CASE WHEN is_active = TRUE THEN 1 END) as active_count
FROM users 
GROUP BY role;

-- Get user details with their total bookings and spending
SELECT 
    u.id,
    u.name,
    u.email,
    u.role,
    COUNT(b.id) as total_bookings,
    COALESCE(SUM(b.total_cost), 0) as total_spent,
    u.created_at
FROM users u
LEFT JOIN bookings b ON u.id = b.user_id
WHERE u.role = 'client'
GROUP BY u.id, u.name, u.email, u.role, u.created_at
ORDER BY total_spent DESC;

-- =============================================
-- PARKING LOT QUERIES
-- =============================================

-- Get all parking lots with availability and ratings
SELECT 
    pl.id,
    pl.name,
    pl.location,
    pl.total_slots,
    pl.available_slots,
    ROUND((pl.available_slots / pl.total_slots) * 100, 2) as availability_percentage,
    pl.price_per_hour,
    pl.rating,
    pl.total_reviews,
    u.name as owner_name
FROM parking_lots pl
JOIN users u ON pl.owner_id = u.id
WHERE pl.is_active = TRUE AND pl.is_approved = TRUE
ORDER BY pl.rating DESC, availability_percentage DESC;

-- Get parking lots with low availability (less than 20%)
SELECT 
    pl.name,
    pl.location,
    pl.available_slots,
    pl.total_slots,
    ROUND((pl.available_slots / pl.total_slots) * 100, 2) as availability_percentage
FROM parking_lots pl
WHERE pl.is_active = TRUE 
    AND (pl.available_slots / pl.total_slots) < 0.2
ORDER BY availability_percentage ASC;

-- Get parking lots by price range
SELECT 
    pl.name,
    pl.location,
    pl.price_per_hour,
    pl.price_per_day,
    pl.available_slots,
    CASE 
        WHEN pl.price_per_hour <= 400 THEN 'Budget'
        WHEN pl.price_per_hour <= 800 THEN 'Mid-range'
        ELSE 'Premium'
    END as price_category
FROM parking_lots pl
WHERE pl.is_active = TRUE AND pl.is_approved = TRUE
ORDER BY pl.price_per_hour;

-- =============================================
-- BOOKING QUERIES
-- =============================================

-- Get booking statistics by status
SELECT 
    status,
    COUNT(*) as booking_count,
    SUM(total_cost) as total_revenue
FROM bookings
GROUP BY status
ORDER BY booking_count DESC;

-- Get daily booking revenue for the last 30 days
SELECT 
    DATE(created_at) as booking_date,
    COUNT(*) as total_bookings,
    SUM(total_cost) as daily_revenue,
    AVG(total_cost) as avg_booking_value
FROM bookings
WHERE created_at >= DATE_SUB(CURDATE(), INTERVAL 30 DAY)
    AND payment_status = 'paid'
GROUP BY DATE(created_at)
ORDER BY booking_date DESC;

-- Get active bookings (currently in use)
SELECT 
    b.id,
    u.name as customer_name,
    u.phone,
    pl.name as parking_lot,
    b.vehicle_number,
    b.start_time,
    b.end_time,
    b.status,
    TIMESTAMPDIFF(MINUTE, NOW(), b.end_time) as minutes_remaining
FROM bookings b
JOIN users u ON b.user_id = u.id
JOIN parking_lots pl ON b.parking_lot_id = pl.id
WHERE b.status = 'in_use'
    AND b.end_time > NOW()
ORDER BY b.end_time;

-- Get overdue bookings (should have ended but still in_use)
SELECT 
    b.id,
    u.name as customer_name,
    u.phone,
    pl.name as parking_lot,
    b.vehicle_number,
    b.end_time,
    TIMESTAMPDIFF(MINUTE, b.end_time, NOW()) as minutes_overdue
FROM bookings b
JOIN users u ON b.user_id = u.id
JOIN parking_lots pl ON b.parking_lot_id = pl.id
WHERE b.status = 'in_use'
    AND b.end_time < NOW()
ORDER BY minutes_overdue DESC;

-- =============================================
-- REVENUE AND ANALYTICS QUERIES
-- =============================================

-- Monthly revenue report
SELECT 
    YEAR(created_at) as year,
    MONTH(created_at) as month,
    MONTHNAME(created_at) as month_name,
    COUNT(*) as total_bookings,
    SUM(total_cost) as total_revenue,
    AVG(total_cost) as avg_booking_value,
    COUNT(DISTINCT user_id) as unique_customers
FROM bookings
WHERE payment_status = 'paid'
GROUP BY YEAR(created_at), MONTH(created_at)
ORDER BY year DESC, month DESC;

-- Top performing parking lots by revenue
SELECT 
    pl.name,
    pl.location,
    COUNT(b.id) as total_bookings,
    SUM(b.total_cost) as total_revenue,
    AVG(b.total_cost) as avg_booking_value,
    pl.rating
FROM parking_lots pl
JOIN bookings b ON pl.id = b.parking_lot_id
WHERE b.payment_status = 'paid'
GROUP BY pl.id, pl.name, pl.location, pl.rating
ORDER BY total_revenue DESC
LIMIT 10;

-- Customer lifetime value
SELECT 
    u.name,
    u.email,
    COUNT(b.id) as total_bookings,
    SUM(b.total_cost) as lifetime_value,
    AVG(b.total_cost) as avg_booking_value,
    MIN(b.created_at) as first_booking,
    MAX(b.created_at) as last_booking,
    DATEDIFF(MAX(b.created_at), MIN(b.created_at)) as customer_lifespan_days
FROM users u
JOIN bookings b ON u.id = b.user_id
WHERE u.role = 'client' AND b.payment_status = 'paid'
GROUP BY u.id, u.name, u.email
HAVING total_bookings > 1
ORDER BY lifetime_value DESC;

-- =============================================
-- OPERATIONAL QUERIES
-- =============================================

-- Get bookings for a specific parking lot today
SELECT 
    b.id,
    u.name as customer_name,
    u.phone,
    b.vehicle_number,
    b.start_time,
    b.end_time,
    b.status,
    b.total_cost
FROM bookings b
JOIN users u ON b.user_id = u.id
WHERE b.parking_lot_id = 1  -- Replace with actual parking lot ID
    AND DATE(b.start_time) = CURDATE()
ORDER BY b.start_time;

-- Update parking lot availability after booking
-- This would typically be done in a trigger or application logic
UPDATE parking_lots 
SET available_slots = available_slots - 1 
WHERE id = 1 AND available_slots > 0;

-- Update parking lot availability after checkout
UPDATE parking_lots 
SET available_slots = available_slots + 1 
WHERE id = 1 AND available_slots < total_slots;

-- Get employee assignments
SELECT 
    u.name as employee_name,
    u.email,
    pl.name as parking_lot,
    e.position,
    e.hire_date,
    e.is_active
FROM employees e
JOIN users u ON e.user_id = u.id
JOIN parking_lots pl ON e.parking_lot_id = pl.id
WHERE e.is_active = TRUE
ORDER BY pl.name, e.position;

-- =============================================
-- SEARCH AND FILTER QUERIES
-- =============================================

-- Search parking lots by location and availability
SELECT 
    pl.id,
    pl.name,
    pl.address,
    pl.available_slots,
    pl.total_slots,
    pl.price_per_hour,
    pl.rating,
    (6371 * acos(cos(radians(-1.9441)) * cos(radians(pl.latitude)) * 
     cos(radians(pl.longitude) - radians(30.0619)) + 
     sin(radians(-1.9441)) * sin(radians(pl.latitude)))) AS distance_km
FROM parking_lots pl
WHERE pl.is_active = TRUE 
    AND pl.is_approved = TRUE
    AND pl.available_slots > 0
    AND pl.price_per_hour BETWEEN 300 AND 800
HAVING distance_km < 10
ORDER BY distance_km, pl.rating DESC;

-- Get available parking for specific time slot
SELECT 
    pl.id,
    pl.name,
    pl.location,
    pl.available_slots,
    pl.price_per_hour
FROM parking_lots pl
WHERE pl.is_active = TRUE 
    AND pl.is_approved = TRUE
    AND pl.available_slots > 0
    AND pl.id NOT IN (
        SELECT DISTINCT parking_lot_id 
        FROM bookings 
        WHERE status IN ('booked', 'in_use')
            AND start_time <= '2023-05-29 16:00:00'
            AND end_time >= '2023-05-29 14:00:00'
    )
ORDER BY pl.rating DESC;

-- =============================================
-- MAINTENANCE AND CLEANUP QUERIES
-- =============================================

-- Clean up old notifications (older than 30 days)
DELETE FROM notifications 
WHERE created_at < DATE_SUB(NOW(), INTERVAL 30 DAY) 
    AND is_read = TRUE;

-- Update booking status for expired bookings
UPDATE bookings 
SET status = 'no_show' 
WHERE status = 'booked' 
    AND end_time < DATE_SUB(NOW(), INTERVAL 1 HOUR);

-- Update parking lot ratings based on reviews
UPDATE parking_lots pl
SET rating = (
    SELECT ROUND(AVG(r.rating), 2)
    FROM reviews r
    WHERE r.parking_lot_id = pl.id
),
total_reviews = (
    SELECT COUNT(*)
    FROM reviews r
    WHERE r.parking_lot_id = pl.id
);

-- =============================================
-- REPORTING QUERIES
-- =============================================

-- Generate daily operations report
SELECT 
    DATE(NOW()) as report_date,
    COUNT(CASE WHEN b.status = 'booked' THEN 1 END) as upcoming_bookings,
    COUNT(CASE WHEN b.status = 'in_use' THEN 1 END) as active_bookings,
    COUNT(CASE WHEN b.status = 'completed' AND DATE(b.updated_at) = CURDATE() THEN 1 END) as completed_today,
    SUM(CASE WHEN b.payment_status = 'paid' AND DATE(b.created_at) = CURDATE() THEN b.total_cost ELSE 0 END) as revenue_today,
    (SELECT SUM(available_slots) FROM parking_lots WHERE is_active = TRUE) as total_available_slots,
    (SELECT SUM(total_slots) FROM parking_lots WHERE is_active = TRUE) as total_slots
FROM bookings b;
