-- Update the existing driver to use different phone number
UPDATE public.drivers 
SET auth_user_id = '9339f660-0454-4e6a-aa35-d1a2f19c0da3',
    full_name = 'Ahmed Hassan',
    phone = '+965 5001 1234'
WHERE driver_id = 2;

-- Insert new driver for Nour with unique phone
INSERT INTO public.drivers (auth_user_id, full_name, phone, status) VALUES 
('722a26e1-0ce5-48fa-847a-af41adaf9724', 'Nour Al-Wasel', '+965 5002 5678', 'active');

-- Add some sample orders
INSERT INTO public.orders (customer_name, customer_phone, status) VALUES 
('Mohammed Ali', '+965 9999 1111', 'created'),
('Fatima Ahmed', '+965 9999 2222', 'picked_up'),
('Omar Khan', '+965 9999 3333', 'delivered'),
('Layla Saeed', '+965 9999 4444', 'created'),
('Khalid Rashid', '+965 9999 5555', 'assigned')
ON CONFLICT (order_id) DO NOTHING;

-- Add deliveries for Ahmed's driver record
INSERT INTO public.deliveries (order_id, driver_id, status, assigned_at, picked_up_at, delivered_at) VALUES 
(3, 2, 'assigned', NOW() - INTERVAL '2 hours', NULL, NULL),
(4, 2, 'picked_up', NOW() - INTERVAL '1 hour', NOW() - INTERVAL '30 minutes', NULL),
(5, 2, 'delivered', NOW() - INTERVAL '3 hours', NOW() - INTERVAL '2.5 hours', NOW() - INTERVAL '2 hours')
ON CONFLICT (delivery_id) DO NOTHING;

-- Set trust scores
INSERT INTO public.driver_trust (driver_id, trust_score) VALUES 
(2, 95),
(3, 100)
ON CONFLICT (driver_id) DO UPDATE SET trust_score = EXCLUDED.trust_score;

-- Add QR codes
INSERT INTO public.order_qr_codes (order_id, qr_token, expires_at) VALUES 
(3, 'QR_ORDER_3_TOKEN', NOW() + INTERVAL '24 hours'),
(4, 'QR_ORDER_4_TOKEN', NOW() + INTERVAL '24 hours'),
(5, 'QR_ORDER_5_TOKEN', NOW() + INTERVAL '24 hours')
ON CONFLICT (order_id) DO UPDATE SET 
  qr_token = EXCLUDED.qr_token,
  expires_at = EXCLUDED.expires_at;