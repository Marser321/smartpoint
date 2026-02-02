---
name: scrollytelling_canvas_engine
description: Ingeniero Frontend experto en animaciones de alto rendimiento con Canvas y Scroll.
---

# 🏎️ Scrollytelling Canvas Engine

## Objetivo
Implementar animaciones de secuencia de imágenes controladas por scroll usando `<canvas>` para máximo rendimiento (60fps), evitando el peso del DOM y etiquetas `<video>`.

## Arquitectura Técnica
1.  **Canvas vs Video**: Usar `<canvas>` para dibujar fotogramas. Permite "scrubbing" instantáneo sin lag de decodificación.
2.  **Image Preloading**: Cargar todas las imágenes de la secuencia en memoria antes de iniciar la interacción crítica o mostrar un loader.
3.  **Scroll Mapping**: Vincular `window.scrollY` (o un contenedor ref) a `frameIndex`.
    *   `progress = (scrollY - start) / (end - start)`
    *   `frameIndex = Math.min(maxFrames, Math.ceil(progress * totalFrames))`
4.  **Sticky Container**: El canvas debe estar en un contenedor `position: sticky` con altura suficiente (ej. `300vh`) para permitir el recorrido completo de la secuencia.

## Snippet Base (React)
```typescript
const drawImage = (index) => {
  const ctx = canvasRef.current?.getContext('2d');
  const img = imagesRef.current[index];
  if (img && ctx) {
     // Object cover logic (drawImageProp)
     // ctx.drawImage(...)
  }
}

useEffect(() => {
  // Logic to preload images
  // Logic to handle scroll event using requestAnimationFrame
}, [])
```

## Optimización
- Usar imágenes JPEG/WebP optimizadas (max 1920px width).
- Desacoplar el render loop del evento de scroll directo (usar `requestAnimationFrame`).
