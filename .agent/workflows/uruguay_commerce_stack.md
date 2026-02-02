---
description: Stack de comercio electrónico optimizado para Uruguay - Pagos, Logística y Geo-validación
---

# 🇺🇾 Uruguay Commerce Stack

## Contexto
Operaciones de e-commerce para Smart Point en Maldonado/Punta del Este, Uruguay.

---

## 1. Pasarelas de Pago

### Bamboo Payment (Primario)
- **Integración**: API REST v1
- **Monedas**: UYU (peso uruguayo) y USD
- **Métodos**: Tarjetas de crédito/débito, transferencias bancarias
- **Configuración**:
```typescript
// lib/payments/bamboo.ts
const BAMBOO_CONFIG = {
  apiUrl: process.env.BAMBOO_API_URL,
  publicKey: process.env.BAMBOO_PUBLIC_KEY,
  secretKey: process.env.BAMBOO_SECRET_KEY,
  currency: 'UYU', // Por defecto
  country: 'UY'
}
```

### Mercado Pago (Alternativo)
- **SDK**: @mercadopago/sdk-react
- **Checkout Pro** para experiencia optimizada
- **Configuración**:
```typescript
// lib/payments/mercadopago.ts
const MP_CONFIG = {
  accessToken: process.env.MP_ACCESS_TOKEN,
  publicKey: process.env.MP_PUBLIC_KEY,
  integratorId: process.env.MP_INTEGRATOR_ID
}
```

---

## 2. Logística y Envíos

### Proveedores Integrados

| Proveedor | Tipo | Cobertura | API |
|-----------|------|-----------|-----|
| **UES** | Estándar | Nacional | REST |
| **DePunta** | Regional | Maldonado/PDE | Webhook |
| **UesGo** | Express 3h | Maldonado | REST |

### Estructura de Envío
```typescript
// types/shipping.ts
interface ShippingOption {
  provider: 'ues' | 'depunta' | 'uesgo';
  name: string;
  estimatedHours: number;
  price: number;
  currency: 'UYU';
  available: boolean;
}

// Lógica de disponibilidad
const EXPRESS_ZONES = ['maldonado', 'punta_del_este', 'san_carlos'];
```

---

## 3. Geo-Validación (Maldonado/Punta del Este)

### Direcciones Válidas
```typescript
// lib/geo/maldonado-validator.ts
const VALID_ZONES = [
  { name: 'Punta del Este', paradas: [1, 50] }, // Parada 1 a 50
  { name: 'Av. Roosevelt', validRanges: true },
  { name: 'Av. Gorlero', validRanges: true },
  { name: 'La Barra', validRanges: true },
  { name: 'Manantiales', validRanges: true },
  { name: 'José Ignacio', expressAvailable: false },
];

// Formato de dirección esperado
interface MaldonadoAddress {
  street: string;
  number?: string;
  parada?: number; // Para direcciones tipo "Parada 10"
  zone: string;
  department: 'Maldonado';
  postalCode?: string;
  reference?: string; // "Frente al shopping", etc.
}
```

### Validación de Cobertura Express
```typescript
function canUseExpress(address: MaldonadoAddress): boolean {
  if (address.parada && address.parada <= 30) return true;
  if (EXPRESS_ZONES.includes(address.zone.toLowerCase())) return true;
  return false;
}
```

---

## 4. Reglas de Implementación

1. **Siempre mostrar precios en UYU** con opción de ver en USD
2. **Express (UesGo)**: Solo disponible para zonas urbanas de Maldonado
3. **Retiro en tienda**: Siempre disponible como opción gratuita
4. **Cálculo de IVA**: 22% incluido en todos los precios
