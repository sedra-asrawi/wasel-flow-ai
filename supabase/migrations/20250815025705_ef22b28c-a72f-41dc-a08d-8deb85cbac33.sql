-- Remove foreign key constraints that reference auth.users
ALTER TABLE public.drivers DROP CONSTRAINT IF EXISTS drivers_auth_user_id_fkey;

-- Create drivers for the authenticated users with unique phone numbers
INSERT INTO public.drivers (auth_user_id, full_name, phone, status) VALUES 
('9339f660-0454-4e6a-aa35-d1a2f19c0da3', 'Ahmed Hassan', '+965 5001 1234', 'active'),
('722a26e1-0ce5-48fa-847a-af41adaf9724', 'Nour Al-Wasel', '+965 5001 5678', 'active')
ON CONFLICT (auth_user_id) DO UPDATE SET 
  full_name = EXCLUDED.full_name,
  phone = EXCLUDED.phone;

-- Initialize driver trust scores for new drivers
INSERT INTO public.driver_trust (driver_id, trust_score) 
SELECT driver_id, 95 FROM drivers WHERE auth_user_id IN ('9339f660-0454-4e6a-aa35-d1a2f19c0da3', '722a26e1-0ce5-48fa-847a-af41adaf9724')
ON CONFLICT (driver_id) DO UPDATE SET trust_score = EXCLUDED.trust_score;