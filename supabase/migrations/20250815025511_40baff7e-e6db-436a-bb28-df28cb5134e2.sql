-- Create drivers for the authenticated users
INSERT INTO public.drivers (auth_user_id, full_name, phone, status) VALUES 
('9339f660-0454-4e6a-aa35-d1a2f19c0da3', 'Ahmed Hassan', '+965 5000 1234', 'active'),
('722a26e1-0ce5-48fa-847a-af41adaf9724', 'Nour Al-Wasel', '+965 5000 5678', 'active')
ON CONFLICT (auth_user_id) DO UPDATE SET 
  full_name = EXCLUDED.full_name,
  phone = EXCLUDED.phone;

-- Add some sample orders
INSERT INTO public.orders (customer_name, customer_phone, status) VALUES 
('Mohammed Ali', '+965 9999 1111', 'created'),
('Fatima Ahmed', '+965 9999 2222', 'picked_up'),
('Omar Khan', '+965 9999 3333', 'delivered'),
('Layla Saeed', '+965 9999 4444', 'created'),
('Khalid Rashid', '+965 9999 5555', 'assigned')
ON CONFLICT (order_id) DO NOTHING;

-- Add deliveries for the driver
INSERT INTO public.deliveries (order_id, driver_id, status, assigned_at, picked_up_at, delivered_at) VALUES 
(3, (SELECT driver_id FROM drivers WHERE auth_user_id = '9339f660-0454-4e6a-aa35-d1a2f19c0da3'), 'assigned', NOW() - INTERVAL '2 hours', NULL, NULL),
(4, (SELECT driver_id FROM drivers WHERE auth_user_id = '9339f660-0454-4e6a-aa35-d1a2f19c0da3'), 'picked_up', NOW() - INTERVAL '1 hour', NOW() - INTERVAL '30 minutes', NULL),
(5, (SELECT driver_id FROM drivers WHERE auth_user_id = '9339f660-0454-4e6a-aa35-d1a2f19c0da3'), 'delivered', NOW() - INTERVAL '3 hours', NOW() - INTERVAL '2.5 hours', NOW() - INTERVAL '2 hours')
ON CONFLICT (delivery_id) DO NOTHING;

-- Initialize driver trust scores
INSERT INTO public.driver_trust (driver_id, trust_score) VALUES 
((SELECT driver_id FROM drivers WHERE auth_user_id = '9339f660-0454-4e6a-aa35-d1a2f19c0da3'), 95),
((SELECT driver_id FROM drivers WHERE auth_user_id = '722a26e1-0ce5-48fa-847a-af41adaf9724'), 100),
(2, 88)
ON CONFLICT (driver_id) DO UPDATE SET trust_score = EXCLUDED.trust_score;

-- Add some QR codes for testing
INSERT INTO public.order_qr_codes (order_id, qr_token, expires_at) VALUES 
(3, 'QR_ORDER_3_TOKEN', NOW() + INTERVAL '24 hours'),
(4, 'QR_ORDER_4_TOKEN', NOW() + INTERVAL '24 hours'),
(5, 'QR_ORDER_5_TOKEN', NOW() + INTERVAL '24 hours')
ON CONFLICT (order_id) DO UPDATE SET 
  qr_token = EXCLUDED.qr_token,
  expires_at = EXCLUDED.expires_at;