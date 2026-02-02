---
name: Luxury Glass UI
description: Sistema de diseño premium con glassmorphism agresivo estilo Apple - Valoración $25k+
---

# 💎 Luxury Glass UI - El Diseño de $25k

## Propósito
Garantizar que cada componente tenga la estética Apple/Glassmorphism premium que diferencia SmartPoint de la competencia. Esto NO es CSS básico - es diseño de alta gama.

## Cuándo Activar
- Al crear CUALQUIER componente visual
- Al diseñar layouts o páginas
- Al implementar animaciones o transiciones
- Al definir estados de hover/focus/active

## Reglas y Directivas

### 1. Paleta de Colores (Smart Point Red)
```css
:root {
  /* Color Primario - Smart Point Red */
  --sp-red: #C41E3A;
  --sp-red-light: #DC2F4A;
  --sp-red-dark: #A41830;
  --sp-red-10: rgba(196, 30, 58, 0.1);
  --sp-red-20: rgba(196, 30, 58, 0.2);
  --sp-red-30: rgba(196, 30, 58, 0.3);

  /* Fondos Oscuros Premium */
  --cod-gray: #0A0A0A;
  --cod-gray-light: #141414;
  --cod-gray-lighter: #1A1A1A;

  /* Glassmorphism */
  --glass-bg: rgba(255, 255, 255, 0.04);
  --glass-border: rgba(255, 255, 255, 0.1);
  --glass-shadow: 0 8px 32px rgba(0, 0, 0, 0.5);

  /* Glow Effects */
  --glow-red: 0 0 20px rgba(196, 30, 58, 0.3), 0 0 40px rgba(196, 30, 58, 0.15);
}
```

### 2. Glassmorphism Obligatorio
```css
.glass-card {
  background: rgba(255, 255, 255, 0.04);
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 24px;
  box-shadow:
    0 8px 32px rgba(0, 0, 0, 0.5),
    inset 0 1px 0 rgba(255, 255, 255, 0.1);
}

.glass-card:hover {
  background: rgba(255, 255, 255, 0.08);
  border-color: rgba(255, 255, 255, 0.15);
  transform: translateY(-4px);
  box-shadow:
    0 20px 60px rgba(0, 0, 0, 0.6),
    var(--glow-red);
}
```

### 3. Botones Premium
```tsx
// Botón Primario con Gradiente y Glow
<button className="
  px-6 py-3 
  bg-gradient-to-r from-[var(--sp-red)] to-[var(--sp-red-dark)]
  text-white font-semibold
  rounded-xl
  shadow-lg shadow-[var(--sp-red-30)]
  hover:shadow-[var(--glow-red)]
  hover:-translate-y-0.5
  transition-all duration-300
  active:scale-95
">
  Acción Premium
</button>

// Botón Glass Secundario
<button className="
  px-6 py-3
  bg-white/5
  backdrop-blur-xl
  border border-white/10
  text-white
  rounded-xl
  hover:bg-white/10
  hover:border-white/20
  transition-all duration-300
">
  Acción Secundaria
</button>
```

### 4. Animaciones Obligatorias (Framer Motion)
```tsx
// Fade + Slide para elementos que entran
<motion.div
  initial={{ opacity: 0, y: 20 }}
  animate={{ opacity: 1, y: 0 }}
  transition={{ 
    duration: 0.5, 
    ease: [0.23, 1, 0.32, 1] // Apple easing
  }}
>

// Hover con escala sutil
<motion.div
  whileHover={{ scale: 1.02 }}
  whileTap={{ scale: 0.98 }}
  transition={{ type: "spring", stiffness: 400, damping: 17 }}
>

// Stagger para listas
{items.map((item, i) => (
  <motion.div
    key={item.id}
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay: i * 0.05 }}
  />
))}
```

### 5. Typography Premium
```css
/* Headlines - Bold y Tight */
.heading-hero {
  font-size: clamp(2.5rem, 8vw, 4.5rem);
  font-weight: 800;
  letter-spacing: -0.02em;
  line-height: 1.1;
}

/* Gradiente de texto para énfasis */
.text-gradient-red {
  background: linear-gradient(135deg, var(--sp-red) 0%, var(--sp-red-light) 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}
```

### 6. Inputs Premium
```tsx
<input className="
  w-full px-4 py-3
  bg-white/5
  border border-white/10
  rounded-xl
  text-white
  placeholder:text-white/30
  focus:outline-none
  focus:ring-2 focus:ring-[var(--sp-red-30)]
  focus:border-[var(--sp-red)]
  focus:bg-white/8
  transition-all duration-300
"/>
```

### 7. Cards con Hover State Premium
```tsx
<motion.div
  className="
    glass-card p-6
    cursor-pointer
    group
  "
  whileHover={{ y: -8 }}
>
  {/* Glow overlay on hover */}
  <div className="
    absolute inset-0 
    rounded-2xl 
    opacity-0 group-hover:opacity-100 
    transition-opacity duration-500
    pointer-events-none
  " 
    style={{ boxShadow: 'var(--glow-red)' }}
  />
  
  {/* Content */}
  <div className="relative z-10">
    {/* ... */}
  </div>
</motion.div>
```

## Anti-Patrones (PROHIBIDO)
- ❌ Bordes sólidos sin transparencia
- ❌ Fondos planos sin blur
- ❌ Transiciones menores a 200ms
- ❌ Colores primarios sin variantes (solo usar variables)
- ❌ Box-shadow básicos sin glow
- ❌ Componentes sin animación de entrada
- ❌ Hovers sin cambio visual significativo
- ❌ Border-radius menores a 12px
- ❌ Tipografía sin letter-spacing ajustado

## Checklist de Validación
- [ ] Todos los cards usan backdrop-blur
- [ ] Bordes tienen rgba con opacidad
- [ ] Botones primarios tienen gradiente Y glow
- [ ] Hovers incluyen transform Y shadow change
- [ ] Animaciones usan easing Apple [0.23, 1, 0.32, 1]
- [ ] Inputs tienen focus ring con color primario
- [ ] Typography usa letter-spacing negativo en headings
- [ ] Transiciones son >= 200ms
