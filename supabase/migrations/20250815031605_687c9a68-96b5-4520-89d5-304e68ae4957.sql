-- Add more drivers with varied performance levels for rankings
INSERT INTO public.drivers (full_name, phone, status, created_at) VALUES 
('Ethan Carter', '+965 5020 1111', 'active', NOW() - INTERVAL '9 months'),
('Liam Harper', '+965 5021 2222', 'active', NOW() - INTERVAL '7 months'),
('Noah Bennett', '+965 5022 3333', 'active', NOW() - INTERVAL '5 months'),
('Mason Rodriguez', '+965 5023 4444', 'active', NOW() - INTERVAL '4 months'),
('Oliver Thompson', '+965 5024 5555', 'break', NOW() - INTERVAL '6 months'),
('Jacob Martinez', '+965 5025 6666', 'active', NOW() - INTERVAL '8 months'),
('William Anderson', '+965 5026 7777', 'offline', NOW() - INTERVAL '10 months'),
('James Wilson', '+965 5027 8888', 'active', NOW() - INTERVAL '3 months'),
('Benjamin Davis', '+965 5028 9999', 'active', NOW() - INTERVAL '2 months'),
('Lucas Garcia', '+965 5029 0000', 'active', NOW() - INTERVAL '1 month')
ON CONFLICT (driver_id) DO NOTHING;

-- Add more orders to create delivery history
INSERT INTO public.orders (customer_name, customer_phone, status, created_at) VALUES 
('Sarah Al-Ahmad', '+965 7777 1111', 'delivered', NOW() - INTERVAL '8 hours'),
('Khalil Mohammed', '+965 7777 2222', 'delivered', NOW() - INTERVAL '7 hours'),
('Amina Hassan', '+965 7777 3333', 'delivered', NOW() - INTERVAL '6 hours'),
('Rashid Al-Fahad', '+965 7777 4444', 'delivered', NOW() - INTERVAL '5 hours'),
('Mona Abdullah', '+965 7777 5555', 'delivered', NOW() - INTERVAL '4 hours'),
('Faisal Al-Rashid', '+965 7777 6666', 'delivered', NOW() - INTERVAL '3 hours'),
('Nadia Salem', '+965 7777 7777', 'delivered', NOW() - INTERVAL '2 hours'),
('Ahmed Khalil', '+965 7777 8888', 'delivered', NOW() - INTERVAL '1 hour'),
('Layla Al-Sabah', '+965 7777 9999', 'assigned', NOW() - INTERVAL '30 minutes'),
('Omar Al-Thani', '+965 7777 0000', 'created', NOW() - INTERVAL '15 minutes')
ON CONFLICT (order_id) DO NOTHING;