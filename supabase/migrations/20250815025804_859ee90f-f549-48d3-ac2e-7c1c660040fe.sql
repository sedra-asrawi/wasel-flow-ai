-- Just add trust scores and QR codes, skip existing deliveries
INSERT INTO public.driver_trust (driver_id, trust_score) VALUES 
(2, 88),
(7, 95),
(8, 100)
ON CONFLICT (driver_id) DO UPDATE SET trust_score = EXCLUDED.trust_score;

-- Add QR codes for orders
INSERT INTO public.order_qr_codes (order_id, qr_token, expires_at) VALUES 
(2, 'QR_ORDER_2_TOKEN', NOW() + INTERVAL '24 hours'),
(3, 'QR_ORDER_3_TOKEN', NOW() + INTERVAL '24 hours'),
(4, 'QR_ORDER_4_TOKEN', NOW() + INTERVAL '24 hours'),
(5, 'QR_ORDER_5_TOKEN', NOW() + INTERVAL '24 hours'),
(6, 'QR_ORDER_6_TOKEN', NOW() + INTERVAL '24 hours')
ON CONFLICT (order_id) DO UPDATE SET 
  qr_token = EXCLUDED.qr_token,
  expires_at = EXCLUDED.expires_at;