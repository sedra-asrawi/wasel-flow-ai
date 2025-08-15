-- Add realistic delivery history for existing drivers
-- First, add more orders
INSERT INTO orders (customer_name, customer_phone, status) VALUES
('Sara Al-Mahmoud', '+96550123001', 'delivered'),
('Omar Al-Rashid', '+96550123002', 'delivered'),
('Fatima Al-Zahra', '+96550123003', 'delivered'),
('Ali Al-Hashimi', '+96550123004', 'delivered'),
('Layla Al-Qasemi', '+96550123005', 'delivered'),
('Hassan Al-Najjar', '+96550123006', 'delivered'),
('Aisha Al-Mansouri', '+96550123007', 'delivered'),
('Mohammed Al-Farisi', '+96550123008', 'delivered'),
('Zara Al-Sabah', '+96550123009', 'delivered'),
('Khalid Al-Awadi', '+96550123010', 'delivered'),
('Nadia Al-Khoury', '+96550123011', 'delivered'),
('Youssef Al-Sharif', '+96550123012', 'delivered'),
('Mariam Al-Dosari', '+96550123013', 'delivered'),
('Abdullah Al-Mutawa', '+96550123014', 'delivered'),
('Rana Al-Shemali', '+96550123015', 'delivered'),
('Hamad Al-Thani', '+96550123016', 'delivered'),
('Lina Al-Kandari', '+96550123017', 'delivered'),
('Saad Al-Harbi', '+96550123018', 'delivered'),
('Dina Al-Saleh', '+96550123019', 'delivered'),
('Basel Al-Omari', '+96550123020', 'delivered'),
('Hala Al-Rashed', '+96550123021', 'delivered'),
('Faisal Al-Majed', '+96550123022', 'delivered'),
('Reem Al-Fouzan', '+96550123023', 'delivered'),
('Tariq Al-Yahya', '+96550123024', 'delivered'),
('Noura Al-Ghanim', '+96550123025', 'delivered'),
('Majed Al-Subaie', '+96550123026', 'delivered'),
('Huda Al-Roumi', '+96550123027', 'delivered'),
('Waleed Al-Shatti', '+96550123028', 'delivered'),
('Mona Al-Sabti', '+96550123029', 'delivered'),
('Jamal Al-Enezi', '+96550123030', 'delivered');

-- Add deliveries for these orders with realistic distribution among drivers
-- Ahmed Hassan (driver_id: 7) - Top performer with 35 deliveries
INSERT INTO deliveries (order_id, driver_id, status, assigned_at, picked_up_at, delivered_at) 
SELECT o.order_id, 7, 'delivered', 
       o.created_at, 
       o.created_at + INTERVAL '15 minutes', 
       o.created_at + INTERVAL '45 minutes'
FROM orders o 
WHERE o.order_id IN (
    SELECT order_id FROM orders WHERE status = 'delivered' ORDER BY order_id LIMIT 35
);

-- Nour Al-Wasel (driver_id: 8) - Second best with 28 deliveries  
INSERT INTO deliveries (order_id, driver_id, status, assigned_at, picked_up_at, delivered_at) 
SELECT o.order_id, 8, 'delivered', 
       o.created_at, 
       o.created_at + INTERVAL '12 minutes', 
       o.created_at + INTERVAL '38 minutes'
FROM orders o 
WHERE o.order_id IN (
    SELECT order_id FROM orders WHERE order_id NOT IN (SELECT order_id FROM deliveries) AND status = 'delivered' ORDER BY order_id LIMIT 28
);

-- James Wilson (driver_id: 54) - Third with 22 deliveries
INSERT INTO deliveries (order_id, driver_id, status, assigned_at, picked_up_at, delivered_at) 
SELECT o.order_id, 54, 'delivered', 
       o.created_at, 
       o.created_at + INTERVAL '18 minutes', 
       o.created_at + INTERVAL '52 minutes'
FROM orders o 
WHERE o.order_id IN (
    SELECT order_id FROM orders WHERE order_id NOT IN (SELECT order_id FROM deliveries) AND status = 'delivered' ORDER BY order_id LIMIT 22
);

-- Liam Harper (driver_id: 48) - 18 deliveries
INSERT INTO deliveries (order_id, driver_id, status, assigned_at, picked_up_at, delivered_at) 
SELECT o.order_id, 48, 'delivered', 
       o.created_at, 
       o.created_at + INTERVAL '20 minutes', 
       o.created_at + INTERVAL '55 minutes'
FROM orders o 
WHERE o.order_id IN (
    SELECT order_id FROM orders WHERE order_id NOT IN (SELECT order_id FROM deliveries) AND status = 'delivered' ORDER BY order_id LIMIT 18
);

-- Noah Bennett (driver_id: 49) - 15 deliveries
INSERT INTO deliveries (order_id, driver_id, status, assigned_at, picked_up_at, delivered_at) 
SELECT o.order_id, 49, 'delivered', 
       o.created_at, 
       o.created_at + INTERVAL '22 minutes', 
       o.created_at + INTERVAL '58 minutes'
FROM orders o 
WHERE o.order_id IN (
    SELECT order_id FROM orders WHERE order_id NOT IN (SELECT order_id FROM deliveries) AND status = 'delivered' ORDER BY order_id LIMIT 15
);

-- Ethan Carter (driver_id: 47) - 12 deliveries
INSERT INTO deliveries (order_id, driver_id, status, assigned_at, picked_up_at, delivered_at) 
SELECT o.order_id, 47, 'delivered', 
       o.created_at, 
       o.created_at + INTERVAL '25 minutes', 
       o.created_at + INTERVAL '62 minutes'
FROM orders o 
WHERE o.order_id IN (
    SELECT order_id FROM orders WHERE order_id NOT IN (SELECT order_id FROM deliveries) AND status = 'delivered' ORDER BY order_id LIMIT 12
);

-- Mason Rodriguez (driver_id: 50) - 10 deliveries
INSERT INTO deliveries (order_id, driver_id, status, assigned_at, picked_up_at, delivered_at) 
SELECT o.order_id, 50, 'delivered', 
       o.created_at, 
       o.created_at + INTERVAL '28 minutes', 
       o.created_at + INTERVAL '65 minutes'
FROM orders o 
WHERE o.order_id IN (
    SELECT order_id FROM orders WHERE order_id NOT IN (SELECT order_id FROM deliveries) AND status = 'delivered' ORDER BY order_id LIMIT 10
);

-- Jacob Martinez (driver_id: 52) - 8 deliveries
INSERT INTO deliveries (order_id, driver_id, status, assigned_at, picked_up_at, delivered_at) 
SELECT o.order_id, 52, 'delivered', 
       o.created_at, 
       o.created_at + INTERVAL '30 minutes', 
       o.created_at + INTERVAL '68 minutes'
FROM orders o 
WHERE o.order_id IN (
    SELECT order_id FROM orders WHERE order_id NOT IN (SELECT order_id FROM deliveries) AND status = 'delivered' ORDER BY order_id LIMIT 8
);

-- Update trust scores based on performance
UPDATE driver_trust SET trust_score = 98 WHERE driver_id = 7;  -- Ahmed Hassan - top performer
UPDATE driver_trust SET trust_score = 96 WHERE driver_id = 8;  -- Nour Al-Wasel 
UPDATE driver_trust SET trust_score = 94 WHERE driver_id = 54; -- James Wilson
UPDATE driver_trust SET trust_score = 92 WHERE driver_id = 48; -- Liam Harper
UPDATE driver_trust SET trust_score = 90 WHERE driver_id = 49; -- Noah Bennett
UPDATE driver_trust SET trust_score = 88 WHERE driver_id = 47; -- Ethan Carter
UPDATE driver_trust SET trust_score = 85 WHERE driver_id = 50; -- Mason Rodriguez
UPDATE driver_trust SET trust_score = 82 WHERE driver_id = 52; -- Jacob Martinez