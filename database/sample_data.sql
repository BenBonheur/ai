-- Rwanda Parking App Sample Data
-- Insert sample data for testing and development

USE rwanda_parking;

-- Insert sample users
INSERT INTO users (name, email, phone, password, role, is_active, email_verified) VALUES
('Admin User', 'admin@rwandaparking.com', '+250 78 123 4567', '$2b$10$hashedpassword1', 'admin', TRUE, TRUE),
('John Uwimana', 'owner@rwandaparking.com', '+250 72 987 6543', '$2b$10$hashedpassword2', 'owner', TRUE, TRUE),
('Mary Mukamana', 'employee@rwandaparking.com', '+250 73 456 7890', '$2b$10$hashedpassword3', 'employee', TRUE, TRUE),
('Jean Mutoni', 'client@rwandaparking.com', '+250 78 567 8901', '$2b$10$hashedpassword4', 'client', TRUE, TRUE),
('Eric Mugisha', 'eric.mugisha@gmail.com', '+250 72 345 6789', '$2b$10$hashedpassword5', 'client', TRUE, TRUE),
('Alice Uwase', 'alice.uwase@gmail.com', '+250 73 234 5678', '$2b$10$hashedpassword6', 'client', TRUE, TRUE),
('Robert Keza', 'robert.keza@gmail.com', '+250 78 123 9876', '$2b$10$hashedpassword7', 'employee', TRUE, TRUE),
('Marie Uwimana', 'marie.uwimana@gmail.com', '+250 72 876 5432', '$2b$10$hashedpassword8', 'client', TRUE, TRUE),
('David Nkurunziza', 'david.owner@gmail.com', '+250 73 987 1234', '$2b$10$hashedpassword9', 'owner', TRUE, TRUE),
('Sarah Ingabire', 'sarah.employee@gmail.com', '+250 78 654 3210', '$2b$10$hashedpassword10', 'employee', TRUE, TRUE);

-- Insert sample parking lots
INSERT INTO parking_lots (
    owner_id, name, description, location, address, latitude, longitude, 
    total_slots, available_slots, price_per_hour, price_per_day, 
    operating_hours_open, operating_hours_close, amenities, features, 
    images, rating, total_reviews, is_active, is_approved, approved_by
) VALUES
(2, 'Kigali Heights Parking', 'Premium parking facility in the heart of Kigali with modern security systems and 24/7 access.', 'Kigali City Center', 'KG 7 Ave, Kigali', -1.9441, 30.0619, 120, 45, 500.00, 8000.00, '00:00:00', '23:59:59', 
 '["Security", "CCTV", "24/7 Access", "EV Charging", "WiFi"]', 
 '["Covered Parking", "Valet Service", "Car Wash", "Security Guards"]', 
 '["/images/kigali-heights-1.jpg", "/images/kigali-heights-2.jpg"]', 
 4.5, 127, TRUE, TRUE, 1),

(2, 'Kigali Convention Center', 'Large parking facility at the convention center with excellent amenities and event parking.', 'Kimihurura', 'KG 2 Roundabout, Kimihurura', -1.9355, 30.0928, 200, 78, 800.00, 12000.00, '06:00:00', '22:00:00',
 '["Security", "WiFi", "Restaurant", "EV Charging", "Conference Facilities"]',
 '["Event Parking", "Shuttle Service", "Conference Rates", "VIP Parking"]',
 '["/images/convention-center-1.jpg", "/images/convention-center-2.jpg"]',
 4.8, 89, TRUE, TRUE, 1),

(9, 'Nyamirambo Stadium', 'Affordable parking near the stadium with basic amenities and sports event access.', 'Nyamirambo', 'Nyamirambo, Kigali', -1.9706, 30.0394, 80, 12, 300.00, 4500.00, '07:00:00', '20:00:00',
 '["Security", "Food Court", "Sports Access"]',
 '["Event Parking", "Sports Events", "Budget Friendly"]',
 '["/images/nyamirambo-stadium-1.jpg"]',
 3.9, 45, TRUE, TRUE, 1),

(9, 'Remera Shopping Mall', 'Convenient parking at the shopping mall with retail access and covered parking.', 'Remera', 'KK 15 Rd, Remera', -1.9578, 30.1127, 60, 22, 400.00, 6000.00, '08:00:00', '21:00:00',
 '["Security", "Shopping", "WiFi", "Food Court", "ATM"]',
 '["Shopping Discounts", "Covered Parking", "Mall Access"]',
 '["/images/remera-mall-1.jpg", "/images/remera-mall-2.jpg"]',
 4.2, 73, TRUE, TRUE, 1),

(2, 'Kimironko Market', 'Budget-friendly parking near the local market with easy market access.', 'Kimironko', 'KG 11 Ave, Kimironko', -1.9403, 30.1059, 40, 5, 200.00, 3000.00, '06:00:00', '18:00:00',
 '["Security", "Market Access", "Local Shopping"]',
 '["Market Parking", "Local Access", "Budget Rates"]',
 '["/images/kimironko-market-1.jpg"]',
 3.5, 28, TRUE, TRUE, 1),

(9, 'Kigali Airport Parking', 'Premium airport parking with shuttle service to terminals and long-term rates.', 'Kanombe', 'Kigali International Airport, Kanombe', -1.9686, 30.1395, 300, 156, 1000.00, 15000.00, '00:00:00', '23:59:59',
 '["Security", "24/7 Access", "Shuttle", "WiFi", "Currency Exchange"]',
 '["Airport Shuttle", "Long-term Rates", "Premium Security", "Terminal Access"]',
 '["/images/airport-parking-1.jpg", "/images/airport-parking-2.jpg"]',
 4.6, 234, TRUE, TRUE, 1),

(2, 'Kacyiru Business District', 'Modern parking facility in the business district with premium amenities.', 'Kacyiru', 'KG 9 Ave, Kacyiru', -1.9242, 30.0732, 150, 67, 600.00, 9000.00, '06:00:00', '22:00:00',
 '["Security", "WiFi", "Business Center", "EV Charging", "Conference Rooms"]',
 '["Business Parking", "Meeting Rooms", "Corporate Rates"]',
 '["/images/kacyiru-business-1.jpg"]',
 4.3, 56, TRUE, TRUE, 1),

(9, 'Gisozi Shopping Center', 'Family-friendly parking with shopping and entertainment facilities.', 'Gisozi', 'KK 19 Ave, Gisozi', -1.9123, 30.0845, 90, 34, 350.00, 5000.00, '08:00:00', '21:00:00',
 '["Security", "Shopping", "Entertainment", "Food Court", "Kids Area"]',
 '["Family Parking", "Entertainment Access", "Shopping Discounts"]',
 '["/images/gisozi-shopping-1.jpg"]',
 4.0, 41, TRUE, TRUE, 1);

-- Insert employee assignments
INSERT INTO employees (user_id, parking_lot_id, position, hire_date, is_active) VALUES
(3, 1, 'Senior Attendant', '2023-01-15', TRUE),
(7, 2, 'Attendant', '2023-02-01', TRUE),
(10, 3, 'Attendant', '2023-02-15', TRUE),
(3, 4, 'Supervisor', '2023-01-15', TRUE),
(7, 6, 'Attendant', '2023-03-01', TRUE),
(10, 7, 'Attendant', '2023-03-15', TRUE);

-- Insert sample bookings
INSERT INTO bookings (
    id, user_id, parking_lot_id, vehicle_number, vehicle_type, 
    start_time, end_time, duration_hours, total_cost, 
    payment_method, payment_status, status, qr_code_data
) VALUES
('B-2023001', 4, 1, 'RAD 123 A', 'car', '2023-05-28 10:00:00', '2023-05-28 14:00:00', 4.00, 2000.00, 'mobile_money', 'paid', 'completed', '{"bookingId":"B-2023001","parkingLot":"Kigali Heights Parking","status":"completed"}'),
('B-2023002', 5, 2, 'RAB 456 B', 'car', '2023-05-28 09:30:00', '2023-05-28 17:00:00', 7.50, 6000.00, 'credit_card', 'paid', 'in_use', '{"bookingId":"B-2023002","parkingLot":"Kigali Convention Center","status":"in_use"}'),
('B-2023003', 6, 3, 'RAC 789 C', 'car', '2023-05-27 14:00:00', '2023-05-27 18:00:00', 4.00, 1200.00, 'cash', 'paid', 'completed', '{"bookingId":"B-2023003","parkingLot":"Nyamirambo Stadium","status":"completed"}'),
('B-2023004', 8, 4, 'RAD 321 D', 'car', '2023-05-28 08:00:00', '2023-05-28 10:00:00', 2.00, 800.00, 'mobile_money', 'failed', 'cancelled', '{"bookingId":"B-2023004","parkingLot":"Remera Shopping Mall","status":"cancelled"}'),
('B-2023005', 4, 1, 'RAD 123 A', 'car', '2023-05-29 12:00:00', '2023-05-29 15:00:00', 3.00, 1500.00, 'mobile_money', 'paid', 'booked', '{"bookingId":"B-2023005","parkingLot":"Kigali Heights Parking","status":"booked"}'),
('B-2023006', 5, 6, 'RAB 456 B', 'car', '2023-05-30 06:00:00', '2023-06-02 06:00:00', 72.00, 45000.00, 'credit_card', 'paid', 'booked', '{"bookingId":"B-2023006","parkingLot":"Kigali Airport Parking","status":"booked"}'),
('B-2023007', 6, 7, 'RAC 789 C', 'car', '2023-05-29 14:30:00', '2023-05-29 18:30:00', 4.00, 2400.00, 'mobile_money', 'paid', 'booked', '{"bookingId":"B-2023007","parkingLot":"Kacyiru Business District","status":"booked"}'),
('B-2023008', 8, 8, 'RAD 321 D', 'car', '2023-05-29 10:00:00', '2023-05-29 16:00:00', 6.00, 2100.00, 'cash', 'pending', 'booked', '{"bookingId":"B-2023008","parkingLot":"Gisozi Shopping Center","status":"booked"}');

-- Insert sample reviews
INSERT INTO reviews (user_id, parking_lot_id, booking_id, rating, title, comment, is_verified) VALUES
(4, 1, 'B-2023001', 5, 'Excellent Service', 'Great parking facility with excellent security and easy access. Highly recommended!', TRUE),
(5, 2, 'B-2023002', 5, 'Perfect for Events', 'Used this for a conference. Great location and professional service.', TRUE),
(6, 3, 'B-2023003', 4, 'Good Value', 'Affordable parking near the stadium. Good for sports events.', TRUE),
(4, 1, NULL, 4, 'Convenient Location', 'Very convenient location in the city center. A bit pricey but worth it.', TRUE),
(8, 4, NULL, 4, 'Shopping Made Easy', 'Great for shopping trips. Covered parking is a plus during rainy season.', TRUE),
(5, 6, NULL, 5, 'Best Airport Parking', 'Excellent airport parking with reliable shuttle service. Never missed a flight!', TRUE);

-- Insert sample payment transactions
INSERT INTO payment_transactions (booking_id, transaction_id, payment_method, amount, status, processed_at) VALUES
('B-2023001', 'TXN-MTN-001', 'mobile_money', 2000.00, 'completed', '2023-05-28 09:45:00'),
('B-2023002', 'TXN-VISA-002', 'credit_card', 6000.00, 'completed', '2023-05-28 09:15:00'),
('B-2023003', 'TXN-CASH-003', 'cash', 1200.00, 'completed', '2023-05-27 14:00:00'),
('B-2023004', 'TXN-MTN-004', 'mobile_money', 800.00, 'failed', NULL),
('B-2023005', 'TXN-MTN-005', 'mobile_money', 1500.00, 'completed', '2023-05-29 11:45:00'),
('B-2023006', 'TXN-VISA-006', 'credit_card', 45000.00, 'completed', '2023-05-30 05:30:00'),
('B-2023007', 'TXN-MTN-007', 'mobile_money', 2400.00, 'completed', '2023-05-29 14:15:00'),
('B-2023008', 'TXN-CASH-008', 'cash', 2100.00, 'pending', NULL);

-- Insert system settings
INSERT INTO system_settings (setting_key, setting_value, description, is_public) VALUES
('app_name', 'Rwanda Parking App', 'Application name', TRUE),
('app_version', '1.0.0', 'Current application version', TRUE),
('default_currency', 'RWF', 'Default currency for the application', TRUE),
('booking_advance_days', '30', 'Maximum days in advance for booking', FALSE),
('cancellation_hours', '2', 'Minimum hours before start time to cancel', FALSE),
('late_arrival_minutes', '30', 'Grace period for late arrivals', FALSE),
('max_booking_duration_hours', '168', 'Maximum booking duration in hours (7 days)', FALSE),
('service_fee_percentage', '5', 'Service fee percentage', FALSE),
('tax_percentage', '18', 'Tax percentage (VAT)', FALSE),
('support_email', 'support@rwandaparking.com', 'Support email address', TRUE),
('support_phone', '+250 78 000 0000', 'Support phone number', TRUE);

-- Insert sample notifications
INSERT INTO notifications (user_id, title, message, type, is_read) VALUES
(4, 'Booking Confirmed', 'Your booking B-2023005 has been confirmed for Kigali Heights Parking.', 'booking', FALSE),
(5, 'Payment Successful', 'Payment of RWF 6,000 for booking B-2023002 was successful.', 'payment', TRUE),
(6, 'Booking Reminder', 'Your parking booking starts in 1 hour at Nyamirambo Stadium.', 'booking', FALSE),
(8, 'Payment Failed', 'Payment for booking B-2023004 failed. Please try again.', 'payment', FALSE),
(4, 'Welcome!', 'Welcome to Rwanda Parking App! Start exploring available parking spaces.', 'system', TRUE),
(5, 'Special Offer', 'Get 20% off your next airport parking booking. Use code AIRPORT20', 'promotion', FALSE);
