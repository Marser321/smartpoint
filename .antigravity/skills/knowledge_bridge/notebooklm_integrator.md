---
name: NotebookLM Integrator
description: Bridge Skill para estandarizar la ingesta de documentos técnicos y análisis de negocio procesados por Google NotebookLM.
version: 1.0.0
author: Antigravity Architect
triggers:
  - user_request: "Procesa el reporte de NotebookLM"
  - file_change: "knowledge/notebooklm_exports/*.md"
---

# NotebookLM Knowledge Bridge

Esta skill permite al agente Antigravity ingerir, analizar y ejecutar insights derivados de Google NotebookLM.

## 🎯 Objetivo
Transformar el conocimiento no estructurado (resúmenes de papers, análisis de mercado, grabaciones de reuniones procesadas) en tareas técnicas accionables y decisiones de arquitectura documentadas.

## 📂 Estructura de Ingesta
Los reportes exportados de NotebookLM deben depositarse en:
`knowledge/notebooklm_exports/`

Formatos soportados:
- `.md` (Markdown) - Preferido
- `.txt` (Texto plano)

## 🧠 Proceso de Ingesta (Workflow)

Cuando se solicite procesar un documento de NotebookLM, el agente debe seguir estos pasos:

1.  **Lectura y Contextualización**:
    - Leer el archivo completo utilizando `view_file`.
    - Identificar el tipo de documento (Análisis de Mercado, Especificación Técnica, Regla de Negocio).

2.  **Extracción de Entidades**:
    - **Decisiones de Arquitectura**: Si el documento sugiere un cambio estructural (ej: *Migrar a Clean Architecture*), debe registrarse en `architecture.md` o crear un ADR (Architecture Decision Record).
    - **Reglas de Negocio**: Si define lógica (ej: *Cálculo de comisiones varía por región*), debe documentarse en `business_rules.md` (si existe) o como comentario en el código relevante.
    - **Tareas Técnicas**: Si implica trabajo de desarrollo (ej: *Implementar caché en Redis*), debe añadirse al `task.md`.

3.  **Actualización del Plan**:
    - Si el insight contradice el `implementation_plan.md` actual, el agente debe detenerse y solicitar confirmación al usuario antes de proceder, resaltando el conflicto.

4.  **Confirmación de Procesamiento**:
    - Mover el archivo procesado a `knowledge/notebooklm_exports/processed/` (crear carpeta si no existe) para evitar re-procesamiento, o marcarlo internamente.
    - Generar un resumen de las acciones tomadas para el usuario.

## 📝 Plantilla de Reporte de NotebookLM (Recomendada)

Para mejores resultados, instruye a NotebookLM para que genere salidas con esta estructura:

```markdown
# [Título del Análisis]
**Fecha:** YYYY-MM-DD
**Fuente:** [Nombre del Paper/Reunión]

## Resumen Ejecutivo
[Breve descripción de 2-3 líneas]

## Hallazgos Clave
- [Insight 1]
- [Insight 2]

## Recomendaciones para SmartPoint
1. [Acción Recomendada 1]
2. [Acción Recomendada 2]

## Fragmentos de Código Sugeridos (Opcional)
```
