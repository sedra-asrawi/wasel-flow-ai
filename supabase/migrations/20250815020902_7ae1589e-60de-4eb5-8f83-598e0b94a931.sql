-- Add the missing user profile for ahmed@jahez.com
INSERT INTO user_profiles (user_id, role, created_at)
VALUES ('9339f660-0454-4e6a-aa35-d1a2f19c0da3', 'admin', now())
ON CONFLICT (user_id) DO NOTHING;