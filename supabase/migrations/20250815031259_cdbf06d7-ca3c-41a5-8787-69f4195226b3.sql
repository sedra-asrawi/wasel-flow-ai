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

-- Add deliveries manually for various drivers
INSERT INTO public.deliveries (order_id, driver_id, status, assigned_at, picked_up_at, delivered_at) VALUES 
(7, 3, 'delivered', NOW() - INTERVAL '5 hours', NOW() - INTERVAL '4 hours 30 minutes', NOW() - INTERVAL '4 hours'),
(8, 4, 'delivered', NOW() - INTERVAL '3 hours', NOW() - INTERVAL '2 hours 30 minutes', NOW() - INTERVAL '2 hours'),
(9, 5, 'delivered', NOW() - INTERVAL '1 hour', NOW() - INTERVAL '45 minutes', NOW() - INTERVAL '30 minutes'),
(10, 6, 'picked_up', NOW() - INTERVAL '45 minutes', NOW() - INTERVAL '30 minutes', NULL),
(11, 9, 'assigned', NOW() - INTERVAL '15 minutes', NULL, NULL),
(12, 10, 'delivered', NOW() - INTERVAL '6 hours', NOW() - INTERVAL '5 hours 30 minutes', NOW() - INTERVAL '5 hours'),
(13, 11, 'delivered', NOW() - INTERVAL '4 hours', NOW() - INTERVAL '3 hours 30 minutes', NOW() - INTERVAL '3 hours'),
(14, 12, 'delivered', NOW() - INTERVAL '2 hours', NOW() - INTERVAL '1 hour 30 minutes', NOW() - INTERVAL '1 hour'),
(15, 13, 'assigned', NOW() - INTERVAL '45 minutes', NULL, NULL),
(16, 14, 'created', NOW() - INTERVAL '10 minutes', NULL, NULL)
ON CONFLICT (delivery_id) DO NOTHING;

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