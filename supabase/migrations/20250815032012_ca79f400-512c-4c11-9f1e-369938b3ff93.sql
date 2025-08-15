-- Delete existing test deliveries to start fresh
DELETE FROM deliveries WHERE order_id IN (SELECT order_id FROM orders WHERE customer_name IS NULL OR customer_name LIKE '%test%');
DELETE FROM orders WHERE customer_name IS NULL OR customer_name LIKE '%test%';

-- Add realistic orders and deliveries for drivers
-- Ahmed Hassan (driver_id: 7) - Top performer with 35 deliveries
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
('Jamal Al-Enezi', '+96550123030', 'delivered'),
('Laila Al-Zahra', '+96550123031', 'delivered'),
('Sami Al-Rashid', '+96550123032', 'delivered'),
('Nora Al-Mansouri', '+96550123033', 'delivered'),
('Fahad Al-Dosari', '+96550123034', 'delivered'),
('Amira Al-Kandari', '+96550123035', 'delivered'),
('Khaled Al-Sabah', '+96550123036', 'delivered'),
('Lina Al-Harbi', '+96550123037', 'delivered'),
('Mansour Al-Majed', '+96550123038', 'delivered'),
('Sara Al-Ghanim', '+96550123039', 'delivered'),
('Omar Al-Subaie', '+96550123040', 'delivered'),
('Fatima Al-Roumi', '+96550123041', 'delivered'),
('Hassan Al-Shatti', '+96550123042', 'delivered'),
('Nadia Al-Sabti', '+96550123043', 'delivered'),
('Youssef Al-Enezi', '+96550123044', 'delivered'),
('Mariam Al-Wasel', '+96550123045', 'delivered'),
('Abdullah Al-Najjar', '+96550123046', 'delivered'),
('Rana Al-Khoury', '+96550123047', 'delivered'),
('Hamad Al-Sharif', '+96550123048', 'delivered'),
('Aisha Al-Mutawa', '+96550123049', 'delivered'),
('Mohammed Al-Shemali', '+96550123050', 'delivered'),
('Zara Al-Thani', '+96550123051', 'delivered'),
('Ali Al-Saleh', '+96550123052', 'delivered'),
('Layla Al-Omari', '+96550123053', 'delivered'),
('Basel Al-Fouzan', '+96550123054', 'delivered'),
('Hala Al-Yahya', '+96550123055', 'delivered'),
('Faisal Al-Rashed', '+96550123056', 'delivered'),
('Reem Al-Majed', '+96550123057', 'delivered'),
('Tariq Al-Ghanim', '+96550123058', 'delivered'),
('Noura Al-Subaie', '+96550123059', 'delivered'),
('Waleed Al-Roumi', '+96550123060', 'delivered'),
('Mona Al-Shatti', '+96550123061', 'delivered'),
('Jamal Al-Sabti', '+96550123062', 'delivered'),
('Laila Al-Enezi', '+96550123063', 'delivered'),
('Sami Al-Wasel', '+96550123064', 'delivered'),
('Nora Al-Najjar', '+96550123065', 'delivered'),
('Fahad Al-Khoury', '+96550123066', 'delivered'),
('Amira Al-Sharif', '+96550123067', 'delivered'),
('Khaled Al-Mutawa', '+96550123068', 'delivered'),
('Lina Al-Shemali', '+96550123069', 'delivered'),
('Mansour Al-Thani', '+96550123070', 'delivered'),
('Sara Al-Saleh', '+96550123071', 'delivered'),
('Omar Al-Omari', '+96550123072', 'delivered'),
('Fatima Al-Fouzan', '+96550123073', 'delivered'),
('Hassan Al-Yahya', '+96550123074', 'delivered'),
('Nadia Al-Rashed', '+96550123075', 'delivered'),
('Youssef Al-Majed', '+96550123076', 'delivered'),
('Mariam Al-Ghanim', '+96550123077', 'delivered'),
('Abdullah Al-Subaie', '+96550123078', 'delivered'),
('Rana Al-Roumi', '+96550123079', 'delivered'),
('Hamad Al-Shatti', '+96550123080', 'delivered'),
('Aisha Al-Sabti', '+96550123081', 'delivered'),
('Mohammed Al-Enezi', '+96550123082', 'delivered'),
('Zara Al-Wasel', '+96550123083', 'delivered'),
('Ali Al-Najjar', '+96550123084', 'delivered'),
('Layla Al-Khoury', '+96550123085', 'delivered'),
('Basel Al-Sharif', '+96550123086', 'delivered'),
('Hala Al-Mutawa', '+96550123087', 'delivered'),
('Faisal Al-Shemali', '+96550123088', 'delivered'),
('Reem Al-Thani', '+96550123089', 'delivered'),
('Tariq Al-Saleh', '+96550123090', 'delivered'),
('Noura Al-Omari', '+96550123091', 'delivered'),
('Waleed Al-Fouzan', '+96550123092', 'delivered'),
('Mona Al-Yahya', '+96550123093', 'delivered'),
('Jamal Al-Rashed', '+96550123094', 'delivered'),
('Laila Al-Majed', '+96550123095', 'delivered'),
('Sami Al-Ghanim', '+96550123096', 'delivered'),
('Nora Al-Subaie', '+96550123097', 'delivered'),
('Fahad Al-Roumi', '+96550123098', 'delivered'),
('Amira Al-Shatti', '+96550123099', 'delivered'),
('Khaled Al-Sabti', '+96550123100', 'delivered'),
('Lina Al-Enezi', '+96550123101', 'delivered'),
('Mansour Al-Wasel', '+96550123102', 'delivered'),
('Sara Al-Najjar', '+96550123103', 'delivered'),
('Omar Al-Khoury', '+96550123104', 'delivered'),
('Fatima Al-Sharif', '+96550123105', 'delivered'),
('Hassan Al-Mutawa', '+96550123106', 'delivered'),
('Nadia Al-Shemali', '+96550123107', 'delivered'),
('Youssef Al-Thani', '+96550123108', 'delivered'),
('Mariam Al-Saleh', '+96550123109', 'delivered'),
('Abdullah Al-Omari', '+96550123110', 'delivered'),
('Rana Al-Fouzan', '+96550123111', 'delivered'),
('Hamad Al-Yahya', '+96550123112', 'delivered'),
('Aisha Al-Rashed', '+96550123113', 'delivered'),
('Mohammed Al-Majed', '+96550123114', 'delivered'),
('Zara Al-Ghanim', '+96550123115', 'delivered'),
('Ali Al-Subaie', '+96550123116', 'delivered'),
('Layla Al-Roumi', '+96550123117', 'delivered'),
('Basel Al-Shatti', '+96550123118', 'delivered'),
('Hala Al-Sabti', '+96550123119', 'delivered'),
('Faisal Al-Enezi', '+96550123120', 'delivered'),
('Reem Al-Wasel', '+96550123121', 'delivered'),
('Tariq Al-Najjar', '+96550123122', 'delivered'),
('Noura Al-Khoury', '+96550123123', 'delivered'),
('Waleed Al-Sharif', '+96550123124', 'delivered'),
('Mona Al-Mutawa', '+96550123125', 'delivered'),
('Jamal Al-Shemali', '+96550123126', 'delivered'),
('Laila Al-Thani', '+96550123127', 'delivered'),
('Sami Al-Saleh', '+96550123128', 'delivered'),
('Nora Al-Omari', '+96550123129', 'delivered'),
('Fahad Al-Fouzan', '+96550123130', 'delivered'),
('Amira Al-Yahya', '+96550123131', 'delivered'),
('Khaled Al-Rashed', '+96550123132', 'delivered'),
('Lina Al-Majed', '+96550123133', 'delivered'),
('Mansour Al-Ghanim', '+96550123134', 'delivered'),
('Sara Al-Subaie', '+96550123135', 'delivered'),
('Omar Al-Roumi', '+96550123136', 'delivered'),
('Fatima Al-Shatti', '+96550123137', 'delivered'),
('Hassan Al-Sabti', '+96550123138', 'delivered'),
('Nadia Al-Enezi', '+96550123139', 'delivered'),
('Youssef Al-Wasel', '+96550123140', 'delivered'),
('Mariam Al-Najjar', '+96550123141', 'delivered'),
('Abdullah Al-Khoury', '+96550123142', 'delivered'),
('Rana Al-Sharif', '+96550123143', 'delivered'),
('Hamad Al-Mutawa', '+96550123144', 'delivered'),
('Aisha Al-Shemali', '+96550123145', 'delivered'),
('Mohammed Al-Thani', '+96550123146', 'delivered'),
('Zara Al-Saleh', '+96550123147', 'delivered'),
('Ali Al-Omari', '+96550123148', 'delivered');

-- Create deliveries for Ahmed Hassan (top performer) - first 35 orders
WITH ordered_orders AS (
  SELECT order_id, ROW_NUMBER() OVER (ORDER BY order_id) as rn
  FROM orders 
  WHERE status = 'delivered'
)
INSERT INTO deliveries (order_id, driver_id, status, assigned_at, picked_up_at, delivered_at)
SELECT 
  order_id, 
  7, 
  'delivered',
  NOW() - INTERVAL '7 days' + (rn * INTERVAL '3 hours'),
  NOW() - INTERVAL '7 days' + (rn * INTERVAL '3 hours') + INTERVAL '15 minutes',
  NOW() - INTERVAL '7 days' + (rn * INTERVAL '3 hours') + INTERVAL '45 minutes'
FROM ordered_orders 
WHERE rn <= 35;

-- Create deliveries for Nour Al-Wasel - next 28 orders
WITH ordered_orders AS (
  SELECT order_id, ROW_NUMBER() OVER (ORDER BY order_id) as rn
  FROM orders 
  WHERE status = 'delivered' 
  AND order_id NOT IN (SELECT order_id FROM deliveries)
)
INSERT INTO deliveries (order_id, driver_id, status, assigned_at, picked_up_at, delivered_at)
SELECT 
  order_id, 
  8, 
  'delivered',
  NOW() - INTERVAL '6 days' + (rn * INTERVAL '4 hours'),
  NOW() - INTERVAL '6 days' + (rn * INTERVAL '4 hours') + INTERVAL '12 minutes',
  NOW() - INTERVAL '6 days' + (rn * INTERVAL '4 hours') + INTERVAL '38 minutes'
FROM ordered_orders 
WHERE rn <= 28;

-- Create deliveries for James Wilson - next 22 orders
WITH ordered_orders AS (
  SELECT order_id, ROW_NUMBER() OVER (ORDER BY order_id) as rn
  FROM orders 
  WHERE status = 'delivered' 
  AND order_id NOT IN (SELECT order_id FROM deliveries)
)
INSERT INTO deliveries (order_id, driver_id, status, assigned_at, picked_up_at, delivered_at)
SELECT 
  order_id, 
  54, 
  'delivered',
  NOW() - INTERVAL '5 days' + (rn * INTERVAL '5 hours'),
  NOW() - INTERVAL '5 days' + (rn * INTERVAL '5 hours') + INTERVAL '18 minutes',
  NOW() - INTERVAL '5 days' + (rn * INTERVAL '5 hours') + INTERVAL '52 minutes'
FROM ordered_orders 
WHERE rn <= 22;

-- Create deliveries for Liam Harper - next 18 orders
WITH ordered_orders AS (
  SELECT order_id, ROW_NUMBER() OVER (ORDER BY order_id) as rn
  FROM orders 
  WHERE status = 'delivered' 
  AND order_id NOT IN (SELECT order_id FROM deliveries)
)
INSERT INTO deliveries (order_id, driver_id, status, assigned_at, picked_up_at, delivered_at)
SELECT 
  order_id, 
  48, 
  'delivered',
  NOW() - INTERVAL '4 days' + (rn * INTERVAL '6 hours'),
  NOW() - INTERVAL '4 days' + (rn * INTERVAL '6 hours') + INTERVAL '20 minutes',
  NOW() - INTERVAL '4 days' + (rn * INTERVAL '6 hours') + INTERVAL '55 minutes'
FROM ordered_orders 
WHERE rn <= 18;

-- Create deliveries for Noah Bennett - next 15 orders  
WITH ordered_orders AS (
  SELECT order_id, ROW_NUMBER() OVER (ORDER BY order_id) as rn
  FROM orders 
  WHERE status = 'delivered' 
  AND order_id NOT IN (SELECT order_id FROM deliveries)
)
INSERT INTO deliveries (order_id, driver_id, status, assigned_at, picked_up_at, delivered_at)
SELECT 
  order_id, 
  49, 
  'delivered',
  NOW() - INTERVAL '3 days' + (rn * INTERVAL '7 hours'),
  NOW() - INTERVAL '3 days' + (rn * INTERVAL '7 hours') + INTERVAL '22 minutes',
  NOW() - INTERVAL '3 days' + (rn * INTERVAL '7 hours') + INTERVAL '58 minutes'
FROM ordered_orders 
WHERE rn <= 15;

-- Create deliveries for Ethan Carter - next 12 orders
WITH ordered_orders AS (
  SELECT order_id, ROW_NUMBER() OVER (ORDER BY order_id) as rn
  FROM orders 
  WHERE status = 'delivered' 
  AND order_id NOT IN (SELECT order_id FROM deliveries)
)
INSERT INTO deliveries (order_id, driver_id, status, assigned_at, picked_up_at, delivered_at)
SELECT 
  order_id, 
  47, 
  'delivered',
  NOW() - INTERVAL '2 days' + (rn * INTERVAL '8 hours'),
  NOW() - INTERVAL '2 days' + (rn * INTERVAL '8 hours') + INTERVAL '25 minutes',
  NOW() - INTERVAL '2 days' + (rn * INTERVAL '8 hours') + INTERVAL '62 minutes'
FROM ordered_orders 
WHERE rn <= 12;

-- Create deliveries for Mason Rodriguez - next 10 orders
WITH ordered_orders AS (
  SELECT order_id, ROW_NUMBER() OVER (ORDER BY order_id) as rn
  FROM orders 
  WHERE status = 'delivered' 
  AND order_id NOT IN (SELECT order_id FROM deliveries)
)
INSERT INTO deliveries (order_id, driver_id, status, assigned_at, picked_up_at, delivered_at)
SELECT 
  order_id, 
  50, 
  'delivered',
  NOW() - INTERVAL '1 day' + (rn * INTERVAL '9 hours'),
  NOW() - INTERVAL '1 day' + (rn * INTERVAL '9 hours') + INTERVAL '28 minutes',
  NOW() - INTERVAL '1 day' + (rn * INTERVAL '9 hours') + INTERVAL '65 minutes'
FROM ordered_orders 
WHERE rn <= 10;

-- Update trust scores based on performance
UPDATE driver_trust SET trust_score = 98 WHERE driver_id = 7;  -- Ahmed Hassan - top performer
UPDATE driver_trust SET trust_score = 96 WHERE driver_id = 8;  -- Nour Al-Wasel 
UPDATE driver_trust SET trust_score = 94 WHERE driver_id = 54; -- James Wilson
UPDATE driver_trust SET trust_score = 92 WHERE driver_id = 48; -- Liam Harper
UPDATE driver_trust SET trust_score = 90 WHERE driver_id = 49; -- Noah Bennett
UPDATE driver_trust SET trust_score = 88 WHERE driver_id = 47; -- Ethan Carter
UPDATE driver_trust SET trust_score = 85 WHERE driver_id = 50; -- Mason Rodriguez