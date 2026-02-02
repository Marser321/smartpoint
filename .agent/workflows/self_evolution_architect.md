---
description: Sistema de mejora continua y auto-corrección para generación de código de alta calidad
---

# 🧬 Self Evolution Architect

## Propósito
Garantizar que cada bloque de código generado sea funcional, elegante y libre de errores antes de presentarlo al usuario.

---

## 1. Protocolo de Auto-Validación

### Antes de Generar Código
```
CHECKLIST PRE-GENERACIÓN:
□ ¿Todas las importaciones existen?
□ ¿Los tipos están definidos o importados?
□ ¿Las variables de entorno necesarias están documentadas?
□ ¿El componente sigue el patrón Next.js 15 (App Router)?
□ ¿Se usan Server/Client Components correctamente?
```

### Durante la Generación
```
VALIDACIONES EN TIEMPO REAL:
1. Verificar que cada import tenga un export correspondiente
2. Confirmar que los hooks solo se usen en Client Components
3. Asegurar que las llamadas a Supabase usen el cliente correcto (server/client)
4. Validar que los paths de archivos sigan la estructura del proyecto
```

### Después de Generar
```
POST-GENERACIÓN:
1. Ejecutar mentalmente el código
2. Identificar posibles runtime errors
3. Verificar que los tipos sean consistentes
4. Confirmar que el diseño siga luxury_apple_aesthetic
```

---

## 2. Patrones de Error Comunes y Soluciones

### Error: Import no encontrado
```typescript
// ❌ Error común
import { Button } from '@/components/ui/button'
// Si el archivo no existe, CREAR el componente primero

// ✅ Solución
// 1. Verificar si components/ui/button.tsx existe
// 2. Si no existe, crearlo siguiendo el sistema de diseño
// 3. Luego usar el import
```

### Error: Hook en Server Component
```typescript
// ❌ Error
// app/page.tsx (Server Component por defecto)
import { useState } from 'react'

// ✅ Solución
// Extraer a un Client Component
// components/feature/InteractiveSection.tsx
'use client'
import { useState } from 'react'
```

### Error: Supabase Client Incorrecto
```typescript
// ❌ Error: Usando cliente de browser en server
// app/api/route.ts
import { createClient } from '@/lib/supabase/client' // BROWSER

// ✅ Solución
import { createClient } from '@/lib/supabase/server' // SERVER
```

---

## 3. Refinamiento Estético Automático

### Trigger: Interfaz Básica Detectada
Si un componente generado tiene:
- Fondos blancos o grises claros
- Botones sin gradientes ni sombras
- Texto sin jerarquía visual
- Ausencia de animaciones

### Acción Automática
```
1. Invocar luxury_apple_aesthetic.md
2. Aplicar paleta de colores correcta
3. Añadir efectos glassmorphism donde corresponda
4. Implementar transiciones suaves
5. Regenerar el componente refinado
```

### Ejemplo de Refinamiento
```tsx
// ❌ Versión básica
<button className="bg-blue-500 text-white px-4 py-2 rounded">
  Enviar
</button>

// ✅ Versión refinada automáticamente
<button className="
  bg-gradient-to-r from-buddha-gold to-buddha-gold-dark
  text-cod-gray font-semibold
  px-6 py-3 rounded-xl
  shadow-lg shadow-buddha-gold/30
  hover:shadow-xl hover:shadow-buddha-gold/40
  hover:-translate-y-0.5
  transition-all duration-300 ease-out
">
  Enviar
</button>
```

---

## 4. Estructura de Proyecto Estándar

### Next.js 15 App Router
```
smartpoint/
├── app/
│   ├── (main)/              # Rutas públicas
│   │   ├── page.tsx         # Landing
│   │   ├── tienda/          # E-commerce
│   │   └── reparacion/      # Solicitud de reparación
│   ├── (admin)/             # Panel de administración
│   │   └── dashboard/
│   ├── api/                 # API Routes
│   └── layout.tsx           # Root layout
├── components/
│   ├── ui/                  # Componentes base (buttons, inputs)
│   ├── layout/              # Header, Footer, Navigation
│   ├── features/            # Componentes de negocio
│   └── providers/           # Context providers
├── lib/
│   ├── supabase/           # Clientes Supabase
│   ├── utils/              # Utilidades
│   └── validations/        # Schemas Zod
├── types/                   # TypeScript types
└── public/                  # Assets estáticos
```

---

## 5. Checklist de Calidad Final

Antes de mostrar cualquier código al usuario:

```
CALIDAD:
□ El código compila sin errores de TypeScript
□ Los componentes siguen el naming convention (PascalCase)
□ Las funciones tienen tipos de retorno explícitos
□ No hay any types innecesarios
□ Los efectos secundarios están manejados correctamente

DISEÑO:
□ Cumple con luxury_apple_aesthetic
□ Es responsive (mobile-first)
□ Tiene estados de loading y error
□ Las animaciones son suaves (no abruptas)

SEGURIDAD:
□ No hay secrets hardcodeados
□ Las queries SQL usan prepared statements
□ Los inputs están validados con Zod
□ RLS está habilitado en Supabase
```

---

## 6. Protocolo de Recuperación

Si se detecta un error después de generar código:

1. **NO preguntar al usuario** - Analizar el error
2. **Identificar la causa raíz** - No solo el síntoma
3. **Aplicar el parche** - Corregir en el punto exacto
4. **Regenerar el bloque** - Mostrar versión corregida
5. **Documentar** - Explicar brevemente qué se corrigió
