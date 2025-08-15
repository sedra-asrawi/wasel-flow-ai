-- Add sample orders
INSERT INTO public.orders (customer_name, customer_phone, status) VALUES 
('Mohammed Ali', '+965 9999 1111', 'created'),
('Fatima Ahmed', '+965 9999 2222', 'picked_up'),
('Omar Khan', '+965 9999 3333', 'delivered'),
('Layla Saeed', '+965 9999 4444', 'created'),
('Khalid Rashid', '+965 9999 5555', 'assigned')
ON CONFLICT (order_id) DO NOTHING;

-- Add deliveries for Ahmed (driver_id 7)
INSERT INTO public.deliveries (order_id, driver_id, status, assigned_at, picked_up_at, delivered_at) VALUES 
(3, 7, 'assigned', NOW() - INTERVAL '2 hours', NULL, NULL),
(4, 7, 'picked_up', NOW() - INTERVAL '1 hour', NOW() - INTERVAL '30 minutes', NULL),
(5, 7, 'delivered', NOW() - INTERVAL '3 hours', NOW() - INTERVAL '2.5 hours', NOW() - INTERVAL '2 hours'),
(6, 8, 'assigned', NOW() - INTERVAL '1 hour', NULL, NULL)
ON CONFLICT (delivery_id) DO NOTHING;

-- Set trust scores for all drivers
INSERT INTO public.driver_trust (driver_id, trust_score) VALUES 
(2, 88),
(7, 95),
(8, 100)
ON CONFLICT (driver_id) DO UPDATE SET trust_score = EXCLUDED.trust_score;

-- Add QR codes for testing
INSERT INTO public.order_qr_codes (order_id, qr_token, expires_at) VALUES 
(3, 'QR_ORDER_3_TOKEN', NOW() + INTERVAL '24 hours'),
(4, 'QR_ORDER_4_TOKEN', NOW() + INTERVAL '24 hours'),
(5, 'QR_ORDER_5_TOKEN', NOW() + INTERVAL '24 hours'),
(6, 'QR_ORDER_6_TOKEN', NOW() + INTERVAL '24 hours')
ON CONFLICT (order_id) DO UPDATE SET 
  qr_token = EXCLUDED.qr_token,
  expires_at = EXCLUDED.expires_at;