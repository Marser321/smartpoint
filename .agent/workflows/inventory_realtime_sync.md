---
name: Inventory Realtime Sync
description: Sistema de sincronización de stock y ofertas en tiempo real con Supabase
---

# 📦 Sincronización de Inventario en Tiempo Real

## Propósito
Alimentar la app con stock real, ofertas dinámicas y priorización inteligente de productos.

---

## Schema de Base de Datos

```sql
CREATE TABLE hardware_stock (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  sku VARCHAR(50) UNIQUE NOT NULL,
  nombre VARCHAR(200) NOT NULL,
  categoria ENUM('cpu', 'gpu', 'ram', 'storage', 'psu', 'motherboard', 'case', 'cooling', 'cables'),
  marca VARCHAR(100),
  
  -- Specs técnicos (JSONB para flexibilidad)
  specs JSONB DEFAULT '{}',
  -- Ejemplo GPU: { "vram": 12, "tdp": 350, "length_mm": 320, "slots": 2.5 }
  -- Ejemplo CPU: { "socket": "AM5", "cores": 8, "tdp": 105, "tier": "high-end" }
  
  -- Pricing
  precio_costo DECIMAL(10,2),
  precio_venta DECIMAL(10,2) NOT NULL,
  precio_anterior DECIMAL(10,2),
  margen_porcentaje DECIMAL(5,2) GENERATED ALWAYS AS ((precio_venta - precio_costo) / precio_costo * 100) STORED,
  
  -- Stock
  stock_actual INT DEFAULT 0,
  stock_minimo INT DEFAULT 2,
  bajo_pedido BOOLEAN DEFAULT FALSE,
  
  -- Ofertas
  oferta_activa BOOLEAN DEFAULT FALSE,
  oferta_hasta TIMESTAMPTZ,
  
  -- Estética
  color_palette VARCHAR(50)[], -- ['stealth_black', 'pure_white', 'rgb']
  imagen_url TEXT,
  imagen_transparente TEXT, -- PNG sin fondo para el Builder
  
  -- Metadata
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Índices para queries rápidas
CREATE INDEX idx_hardware_categoria ON hardware_stock(categoria);
CREATE INDEX idx_hardware_stock ON hardware_stock(stock_actual);
CREATE INDEX idx_hardware_oferta ON hardware_stock(oferta_activa) WHERE oferta_activa = TRUE;
```

---

## Reglas de Negocio

### 1. Estado de Stock
```typescript
function getStockStatus(item: HardwareItem): 'available' | 'low' | 'out' | 'order' {
  if (item.bajo_pedido) return 'order'
  if (item.stock_actual === 0) return 'out'
  if (item.stock_actual <= item.stock_minimo) return 'low'
  return 'available'
}
```

### 2. UI según Estado
| Estado | Visual | Acción |
|--------|--------|--------|
| `available` | Normal | Seleccionable |
| `low` | Badge "¡Últimas unidades!" | Seleccionable + urgencia |
| `out` | Gris + Ojo tachado | Deshabilitado |
| `order` | Badge "Bajo Pedido (7 días)" | Seleccionable + info |

### 3. Ofertas Activas
```typescript
if (item.oferta_activa && item.oferta_hasta > now()) {
  // Mostrar precio anterior tachado
  // Precio actual en Buddha Gold (#FFD700)
  // Badge "🔥 OFERTA" con countdown si < 24h
}
```

### 4. Priorización "Recomendados"
```sql
SELECT * FROM hardware_stock 
WHERE categoria = $1 AND stock_actual > 0
ORDER BY 
  oferta_activa DESC,           -- Ofertas primero
  margen_porcentaje DESC,       -- Mayor margen
  stock_actual DESC             -- Más stock disponible
LIMIT 6;
```

---

## Realtime Subscriptions

```typescript
// Supabase Realtime para updates de stock
const subscription = supabase
  .channel('hardware-stock-changes')
  .on('postgres_changes', 
    { event: '*', schema: 'public', table: 'hardware_stock' },
    (payload) => {
      // Actualizar UI sin refresh
      updateComponentCard(payload.new)
    }
  )
  .subscribe()
```

---

## Integración N8N (Futura)
1. **Trigger:** Cron cada 1 hora
2. **Acción:** Leer Google Sheet de proveedores
3. **Comparación:** Si precio bajó en 24h → marcar `oferta_flash = true`
4. **Update:** Escribir a Supabase via API
