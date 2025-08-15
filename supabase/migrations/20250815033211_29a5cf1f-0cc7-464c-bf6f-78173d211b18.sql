-- Insert realistic driver data to match the mock data structure
INSERT INTO drivers (driver_id, full_name, phone, status, auth_user_id) VALUES
(1, 'Mohammed Hassan', '+96512345001', 'active', NULL),
(2, 'Ahmed Al-Rashid', '+96512345002', 'active', NULL),
(3, 'Omar Khalil', '+96512345003', 'active', NULL),
(4, 'Youssef Ibrahim', '+96512345004', 'offline', NULL),
(5, 'Hassan Ali', '+96512345005', 'active', NULL),
(6, 'Khalid Mahmoud', '+96512345006', 'break', NULL)
ON CONFLICT (driver_id) DO UPDATE SET
  full_name = EXCLUDED.full_name,
  phone = EXCLUDED.phone,
  status = EXCLUDED.status;

-- Create additional driver info table for extended data
CREATE TABLE IF NOT EXISTS driver_info (
  driver_id BIGINT PRIMARY KEY REFERENCES drivers(driver_id),
  rating DECIMAL(2,1) DEFAULT 5.0,
  total_deliveries INTEGER DEFAULT 0,
  today_deliveries INTEGER DEFAULT 0,
  monthly_earnings INTEGER DEFAULT 0,
  join_date DATE DEFAULT CURRENT_DATE,
  location TEXT,
  vehicle TEXT,
  on_time_rate INTEGER DEFAULT 100,
  rank INTEGER DEFAULT 1,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE driver_info ENABLE ROW LEVEL SECURITY;

-- Create policies for driver_info
CREATE POLICY "Admin can read all driver info" ON driver_info
  FOR SELECT USING (app_current_role() = 'admin');

CREATE POLICY "Wasel can manage driver info" ON driver_info
  FOR ALL USING (app_current_role() = 'wasel')
  WITH CHECK (app_current_role() = 'wasel');

CREATE POLICY "Drivers can read own info" ON driver_info
  FOR SELECT USING (driver_id IN (
    SELECT drivers.driver_id FROM drivers 
    WHERE drivers.auth_user_id = auth.uid()
  ));

-- Insert driver info to match mock data
INSERT INTO driver_info (driver_id, rating, total_deliveries, today_deliveries, monthly_earnings, join_date, location, vehicle, on_time_rate, rank) VALUES
(1, 4.9, 847, 12, 2750, '2023-01-15', 'Hawalli', 'Motorcycle', 96, 1),
(2, 4.8, 756, 8, 2420, '2023-02-20', 'Kuwait City', 'Car', 94, 2),
(3, 4.7, 623, 15, 2020, '2023-03-10', 'Salmiya', 'Motorcycle', 92, 3),
(4, 4.6, 589, 6, 1815, '2023-04-05', 'Jabriya', 'Bicycle', 89, 4),
(5, 4.5, 534, 10, 1615, '2023-05-12', 'Farwaniya', 'Motorcycle', 87, 5),
(6, 4.4, 467, 4, 1440, '2023-06-18', 'Ahmadi', 'Car', 85, 6)
ON CONFLICT (driver_id) DO UPDATE SET
  rating = EXCLUDED.rating,
  total_deliveries = EXCLUDED.total_deliveries,
  today_deliveries = EXCLUDED.today_deliveries,
  monthly_earnings = EXCLUDED.monthly_earnings,
  join_date = EXCLUDED.join_date,
  location = EXCLUDED.location,
  vehicle = EXCLUDED.vehicle,
  on_time_rate = EXCLUDED.on_time_rate,
  rank = EXCLUDED.rank,
  updated_at = NOW();

-- Create a view for the admin dashboard
CREATE OR REPLACE VIEW v_admin_dashboard_full AS
SELECT 
  d.driver_id,
  d.full_name as name,
  di.rating,
  di.total_deliveries,
  di.today_deliveries,
  di.monthly_earnings as earnings,
  d.status,
  di.join_date,
  di.location,
  di.vehicle,
  di.on_time_rate,
  di.rank
FROM drivers d
LEFT JOIN driver_info di ON d.driver_id = di.driver_id
ORDER BY di.rank ASC;