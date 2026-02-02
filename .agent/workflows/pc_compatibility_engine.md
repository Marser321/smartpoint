---
name: PC Compatibility Engine
description: Motor lógico para validación de compatibilidad de hardware en tiempo real
---

# 🧠 Motor de Compatibilidad de PC

## Propósito
Prevenir que el usuario arme una configuración de PC que no funcione físicamente o tenga cuellos de botella críticos.

---

## Reglas de Validación

### 1. Socket CPU ↔ Motherboard
```typescript
const SOCKET_MAP = {
  // AMD
  'AM5': ['Ryzen 7000', 'Ryzen 9000'],
  'AM4': ['Ryzen 3000', 'Ryzen 5000', 'Ryzen 4000G'],
  // Intel
  'LGA1700': ['12th Gen', '13th Gen', '14th Gen'],
  'LGA1200': ['10th Gen', '11th Gen'],
}
```
- **Error:** "Este CPU no es compatible con esta placa. Necesitás socket X."

### 2. Potencia PSU ↔ Sistema
```typescript
// Consumo estimado por tier
const POWER_REQUIREMENTS = {
  gpu: { low: 75, mid: 180, high: 350, extreme: 450 },
  cpu: { low: 65, mid: 105, high: 125, extreme: 170 },
  base: 100, // RAM, Storage, Fans
}
// Regla: PSU >= (gpu + cpu + base) * 1.2 (20% headroom)
```
- **Warning:** "Tu fuente de X watts puede ser justa. Recomendamos Y watts."

### 3. Dimensiones Físicas
```typescript
interface GpuDimensions {
  length: number  // mm
  slots: number   // 2, 2.5, 3, 4
}
interface CaseClearance {
  maxGpuLength: number
  maxCpuCoolerHeight: number
}
// Validar: gpu.length <= case.maxGpuLength
```
- **Error:** "Esta GPU mide 350mm pero tu gabinete soporta máximo 320mm."

### 4. Cuello de Botella
```typescript
// Tier matching
const TIER_MAP = {
  cpu: ['budget', 'midrange', 'high-end', 'enthusiast'],
  gpu: ['budget', 'midrange', 'high-end', 'enthusiast'],
}
// Warning si diferencia de tier > 1
```
- **Warning:** "Estás juntando un CPU básico con una GPU tope de gama. Vas a perder rendimiento."

---

## API de Validación

```typescript
interface ValidationResult {
  valid: boolean
  errors: { component: string; message: string; severity: 'error' | 'warning' }[]
}

function validateBuild(components: BuildState): ValidationResult
```

---

## Integración UI
- **Error (Rojo Neón):** Bloquear selección + Toast explicativo
- **Warning (Amarillo/Dorado):** Permitir pero mostrar advertencia
- **Success (Verde):** Indicador de compatibilidad al lado del componente
