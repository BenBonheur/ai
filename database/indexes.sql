-- Rwanda Parking App - Database Indexes
-- Performance optimization indexes

USE rwanda_parking;

-- =============================================
-- USERS TABLE INDEXES
-- =============================================

-- Composite index for user authentication
CREATE INDEX idx_users_email_password ON users(email, password);

-- Index for user role and status queries
CREATE INDEX idx_users_role_active ON users(role, is_active);

-- Index for user search by name
CREATE INDEX idx_users_name ON users(name);

-- =============================================
-- PARKING LOTS TABLE INDEXES
-- =============================================

-- Composite index for location-based searches
CREATE INDEX idx_parking_location ON parking_lots(latitude, longitude);

-- Index for active and approved parking lots
CREATE INDEX idx_parking_active_approved ON parking_lots(is_active, is_approved);

-- Index for price range searches
CREATE INDEX idx_parking_price_hour ON parking_lots(price_per_hour);
CREATE INDEX idx_parking_price_day ON parking_lots(price_per_day);

-- Index for availability searches
CREATE INDEX idx_parking_availability ON parking_lots(available_slots, total_slots);

-- Index for rating searches
CREATE INDEX idx_parking_rating ON parking_lots(rating DESC);

-- Composite index for search and filter operations
CREATE INDEX idx_parking_search ON parking_lots(is_active, is_approved, available_slots, price_per_hour, rating);

-- Index for owner's parking lots
CREATE INDEX idx_parking_owner_active ON parking_lots(owner_id, is_active);

-- =============================================
-- BOOKINGS TABLE INDEXES
-- =============================================

-- Index for user's bookings
CREATE INDEX idx_bookings_user_status ON bookings(user_id, status);

-- Index for parking lot bookings
CREATE INDEX idx_bookings_parking_status ON bookings(parking_lot_id, status);

-- Index for time-based queries
CREATE INDEX idx_bookings_start_time ON bookings(start_time);
CREATE INDEX idx_bookings_end_time ON bookings(end_time);

-- Composite index for time overlap checks
CREATE INDEX idx_bookings_time_overlap ON bookings(parking_lot_id, start_time, end_time, status);

-- Index for payment status queries
CREATE INDEX idx_bookings_payment_status ON bookings(payment_status);

-- Index for booking status and dates
CREATE INDEX idx_bookings_status_created ON bookings(status, created_at);

-- Index for vehicle number searches
CREATE INDEX idx_bookings_vehicle ON bookings(vehicle_number);

-- Index for QR code validation
CREATE INDEX idx_bookings_qr_status ON bookings(id, status);

-- Composite index for daily operations
CREATE INDEX idx_bookings_daily_ops ON bookings(parking_lot_id, status, start_time);

-- =============================================
-- REVIEWS TABLE INDEXES
-- =============================================

-- Index for parking lot reviews
CREATE INDEX idx_reviews_parking_rating ON reviews(parking_lot_id, rating);

-- Index for user reviews
CREATE INDEX idx_reviews_user ON reviews(user_id);

-- Index for verified reviews
CREATE INDEX idx_reviews_verified ON reviews(is_verified, rating);

-- Index for recent reviews
CREATE INDEX idx_reviews_recent ON reviews(created_at DESC);

-- =============================================
-- EMPLOYEES TABLE INDEXES
-- =============================================

-- Index for active employees by parking lot
CREATE INDEX idx_employees_parking_active ON employees(parking_lot_id, is_active);

-- Index for user's employment
CREATE INDEX idx_employees_user_active ON employees(user_id, is_active);

-- =============================================
-- PAYMENT TRANSACTIONS TABLE INDEXES
-- =============================================

-- Index for booking payments
CREATE INDEX idx_payments_booking ON payment_transactions(booking_id);

-- Index for transaction status
CREATE INDEX idx_payments_status ON payment_transactions(status);

-- Index for payment method analytics
CREATE INDEX idx_payments_method_date ON payment_transactions(payment_method, created_at);

-- Index for transaction ID lookups
CREATE INDEX idx_payments_transaction_id ON payment_transactions(transaction_id);

-- =============================================
-- NOTIFICATIONS TABLE INDEXES
-- =============================================

-- Index for user notifications
CREATE INDEX idx_notifications_user_read ON notifications(user_id, is_read);

-- Index for notification type
CREATE INDEX idx_notifications_type ON notifications(type);

-- Index for recent notifications
CREATE INDEX idx_notifications_recent ON notifications(created_at DESC);

-- Index for expired notifications cleanup
CREATE INDEX idx_notifications_expires ON notifications(expires_at);

-- =============================================
-- AUDIT LOGS TABLE INDEXES
-- =============================================

-- Index for user audit trail
CREATE INDEX idx_audit_user_action ON audit_logs(user_id, action);

-- Index for table audit trail
CREATE INDEX idx_audit_table_record ON audit_logs(table_name, record_id);

-- Index for recent audit logs
CREATE INDEX idx_audit_recent ON audit_logs(created_at DESC);

-- =============================================
-- SYSTEM SETTINGS TABLE INDEXES
-- =============================================

-- Index for setting key lookups
CREATE INDEX idx_settings_key ON system_settings(setting_key);

-- Index for public settings
CREATE INDEX idx_settings_public ON system_settings(is_public);

-- =============================================
-- COMPOSITE INDEXES FOR COMPLEX QUERIES
-- =============================================

-- Index for parking search with filters
CREATE INDEX idx_parking_complex_search ON parking_lots(
    is_active, is_approved, available_slots, 
    price_per_hour, rating, latitude, longitude
);

-- Index for booking analytics
CREATE INDEX idx_booking_analytics ON bookings(
    payment_status, status, created_at, total_cost
);

-- Index for revenue reporting
CREATE INDEX idx_revenue_reporting ON bookings(
    payment_status, created_at, parking_lot_id, total_cost
);

-- Index for operational queries
CREATE INDEX idx_operational_bookings ON bookings(
    status, start_time, end_time, parking_lot_id
);

-- =============================================
-- FULL-TEXT SEARCH INDEXES
-- =============================================

-- Full-text search for parking lot names and descriptions
ALTER TABLE parking_lots ADD FULLTEXT(name, description, location, address);

-- Full-text search for user names
ALTER TABLE users ADD FULLTEXT(name);

-- =============================================
-- SHOW CREATED INDEXES
-- =============================================

-- Query to show all indexes on important tables
SELECT 
    TABLE_NAME,
    INDEX_NAME,
    COLUMN_NAME,
    SEQ_IN_INDEX,
    NON_UNIQUE
FROM INFORMATION_SCHEMA.STATISTICS 
WHERE TABLE_SCHEMA = 'rwanda_parking'
    AND TABLE_NAME IN ('users', 'parking_lots', 'bookings', 'reviews', 'employees')
ORDER BY TABLE_NAME, INDEX_NAME, SEQ_IN_INDEX;
