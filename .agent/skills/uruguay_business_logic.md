---
name: Uruguay Business Logic
description: Reglas de negocio, logística y pagos para comercio electrónico en Uruguay
---

# 🇺🇾 Uruguay Business Logic - Contexto Local SmartPoint

## Propósito
Aplicar automáticamente las reglas de negocio, logística, impuestos y métodos de pago válidos para Uruguay sin necesidad de especificarlos manualmente cada vez.

## Cuándo Activar
- Al crear formularios de checkout o pago
- Al implementar cálculos de envío
- Al validar datos de cliente (CI, teléfono)
- Al mostrar precios o monedas
- Al integrar pasarelas de pago

## Reglas y Directivas

### 1. Moneda y Precios
```typescript
// SIEMPRE usar UYU como moneda principal
const MONEDA_PRINCIPAL = 'UYU'
const MONEDA_SECUNDARIA = 'USD'

// Formato de precio uruguayo
function formatPriceUYU(amount: number): string {
  return new Intl.NumberFormat('es-UY', {
    style: 'currency',
    currency: 'UYU',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(amount)
}
// Resultado: "$ 1.500" (con punto como separador de miles)
```

### 2. Teléfonos
```typescript
// Formato: 09X XXX XXX (celular) o 42XX XXXX (fijo Maldonado)
const PHONE_REGEX = /^(09[1-9]\d{6}|42\d{6})$/
const PHONE_DISPLAY = '+598 99 123 456'

// WhatsApp siempre con código país
const WHATSAPP_PREFIX = '598'
const formatWhatsApp = (phone: string) => 
  `https://wa.me/${WHATSAPP_PREFIX}${phone.replace(/^0/, '')}`
```

### 3. Cédula de Identidad (CI)
```typescript
// Validación de CI uruguaya (7-8 dígitos + dígito verificador)
function validarCI(ci: string): boolean {
  const clean = ci.replace(/\D/g, '')
  if (clean.length < 7 || clean.length > 8) return false
  
  const digits = clean.padStart(8, '0').split('').map(Number)
  const weights = [2, 9, 8, 7, 6, 3, 4]
  const sum = weights.reduce((acc, w, i) => acc + w * digits[i], 0)
  const checkDigit = (10 - (sum % 10)) % 10
  
  return checkDigit === digits[7]
}
```

### 4. Zonas de Envío (Maldonado/Punta del Este)
```typescript
const ZONAS_ENVIO = {
  'maldonado_centro': { nombre: 'Maldonado Centro', costo: 150, tiempo: '2-4 hs' },
  'punta_del_este': { nombre: 'Punta del Este', costo: 200, tiempo: '2-4 hs' },
  'san_carlos': { nombre: 'San Carlos', costo: 250, tiempo: '4-6 hs' },
  'piriapolis': { nombre: 'Piriápolis', costo: 300, tiempo: '1 día' },
  'la_barra': { nombre: 'La Barra / Manantiales', costo: 250, tiempo: '4-6 hs' },
  'jose_ignacio': { nombre: 'José Ignacio', costo: 400, tiempo: '1 día' },
}

const ENVIO_GRATIS_DESDE = 3000 // UYU
```

### 5. Métodos de Pago
```typescript
const METODOS_PAGO = {
  mercadopago: {
    nombre: 'Mercado Pago',
    icon: 'mercadopago.svg',
    comision: 0.0499, // 4.99%
    disponible: true
  },
  transferencia: {
    nombre: 'Transferencia Bancaria',
    icon: 'bank.svg',
    bancos: ['BROU', 'Itaú', 'Santander', 'Scotiabank', 'HSBC'],
    comision: 0,
    disponible: true
  },
  efectivo: {
    nombre: 'Efectivo en Local',
    icon: 'cash.svg',
    comision: 0,
    disponible: true
  },
  // Futura integración
  bamboo: {
    nombre: 'Bamboo (Tarjetas)',
    comision: 0.045,
    disponible: false
  }
}
```

### 6. Horarios de Atención
```typescript
const HORARIOS = {
  semana: { apertura: '09:00', cierre: '19:00' },
  sabado: { apertura: '10:00', cierre: '14:00' },
  domingo: 'CERRADO',
  feriados: 'CERRADO'
}

// Feriados Uruguay 2024-2025
const FERIADOS = [
  '2024-01-01', '2024-02-12', '2024-02-13', // Año Nuevo, Carnaval
  '2024-04-18', '2024-04-19', // Semana Santa
  '2024-05-01', '2024-05-18', // Trabajo, Batalla Las Piedras
  '2024-06-19', '2024-07-18', // Natalicio Artigas, Jura Constitución
  '2024-08-25', '2024-10-12', // Independencia, Día de la Raza
  '2024-11-02', '2024-12-25'  // Difuntos, Navidad
]
```

## Anti-Patrones
- ❌ Usar USD como moneda por defecto
- ❌ Validar teléfonos con formatos internacionales genéricos
- ❌ Omitir código de país (+598) en WhatsApp
- ❌ Usar comas como separador decimal (Uruguay usa punto)
- ❌ Asumir envío gratuito sin umbral mínimo

## Checklist de Validación
- [ ] Precios muestran "$ X.XXX" (formato uruguayo)
- [ ] Teléfonos validados con regex local
- [ ] WhatsApp incluye +598
- [ ] Zonas de envío incluyen Maldonado y alrededores
- [ ] Métodos de pago incluyen transferencia bancaria
- [ ] CI validada con algoritmo correcto
