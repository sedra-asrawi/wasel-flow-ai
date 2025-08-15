-- Remove foreign key constraints that reference auth.users
ALTER TABLE public.drivers DROP CONSTRAINT IF EXISTS drivers_auth_user_id_fkey;

-- Create drivers for the authenticated users
INSERT INTO public.drivers (auth_user_id, full_name, phone, status) VALUES 
('9339f660-0454-4e6a-aa35-d1a2f19c0da3', 'Ahmed Hassan', '+965 5000 1234', 'active'),
('722a26e1-0ce5-48fa-847a-af41adaf9724', 'Nour Al-Wasel', '+965 5000 5678', 'active')
ON CONFLICT (driver_id) DO UPDATE SET 
  auth_user_id = EXCLUDED.auth_user_id,
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