-- Rwanda Parking App - Database Triggers
-- Automated database operations and data integrity

USE rwanda_parking;

-- Drop existing triggers if they exist
DROP TRIGGER IF EXISTS update_parking_availability_after_booking;
DROP TRIGGER IF EXISTS update_parking_availability_after_checkout;
DROP TRIGGER IF EXISTS update_parking_rating_after_review;
DROP TRIGGER IF EXISTS audit_user_changes;
DROP TRIGGER IF EXISTS audit_booking_changes;
DROP TRIGGER IF EXISTS generate_booking_qr_data;

-- =============================================
-- PARKING AVAILABILITY TRIGGERS
-- =============================================

-- Trigger to update parking availability after booking creation
DELIMITER //
CREATE TRIGGER update_parking_availability_after_booking
    AFTER INSERT ON bookings
    FOR EACH ROW
BEGIN
    -- Only decrease availability for confirmed bookings
    IF NEW.status = 'booked' AND NEW.payment_status = 'paid' THEN
        UPDATE parking_lots 
        SET available_slots = available_slots - 1,
            updated_at = CURRENT_TIMESTAMP
        WHERE id = NEW.parking_lot_id 
            AND available_slots > 0;
    END IF;
END//
DELIMITER ;

-- Trigger to update parking availability when booking status changes
DELIMITER //
CREATE TRIGGER update_parking_availability_after_checkout
    AFTER UPDATE ON bookings
    FOR EACH ROW
BEGIN
    -- Increase availability when booking is completed or cancelled
    IF (OLD.status IN ('booked', 'in_use') AND NEW.status IN ('completed', 'cancelled')) THEN
        UPDATE parking_lots 
        SET available_slots = available_slots + 1,
            updated_at = CURRENT_TIMESTAMP
        WHERE id = NEW.parking_lot_id 
            AND available_slots < total_slots;
    END IF;
    
    -- Decrease availability when booking is confirmed (status change from pending)
    IF (OLD.status = 'pending' AND NEW.status = 'booked' AND NEW.payment_status = 'paid') THEN
        UPDATE parking_lots 
        SET available_slots = available_slots - 1,
            updated_at = CURRENT_TIMESTAMP
        WHERE id = NEW.parking_lot_id 
            AND available_slots > 0;
    END IF;
END//
DELIMITER ;

-- =============================================
-- RATING UPDATE TRIGGER
-- =============================================

-- Trigger to update parking lot rating after review
DELIMITER //
CREATE TRIGGER update_parking_rating_after_review
    AFTER INSERT ON reviews
    FOR EACH ROW
BEGIN
    UPDATE parking_lots 
    SET rating = (
        SELECT ROUND(AVG(rating), 2) 
        FROM reviews 
        WHERE parking_lot_id = NEW.parking_lot_id
    ),
    total_reviews = (
        SELECT COUNT(*) 
        FROM reviews 
        WHERE parking_lot_id = NEW.parking_lot_id
    ),
    updated_at = CURRENT_TIMESTAMP
    WHERE id = NEW.parking_lot_id;
END//
DELIMITER ;

-- =============================================
-- QR CODE GENERATION TRIGGER
-- =============================================

-- Trigger to generate QR code data for new bookings
DELIMITER //
CREATE TRIGGER generate_booking_qr_data
    BEFORE INSERT ON bookings
    FOR EACH ROW
BEGIN
    DECLARE parking_name VARCHAR(100);
    
    -- Get parking lot name
    SELECT name INTO parking_name 
    FROM parking_lots 
    WHERE id = NEW.parking_lot_id;
    
    -- Generate QR code data as JSON
    SET NEW.qr_code_data = JSON_OBJECT(
        'bookingId', NEW.id,
        'parkingLotName', parking_name,
        'startTime', NEW.start_time,
        'endTime', NEW.end_time,
        'status', NEW.status,
        'vehicleNumber', NEW.vehicle_number,
        'timestamp', NOW()
    );
END//
DELIMITER ;

-- =============================================
-- AUDIT TRIGGERS
-- =============================================

-- Trigger for auditing user changes
DELIMITER //
CREATE TRIGGER audit_user_changes
    AFTER UPDATE ON users
    FOR EACH ROW
BEGIN
    INSERT INTO audit_logs (
        user_id, action, table_name, record_id, 
        old_values, new_values, created_at
    ) VALUES (
        NEW.id, 'UPDATE', 'users', NEW.id,
        JSON_OBJECT(
            'name', OLD.name,
            'email', OLD.email,
            'phone', OLD.phone,
            'role', OLD.role,
            'is_active', OLD.is_active
        ),
        JSON_OBJECT(
            'name', NEW.name,
            'email', NEW.email,
            'phone', NEW.phone,
            'role', NEW.role,
            'is_active', NEW.is_active
        ),
        NOW()
    );
END//
DELIMITER ;

-- Trigger for auditing booking changes
DELIMITER //
CREATE TRIGGER audit_booking_changes
    AFTER UPDATE ON bookings
    FOR EACH ROW
BEGIN
    INSERT INTO audit_logs (
        user_id, action, table_name, record_id,
        old_values, new_values, created_at
    ) VALUES (
        NEW.user_id, 'UPDATE', 'bookings', NEW.id,
        JSON_OBJECT(
            'status', OLD.status,
            'payment_status', OLD.payment_status,
            'start_time', OLD.start_time,
            'end_time', OLD.end_time
        ),
        JSON_OBJECT(
            'status', NEW.status,
            'payment_status', NEW.payment_status,
            'start_time', NEW.start_time,
            'end_time', NEW.end_time
        ),
        NOW()
    );
END//
DELIMITER ;

-- =============================================
-- VALIDATION TRIGGERS
-- =============================================

-- Trigger to validate booking times
DELIMITER //
CREATE TRIGGER validate_booking_times
    BEFORE INSERT ON bookings
    FOR EACH ROW
BEGIN
    DECLARE operating_open TIME;
    DECLARE operating_close TIME;
    DECLARE booking_start_time TIME;
    DECLARE booking_end_time TIME;
    
    -- Get parking lot operating hours
    SELECT operating_hours_open, operating_hours_close 
    INTO operating_open, operating_close
    FROM parking_lots 
    WHERE id = NEW.parking_lot_id;
    
    -- Extract time from booking datetime
    SET booking_start_time = TIME(NEW.start_time);
    SET booking_end_time = TIME(NEW.end_time);
    
    -- Validate booking is within operating hours
    IF booking_start_time < operating_open OR booking_end_time > operating_close THEN
        SIGNAL SQLSTATE '45000' 
        SET MESSAGE_TEXT = 'Booking time is outside parking lot operating hours';
    END IF;
    
    -- Validate booking is not in the past
    IF NEW.start_time <= NOW() THEN
        SIGNAL SQLSTATE '45000' 
        SET MESSAGE_TEXT = 'Booking start time cannot be in the past';
    END IF;
    
    -- Validate end time is after start time
    IF NEW.end_time <= NEW.start_time THEN
        SIGNAL SQLSTATE '45000' 
        SET MESSAGE_TEXT = 'Booking end time must be after start time';
    END IF;
END//
DELIMITER ;

-- =============================================
-- NOTIFICATION TRIGGERS
-- =============================================

-- Trigger to create notification for new booking
DELIMITER //
CREATE TRIGGER create_booking_notification
    AFTER INSERT ON bookings
    FOR EACH ROW
BEGIN
    DECLARE parking_name VARCHAR(100);
    
    -- Get parking lot name
    SELECT name INTO parking_name 
    FROM parking_lots 
    WHERE id = NEW.parking_lot_id;
    
    -- Create notification for user
    INSERT INTO notifications (
        user_id, title, message, type, created_at
    ) VALUES (
        NEW.user_id,
        'Booking Confirmed',
        CONCAT('Your booking ', NEW.id, ' has been confirmed for ', parking_name, '.'),
        'booking',
        NOW()
    );
END//
DELIMITER ;

-- Trigger to create notification for payment status change
DELIMITER //
CREATE TRIGGER create_payment_notification
    AFTER UPDATE ON bookings
    FOR EACH ROW
BEGIN
    -- Notify on payment success
    IF OLD.payment_status != 'paid' AND NEW.payment_status = 'paid' THEN
        INSERT INTO notifications (
            user_id, title, message, type, created_at
        ) VALUES (
            NEW.user_id,
            'Payment Successful',
            CONCAT('Payment of RWF ', FORMAT(NEW.total_cost, 0), ' for booking ', NEW.id, ' was successful.'),
            'payment',
            NOW()
        );
    END IF;
    
    -- Notify on payment failure
    IF OLD.payment_status != 'failed' AND NEW.payment_status = 'failed' THEN
        INSERT INTO notifications (
            user_id, title, message, type, created_at
        ) VALUES (
            NEW.user_id,
            'Payment Failed',
            CONCAT('Payment for booking ', NEW.id, ' failed. Please try again.'),
            'payment',
            NOW()
        );
    END IF;
END//
DELIMITER ;
