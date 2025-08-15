-- Remove drivers that don't have corresponding driver_info records (incomplete data)
DELETE FROM drivers 
WHERE driver_id NOT IN (
  SELECT DISTINCT driver_id 
  FROM driver_info 
  WHERE driver_id IS NOT NULL
);

-- Update the view to only show drivers with complete information
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
INNER JOIN driver_info di ON d.driver_id = di.driver_id
WHERE di.rating IS NOT NULL 
  AND di.total_deliveries IS NOT NULL
  AND di.location IS NOT NULL
ORDER BY di.rank ASC;