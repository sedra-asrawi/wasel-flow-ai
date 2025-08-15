-- First add just the missing data for trust scores for new drivers
INSERT INTO public.driver_trust (driver_id, trust_score, updated_at) VALUES 
(9, 92, NOW()),
(10, 88, NOW()),
(11, 94, NOW()),
(12, 85, NOW()),
(13, 97, NOW()),
(14, 82, NOW()),
(15, 91, NOW()),
(16, 89, NOW())
ON CONFLICT (driver_id) DO UPDATE SET 
  trust_score = EXCLUDED.trust_score,
  updated_at = EXCLUDED.updated_at;

-- Add more deliveries for existing orders with new drivers
INSERT INTO public.deliveries (order_id, driver_id, status, assigned_at, picked_up_at, delivered_at) VALUES 
(2, 9, 'delivered', NOW() - INTERVAL '6 hours', NOW() - INTERVAL '5 hours 30 minutes', NOW() - INTERVAL '5 hours'),
(3, 10, 'delivered', NOW() - INTERVAL '4 hours', NOW() - INTERVAL '3 hours 30 minutes', NOW() - INTERVAL '3 hours'),
(4, 11, 'delivered', NOW() - INTERVAL '2 hours', NOW() - INTERVAL '1 hour 30 minutes', NOW() - INTERVAL '1 hour'),
(5, 12, 'assigned', NOW() - INTERVAL '45 minutes', NULL, NULL),
(6, 13, 'picked_up', NOW() - INTERVAL '30 minutes', NOW() - INTERVAL '15 minutes', NULL)
ON CONFLICT (delivery_id) DO NOTHING;