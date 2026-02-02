-- =====================================================
-- SmartPoint PC Studio - Tabla de Hardware Stock
-- Ejecutar en Supabase SQL Editor
-- =====================================================

-- Tabla de Stock de Hardware para PC Builder
CREATE TABLE IF NOT EXISTS hardware_stock (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  sku VARCHAR(50) UNIQUE NOT NULL,
  nombre VARCHAR(200) NOT NULL,
  categoria VARCHAR(50) NOT NULL CHECK (categoria IN ('cpu', 'gpu', 'ram', 'storage', 'psu', 'motherboard', 'case', 'cooling', 'cables')),
  marca VARCHAR(100),
  
  -- Specs técnicos (JSONB para flexibilidad)
  -- GPU: { "vram": 12, "tdp": 350, "length_mm": 320, "slots": 2.5 }
  -- CPU: { "socket": "AM5", "cores": 8, "tdp": 105 }
  -- RAM: { "type": "DDR5", "speed": 6000, "capacity": 32 }
  -- PSU: { "watts": 850, "efficiency": "80+ Gold" }
  -- Case: { "max_gpu_length": 380, "max_cooler_height": 165 }
  specs JSONB DEFAULT '{}',
  
  -- Pricing (UYU)
  precio_costo DECIMAL(10,2),
  precio_venta DECIMAL(10,2) NOT NULL,
  precio_anterior DECIMAL(10,2),
  
  -- Stock
  stock_actual INT DEFAULT 0,
  stock_minimo INT DEFAULT 2,
  bajo_pedido BOOLEAN DEFAULT FALSE,
  
  -- Ofertas
  oferta_activa BOOLEAN DEFAULT FALSE,
  oferta_hasta TIMESTAMPTZ,
  
  -- Estética (array de paletas)
  color_palette TEXT[] DEFAULT '{}',
  imagen_url TEXT,
  imagen_transparente TEXT, -- PNG sin fondo para el Builder
  
  -- Compatibilidad
  tier VARCHAR(20) CHECK (tier IN ('budget', 'midrange', 'high-end', 'enthusiast')),
  
  -- Metadata
  activo BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Índices para performance
CREATE INDEX IF NOT EXISTS idx_hardware_categoria ON hardware_stock(categoria);
CREATE INDEX IF NOT EXISTS idx_hardware_stock_level ON hardware_stock(stock_actual);
CREATE INDEX IF NOT EXISTS idx_hardware_oferta ON hardware_stock(oferta_activa) WHERE oferta_activa = TRUE;
CREATE INDEX IF NOT EXISTS idx_hardware_activo ON hardware_stock(activo) WHERE activo = TRUE;

-- Row Level Security
ALTER TABLE hardware_stock ENABLE ROW LEVEL SECURITY;

-- Políticas RLS
CREATE POLICY "hardware_public_read" ON hardware_stock
  FOR SELECT USING (true);

CREATE POLICY "hardware_auth_write" ON hardware_stock
  FOR ALL USING (auth.role() = 'authenticated');

-- =====================================================
-- DATOS DE EJEMPLO (SEED)
-- =====================================================

INSERT INTO hardware_stock (sku, nombre, categoria, marca, specs, precio_venta, precio_anterior, stock_actual, tier, color_palette, oferta_activa) VALUES
-- CPUs
('CPU-R7-7800X3D', 'AMD Ryzen 7 7800X3D', 'cpu', 'AMD', '{"socket": "AM5", "cores": 8, "threads": 16, "tdp": 120, "cache": "96MB 3D V-Cache"}', 18500, 21000, 5, 'high-end', ARRAY['stealth_black'], true),
('CPU-R5-7600X', 'AMD Ryzen 5 7600X', 'cpu', 'AMD', '{"socket": "AM5", "cores": 6, "threads": 12, "tdp": 105}', 9800, NULL, 8, 'midrange', ARRAY['stealth_black'], false),
('CPU-I7-14700K', 'Intel Core i7-14700K', 'cpu', 'Intel', '{"socket": "LGA1700", "cores": 20, "threads": 28, "tdp": 125}', 17500, NULL, 3, 'high-end', ARRAY['stealth_black'], false),
('CPU-I5-14600K', 'Intel Core i5-14600K', 'cpu', 'Intel', '{"socket": "LGA1700", "cores": 14, "threads": 20, "tdp": 125}', 12500, NULL, 6, 'midrange', ARRAY['stealth_black'], false),

-- GPUs
('GPU-RTX4090', 'NVIDIA GeForce RTX 4090 Founders', 'gpu', 'NVIDIA', '{"vram": 24, "tdp": 450, "length_mm": 336, "slots": 3}', 85000, 92000, 2, 'enthusiast', ARRAY['stealth_black', 'pure_white'], true),
('GPU-RTX4070TIS', 'NVIDIA GeForce RTX 4070 Ti SUPER', 'gpu', 'NVIDIA', '{"vram": 16, "tdp": 285, "length_mm": 310, "slots": 2.5}', 42000, NULL, 4, 'high-end', ARRAY['stealth_black'], false),
('GPU-RX7900XTX', 'AMD Radeon RX 7900 XTX', 'gpu', 'AMD', '{"vram": 24, "tdp": 355, "length_mm": 287, "slots": 2.5}', 48000, 52000, 3, 'enthusiast', ARRAY['stealth_black', 'rgb'], true),
('GPU-RTX4060', 'NVIDIA GeForce RTX 4060', 'gpu', 'NVIDIA', '{"vram": 8, "tdp": 115, "length_mm": 240, "slots": 2}', 14500, NULL, 10, 'midrange', ARRAY['stealth_black', 'pure_white'], false),

-- RAM
('RAM-DDR5-32GB', 'Corsair Vengeance DDR5-6000 32GB (2x16)', 'ram', 'Corsair', '{"type": "DDR5", "speed": 6000, "capacity": 32, "latency": "CL36"}', 6500, NULL, 12, 'high-end', ARRAY['stealth_black'], false),
('RAM-DDR5-32RGB', 'G.Skill Trident Z5 RGB DDR5-6400 32GB', 'ram', 'G.Skill', '{"type": "DDR5", "speed": 6400, "capacity": 32, "latency": "CL32"}', 8200, NULL, 6, 'enthusiast', ARRAY['stealth_black', 'rgb'], false),

-- Motherboards
('MB-X670E-HERO', 'ASUS ROG Crosshair X670E Hero', 'motherboard', 'ASUS', '{"socket": "AM5", "chipset": "X670E", "form_factor": "ATX", "ram_slots": 4, "max_ram": 128}', 22000, NULL, 2, 'enthusiast', ARRAY['stealth_black', 'rgb'], false),
('MB-B650-AORUS', 'Gigabyte B650 AORUS Elite AX', 'motherboard', 'Gigabyte', '{"socket": "AM5", "chipset": "B650", "form_factor": "ATX", "ram_slots": 4, "max_ram": 128}', 9500, 11000, 5, 'midrange', ARRAY['stealth_black'], true),
('MB-Z790-HERO', 'ASUS ROG Maximus Z790 Hero', 'motherboard', 'ASUS', '{"socket": "LGA1700", "chipset": "Z790", "form_factor": "ATX", "ram_slots": 4, "max_ram": 192}', 25000, NULL, 1, 'enthusiast', ARRAY['stealth_black', 'rgb'], false),

-- Storage
('SSD-990PRO-2TB', 'Samsung 990 PRO 2TB NVMe', 'storage', 'Samsung', '{"type": "NVMe", "capacity": 2000, "read_speed": 7450, "write_speed": 6900}', 9800, NULL, 8, 'high-end', ARRAY['stealth_black'], false),
('SSD-SN850X-1TB', 'WD Black SN850X 1TB NVMe', 'storage', 'Western Digital', '{"type": "NVMe", "capacity": 1000, "read_speed": 7300, "write_speed": 6300}', 5200, 5800, 15, 'high-end', ARRAY['stealth_black'], true),

-- PSU
('PSU-RM1000X', 'Corsair RM1000x 80+ Gold', 'psu', 'Corsair', '{"watts": 1000, "efficiency": "80+ Gold", "modular": true}', 8500, NULL, 6, 'high-end', ARRAY['stealth_black'], false),
('PSU-THOR1200', 'ASUS ROG Thor 1200W Platinum', 'psu', 'ASUS', '{"watts": 1200, "efficiency": "80+ Platinum", "modular": true}', 14500, 16000, 2, 'enthusiast', ARRAY['stealth_black', 'rgb'], true),

-- Cases
('CASE-O11DEVO', 'Lian Li O11 Dynamic EVO', 'case', 'Lian Li', '{"max_gpu_length": 423, "max_cooler_height": 167, "form_factor": "ATX"}', 7200, NULL, 4, 'high-end', ARRAY['stealth_black', 'pure_white'], false),
('CASE-H9ELITE', 'NZXT H9 Elite', 'case', 'NZXT', '{"max_gpu_length": 435, "max_cooler_height": 165, "form_factor": "ATX"}', 9500, NULL, 3, 'high-end', ARRAY['stealth_black', 'pure_white'], false),

-- Cooling
('COOL-KRAKEN360', 'NZXT Kraken Z63 RGB', 'cooling', 'NZXT', '{"type": "AIO", "radiator": 360, "height": 30}', 12500, NULL, 5, 'high-end', ARRAY['stealth_black', 'rgb'], false),
('COOL-NHDS15', 'Noctua NH-D15 chromax.black', 'cooling', 'Noctua', '{"type": "Air", "height": 165}', 4200, NULL, 8, 'high-end', ARRAY['stealth_black'], false);
