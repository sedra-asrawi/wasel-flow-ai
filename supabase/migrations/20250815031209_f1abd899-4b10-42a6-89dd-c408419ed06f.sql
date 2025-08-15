-- Add more comprehensive fake data for admin dashboard

-- First, let's add more drivers
INSERT INTO public.drivers (full_name, phone, status, created_at) VALUES 
('Omar Khalil', '+965 5003 7890', 'active', NOW() - INTERVAL '3 months'),
('Youssef Ibrahim', '+965 5004 1234', 'active', NOW() - INTERVAL '4 months'),
('Hassan Ali', '+965 5005 5678', 'active', NOW() - INTERVAL '5 months'),
('Khalid Mahmoud', '+965 5006 9012', 'break', NOW() - INTERVAL '6 months'),
('Fahad Al-Rashid', '+965 5007 3456', 'active', NOW() - INTERVAL '2 months'),
('Saad Abdullah', '+965 5008 7890', 'offline', NOW() - INTERVAL '7 months'),
('Tariq Mohammad', '+965 5009 1234', 'active', NOW() - INTERVAL '1 month'),
('Faisal Al-Kuwari', '+965 5010 5678', 'active', NOW() - INTERVAL '8 months')
ON CONFLICT (driver_id) DO NOTHING;

-- Add more orders for these drivers
INSERT INTO public.orders (customer_name, customer_phone, status, created_at) VALUES 
('Ali Al-Sabah', '+965 9999 6666', 'delivered', NOW() - INTERVAL '5 hours'),
('Maryam Ahmed', '+965 9999 7777', 'delivered', NOW() - INTERVAL '3 hours'),
('Abdullah Khan', '+965 9999 8888', 'delivered', NOW() - INTERVAL '1 hour'),
('Noura Al-Rashid', '+965 9999 9999', 'picked_up', NOW() - INTERVAL '30 minutes'),
('Salem Al-Mutawa', '+965 9999 0000', 'assigned', NOW() - INTERVAL '15 minutes'),
('Fatima Al-Zahra', '+965 8888 1111', 'delivered', NOW() - INTERVAL '6 hours'),
('Mohammad Isa', '+965 8888 2222', 'delivered', NOW() - INTERVAL '4 hours'),
('Aisha Al-Sabah', '+965 8888 3333', 'delivered', NOW() - INTERVAL '2 hours'),
('Hamad Al-Thani', '+965 8888 4444', 'assigned', NOW() - INTERVAL '45 minutes'),
('Reem Abdullah', '+965 8888 5555', 'created', NOW() - INTERVAL '10 minutes')
ON CONFLICT (order_id) DO NOTHING;

-- Add deliveries for various drivers with different statuses and times
DO $$
DECLARE
    driver_ids INTEGER[] := ARRAY[2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15];
    order_ids INTEGER[] := ARRAY[7, 8, 9, 10, 11, 12, 13, 14, 15, 16];
    i INTEGER;
BEGIN
    -- Create deliveries for the new orders
    FOR i IN 1..array_length(order_ids, 1) LOOP
        INSERT INTO public.deliveries (order_id, driver_id, status, assigned_at, picked_up_at, delivered_at) VALUES 
        (order_ids[i], driver_ids[i % array_length(driver_ids, 1) + 1], 
         CASE 
           WHEN i <= 6 THEN 'delivered'
           WHEN i <= 8 THEN 'picked_up' 
           ELSE 'assigned'
         END,
         NOW() - INTERVAL (i * 30) || ' minutes',
         CASE WHEN i <= 8 THEN NOW() - INTERVAL (i * 20) || ' minutes' ELSE NULL END,
         CASE WHEN i <= 6 THEN NOW() - INTERVAL (i * 10) || ' minutes' ELSE NULL END)
        ON CONFLICT (delivery_id) DO NOTHING;
    END LOOP;
END $$;

-- Update trust scores for all drivers with varied scores
INSERT INTO public.driver_trust (driver_id, trust_score, updated_at) VALUES 
(3, 92, NOW()),
(4, 88, NOW()),
(5, 94, NOW()),
(6, 85, NOW()),
(9, 97, NOW()),
(10, 82, NOW()),
(11, 91, NOW()),
(12, 89, NOW()),
(13, 96, NOW()),
(14, 87, NOW()),
(15, 93, NOW())
ON CONFLICT (driver_id) DO UPDATE SET 
  trust_score = EXCLUDED.trust_score,
  updated_at = EXCLUDED.updated_at;

-- Add QR codes for the new orders
INSERT INTO public.order_qr_codes (order_id, qr_token, expires_at) VALUES 
(7, 'QR_ORDER_7_TOKEN', NOW() + INTERVAL '24 hours'),
(8, 'QR_ORDER_8_TOKEN', NOW() + INTERVAL '24 hours'),
(9, 'QR_ORDER_9_TOKEN', NOW() + INTERVAL '24 hours'),
(10, 'QR_ORDER_10_TOKEN', NOW() + INTERVAL '24 hours'),
(11, 'QR_ORDER_11_TOKEN', NOW() + INTERVAL '24 hours'),
(12, 'QR_ORDER_12_TOKEN', NOW() + INTERVAL '24 hours'),
(13, 'QR_ORDER_13_TOKEN', NOW() + INTERVAL '24 hours'),
(14, 'QR_ORDER_14_TOKEN', NOW() + INTERVAL '24 hours'),
(15, 'QR_ORDER_15_TOKEN', NOW() + INTERVAL '24 hours'),
(16, 'QR_ORDER_16_TOKEN', NOW() + INTERVAL '24 hours')
ON CONFLICT (order_id) DO UPDATE SET 
  qr_token = EXCLUDED.qr_token,
  expires_at = EXCLUDED.expires_at;