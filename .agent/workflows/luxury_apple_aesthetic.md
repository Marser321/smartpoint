---
description: Sistema de diseño premium estilo Apple con glassmorphism agresivo - Valoración $25k+
---

# ✨ Luxury Apple Aesthetic

## Filosofía de Diseño
Crear interfaces que transmitan **lujo tecnológico** y **confianza premium**. Cada componente debe sentirse como un producto de alta gama.

---

## 1. Paleta de Colores (ESTRICTA)

### Colores Principales
```css
:root {
  /* Lujo / Premium */
  --buddha-gold: #C4B001;
  --buddha-gold-light: #D4C421;
  --buddha-gold-dark: #A49801;
  
  /* Fondo / Base - Modo Oscuro por Defecto */
  --cod-gray: #0A0A0A;
  --cod-gray-light: #141414;
  --cod-gray-lighter: #1A1A1A;
  
  /* Texto */
  --text-primary: #FFFFFF;
  --text-secondary: #A1A1A1;
  --text-muted: #6B6B6B;
  
  /* Estados */
  --success: #22C55E;
  --warning: #F59E0B;
  --error: #EF4444;
  --info: #3B82F6;
  
  /* Glassmorphism */
  --glass-bg: rgba(255, 255, 255, 0.05);
  --glass-border: rgba(255, 255, 255, 0.1);
  --glass-shadow: 0 8px 32px rgba(0, 0, 0, 0.4);
}
```

### Uso de Colores
| Elemento | Color | Uso |
|----------|-------|-----|
| CTAs Premium | Buddha Gold | Botones principales, badges de garantía |
| Fondo principal | Cod Gray | Background de toda la aplicación |
| Cards | Cod Gray Light | Elevación sobre el fondo |
| Texto principal | White | Títulos, contenido importante |
| Texto secundario | #A1A1A1 | Descripciones, metadata |

---

## 2. Glassmorphism Agresivo

### Componente Glass Card
```css
.glass-card {
  background: rgba(255, 255, 255, 0.03);
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 24px;
  box-shadow: 
    0 8px 32px rgba(0, 0, 0, 0.4),
    inset 0 1px 0 rgba(255, 255, 255, 0.1);
}

.glass-card-elevated {
  background: rgba(255, 255, 255, 0.05);
  backdrop-filter: blur(30px);
  border: 1px solid rgba(255, 255, 255, 0.12);
  box-shadow: 
    0 20px 60px rgba(0, 0, 0, 0.5),
    inset 0 1px 0 rgba(255, 255, 255, 0.15);
}
```

### Efectos 3D y Profundidad
```css
.depth-card {
  transform-style: preserve-3d;
  perspective: 1000px;
  transition: transform 0.4s cubic-bezier(0.23, 1, 0.32, 1);
}

.depth-card:hover {
  transform: translateY(-8px) rotateX(2deg);
  box-shadow: 
    0 30px 60px rgba(0, 0, 0, 0.5),
    0 15px 25px rgba(196, 176, 1, 0.1);
}
```

---

## 3. Tipografía Premium

### Fuentes
```css
/* Importar en layout.tsx */
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&display=swap');

body {
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'SF Pro Display', sans-serif;
  font-feature-settings: 'cv02', 'cv03', 'cv04', 'cv11';
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}
```

### Escala Tipográfica
```css
/* Títulos - Peso bold, tracking amplio */
.heading-hero { font-size: 4rem; font-weight: 800; letter-spacing: -0.02em; line-height: 1.1; }
.heading-1 { font-size: 3rem; font-weight: 700; letter-spacing: -0.02em; }
.heading-2 { font-size: 2rem; font-weight: 600; letter-spacing: -0.01em; }
.heading-3 { font-size: 1.5rem; font-weight: 600; }

/* Cuerpo */
.body-large { font-size: 1.125rem; line-height: 1.7; }
.body-base { font-size: 1rem; line-height: 1.6; }
.body-small { font-size: 0.875rem; line-height: 1.5; }

/* Labels */
.label { font-size: 0.75rem; font-weight: 600; letter-spacing: 0.05em; text-transform: uppercase; }
```

---

## 4. Botones Premium

### CTA Principal (Buddha Gold)
```css
.btn-premium {
  background: linear-gradient(135deg, var(--buddha-gold) 0%, var(--buddha-gold-dark) 100%);
  color: var(--cod-gray);
  font-weight: 600;
  padding: 1rem 2rem;
  border-radius: 14px;
  border: none;
  box-shadow: 
    0 4px 20px rgba(196, 176, 1, 0.3),
    inset 0 1px 0 rgba(255, 255, 255, 0.2);
  transition: all 0.3s cubic-bezier(0.23, 1, 0.32, 1);
}

.btn-premium:hover {
  transform: translateY(-2px);
  box-shadow: 
    0 8px 30px rgba(196, 176, 1, 0.4),
    inset 0 1px 0 rgba(255, 255, 255, 0.3);
}
```

### Botón Secundario (Glass)
```css
.btn-glass {
  background: rgba(255, 255, 255, 0.05);
  backdrop-filter: blur(10px);
  color: var(--text-primary);
  border: 1px solid rgba(255, 255, 255, 0.1);
  padding: 1rem 2rem;
  border-radius: 14px;
  transition: all 0.3s ease;
}

.btn-glass:hover {
  background: rgba(255, 255, 255, 0.1);
  border-color: rgba(255, 255, 255, 0.2);
}
```

---

## 5. Animaciones y Micro-interacciones

### Framer Motion Presets
```typescript
// lib/animations/presets.ts
export const fadeInUp = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.5, ease: [0.23, 1, 0.32, 1] }
};

export const scaleIn = {
  initial: { opacity: 0, scale: 0.95 },
  animate: { opacity: 1, scale: 1 },
  transition: { duration: 0.4, ease: [0.23, 1, 0.32, 1] }
};

export const staggerContainer = {
  animate: { transition: { staggerChildren: 0.1 } }
};

export const glowPulse = {
  animate: {
    boxShadow: [
      '0 0 20px rgba(196, 176, 1, 0.2)',
      '0 0 40px rgba(196, 176, 1, 0.4)',
      '0 0 20px rgba(196, 176, 1, 0.2)'
    ],
    transition: { duration: 2, repeat: Infinity }
  }
};
```

---

## 6. Componentes Especiales

### Badge de Garantía
```tsx
// Para productos con garantía extendida
<span className="inline-flex items-center gap-1.5 px-3 py-1 bg-buddha-gold/10 
  border border-buddha-gold/30 rounded-full text-buddha-gold text-sm font-medium">
  <ShieldCheck className="w-4 h-4" />
  Garantía Premium
</span>
```

### Indicador de Estado (SAT)
```tsx
const STATUS_STYLES = {
  recepcion: 'bg-blue-500/20 text-blue-400 border-blue-500/30',
  diagnostico: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30',
  en_mesa: 'bg-purple-500/20 text-purple-400 border-purple-500/30',
  listo: 'bg-green-500/20 text-green-400 border-green-500/30',
  entregado: 'bg-gray-500/20 text-gray-400 border-gray-500/30'
};
```

---

## 7. Reglas Inquebrantables

1. ❌ **NUNCA** usar colores planos genéricos (red, blue, green puro)
2. ❌ **NUNCA** usar fondos blancos o grises claros
3. ✅ **SIEMPRE** aplicar blur mínimo de 10px en elementos glass
4. ✅ **SIEMPRE** usar sombras con offset Y positivo para profundidad
5. ✅ **SIEMPRE** aplicar `antialiased` a toda la tipografía
6. ✅ **SIEMPRE** usar transiciones con easing custom (no linear)
