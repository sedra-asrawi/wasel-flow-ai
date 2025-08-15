-- Remove the foreign key constraint that's causing issues
ALTER TABLE public.user_profiles DROP CONSTRAINT user_profiles_user_id_fkey;

-- Insert user profiles for existing users
INSERT INTO public.user_profiles (user_id, role) VALUES 
('9339f660-0454-4e6a-aa35-d1a2f19c0da3', 'admin'),
('722a26e1-0ce5-48fa-847a-af41adaf9724', 'wasel')
ON CONFLICT (user_id) DO UPDATE SET role = EXCLUDED.role;