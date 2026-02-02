---
name: Skill Creator
description: Meta-habilidad para generar nuevas habilidades de forma estructurada
---

# 🧬 Skill Creator - La Habilidad Madre

## Propósito
Permitir la creación automática de nuevas habilidades para el sistema SmartPoint.uy siguiendo un formato consistente y reutilizable.

## Estructura de un Skill

```markdown
---
name: [Nombre del Skill]
description: [Descripción breve de una línea]
---

# [Emoji] [Nombre] - [Subtítulo]

## Propósito
[¿Qué problema resuelve este skill?]

## Cuándo Activar
[Condiciones o triggers para usar este skill]

## Reglas y Directivas
[Lista numerada de reglas específicas]

## Patrones de Código
[Ejemplos de código que este skill debe generar]

## Anti-Patrones
[Qué NO hacer cuando se aplica este skill]

## Checklist de Validación
[Items para verificar que el skill se aplicó correctamente]
```

## Proceso de Creación

1. **Identificar Necesidad**: ¿Qué tarea repetitiva se puede automatizar?
2. **Definir Alcance**: ¿Cuáles son los límites de este skill?
3. **Documentar Reglas**: Escribir reglas claras y específicas
4. **Agregar Ejemplos**: Incluir código de referencia
5. **Validar**: Crear checklist de verificación

## Ejemplo de Uso

Para crear un nuevo skill:
```
Invocar: skill_creator
Input: { nombre: "payment-integration", propósito: "Integrar pasarelas de pago Uruguay" }
Output: Archivo .agent/skills/payment_integration.md creado
```

## Checklist de Validación
- [ ] El skill tiene frontmatter YAML válido
- [ ] Contiene sección "Cuándo Activar"
- [ ] Incluye ejemplos de código
- [ ] Define anti-patrones
- [ ] Tiene checklist de validación propio
