-- Remove foreign key constraints that reference auth.users
ALTER TABLE public.drivers DROP CONSTRAINT IF EXISTS drivers_auth_user_id_fkey;

-- Create drivers for the authenticated users with unique phone numbers
INSERT INTO public.drivers (auth_user_id, full_name, phone, status) VALUES 
('9339f660-0454-4e6a-aa35-d1a2f19c0da3', 'Ahmed Hassan', '+965 5001 1234', 'active'),
('722a26e1-0ce5-48fa-847a-af41adaf9724', 'Nour Al-Wasel', '+965 5001 5678', 'active')
ON CONFLICT (auth_user_id) DO UPDATE SET 
  full_name = EXCLUDED.full_name,
  phone = EXCLUDED.phone;

-- Add some sample orders
INSERT INTO public.orders (customer_name, customer_phone, status) VALUES 
('Mohammed Ali', '+965 9991 1111', 'created'),
('Fatima Ahmed', '+965 9991 2222', 'picked_up'),
('Omar Khan', '+965 9991 3333', 'delivered'),
('Layla Saeed', '+965 9991 4444', 'created'),
('Khalid Rashid', '+965 9991 5555', 'assigned')
ON CONFLICT (order_id) DO NOTHING;

-- Add deliveries and trust scores
INSERT INTO public.deliveries (order_id, driver_id, status, assigned_at, picked_up_at, delivered_at) VALUES 
(3, 3, 'assigned', NOW() - INTERVAL '2 hours', NULL, NULL),
(4, 3, 'picked_up', NOW() - INTERVAL '1 hour', NOW() - INTERVAL '30 minutes', NULL),
(5, 3, 'delivered', NOW() - INTERVAL '3 hours', NOW() - INTERVAL '2.5 hours', NOW() - INTERVAL '2 hours')
ON CONFLICT (delivery_id) DO NOTHING;

-- Initialize driver trust scores
INSERT INTO public.driver_trust (driver_id, trust_score) VALUES 
(3, 95),
(4, 100),
(2, 88)
ON CONFLICT (driver_id) DO UPDATE SET trust_score = EXCLUDED.trust_score;