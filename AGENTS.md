# AGENTS.md - Reglas del Proyecto SmartPoint

Este archivo sirve como "memoria a largo plazo" para mantener la coherencia del proyecto.

---

## 🎨 Estética

| Propiedad | Valor |
|-----------|-------|
| **Paleta Principal** | Glassmorphism oscuro |
| **Fondo Base** | `#0A0A0A` (Cod Gray) |
| **Acentos Dorados** | `#C4B001` (Buddha Gold) |
| **Accent Admin** | `--sp-red` (Rojo Smart Point) |
| **Estilo de Cards** | `glass-card` con backdrop-blur |

---

## 🛠️ Tech Stack

- **Framework:** Next.js 15+ (App Router)
- **Styling:** Tailwind CSS v4
- **Base de Datos:** Supabase (PostgreSQL)
- **Animaciones:** Framer Motion
- **Iconos:** Lucide React
- **Formularios:** React Hook Form + Zod

### ⚠️ Restricciones

- ❌ **NO usar** Three.js ni librerías 3D complejas
- ❌ **NO usar** Shadcn/UI (solo cuando se pida explícitamente)
- ✅ **PREFERIR** CSS puro + Framer Motion para efectos visuales
- ✅ **PREFERIR** Glassmorphism sobre diseños planos

---

## 🇺🇾 Contexto de Negocio (Uruguay)

| Campo | Valor |
|-------|-------|
| **Ubicación** | Maldonado / Punta del Este |
| **Monedas** | UYU (primaria), USD (secundaria) |
| **IVA** | 22% incluido en precios |
| **Contacto Prioritario** | WhatsApp |
| **Envío Express** | Solo Maldonado urbano |

---

## 🔐 Estado Actual del Sistema

### Modo Demo (Bypass de Auth)
```env
NEXT_PUBLIC_DEMO_MODE=true
```
> Este modo permite acceder al Admin Panel sin autenticación para demostraciones.
> **DEBE MANTENERSE ACTIVO** para presentaciones al dueño.

### PC Builder
- **Implementación:** Hotspots interactivos sobre canvas
- **Datos:** Actualmente usa MOCK_PRODUCTS (mock data)
- **Objetivo:** Simple y visual, no simulación de física 3D

### Tienda
- **Fallback:** Si no hay productos en DB, usa demo-data.ts
- **Checkout:** Flujo de 5-6 clics, integrado con WhatsApp

---

## 📱 Reglas de UX

1. **Mobile-First:** La interfaz móvil es prioridad absoluta
2. **WhatsApp:** Es la forma principal de cerrar ventas
3. **Precios:** Siempre mostrar en UYU, opción de USD
4. **Envío gratis:** Para compras mayores a $3000 UYU

---

## 🎯 Funcionalidades Prioritarias

1. ✅ Panel Admin funcional con modo demo
2. ✅ Tienda con checkout
3. ✅ PC Builder con hotspots
4. 🔄 WhatsApp VIP para ventas altas
5. 🔄 Diagnóstico con IA
6. 🔄 Membresías Smart Shield

---

## 📝 Convenciones de Código

- **Idioma de código:** Español (comentarios, variables, commits)
- **Formato de precios:** `formatPriceUYU()` de `@/lib/utils`
- **Colores:** Usar variables CSS (`--buddha-gold`, `--cod-gray`, etc.)
- **Componentes:** PascalCase, archivos kebab-case
