---
name: SAT Repair Workflow
description: Motor lógico para gestión del ciclo de vida completo de reparaciones
---

# 🔧 SAT Repair Workflow - Gestión de Reparaciones

## Propósito
Manejar la lógica compleja del Servicio de Asistencia Técnica (SAT), incluyendo estados, transiciones, notificaciones y reglas de negocio específicas de reparación de dispositivos.

## Cuándo Activar
- Al crear/modificar tickets de reparación
- Al implementar flujos de estado
- Al diseñar UI de seguimiento
- Al configurar notificaciones automáticas
- Al generar reportes SAT

## Estados del Ticket

```typescript
type TicketStatus = 
  | 'ingresado'      // Recién registrado, esperando diagnóstico
  | 'diagnosticado'  // Diagnóstico completo, esperando aprobación
  | 'aprobado'       // Cliente aprobó presupuesto
  | 'en_reparacion'  // Técnico trabajando
  | 'en_espera'      // Esperando repuesto/cliente
  | 'listo'          // Reparación completa
  | 'entregado'      // Cliente retiró equipo
  | 'rechazado'      // Cliente rechazó presupuesto
  | 'sin_reparacion' // No reparable o no vale la pena

const TICKET_STATUS_CONFIG: Record<TicketStatus, StatusConfig> = {
  ingresado: {
    label: 'Ingresado',
    color: 'blue',
    icon: 'Inbox',
    nextStates: ['diagnosticado', 'sin_reparacion'],
    notification: false
  },
  diagnosticado: {
    label: 'Diagnóstico Listo',
    color: 'yellow',
    icon: 'Search',
    nextStates: ['aprobado', 'rechazado', 'sin_reparacion'],
    notification: true, // Notificar al cliente
    notificationTemplate: 'diagnostico_listo'
  },
  aprobado: {
    label: 'Aprobado',
    color: 'green',
    icon: 'CheckCircle',
    nextStates: ['en_reparacion', 'en_espera'],
    notification: false
  },
  en_reparacion: {
    label: 'En Reparación',
    color: 'orange',
    icon: 'Wrench',
    nextStates: ['listo', 'en_espera'],
    notification: false
  },
  en_espera: {
    label: 'En Espera',
    color: 'gray',
    icon: 'Clock',
    nextStates: ['en_reparacion', 'listo'],
    notification: true,
    notificationTemplate: 'en_espera_repuesto'
  },
  listo: {
    label: 'Listo para Retirar',
    color: 'green',
    icon: 'Package',
    nextStates: ['entregado'],
    notification: true,
    notificationTemplate: 'listo_para_retiro'
  },
  entregado: {
    label: 'Entregado',
    color: 'emerald',
    icon: 'Check',
    nextStates: [], // Final state
    notification: false
  },
  rechazado: {
    label: 'Rechazado',
    color: 'red',
    icon: 'X',
    nextStates: ['entregado'], // Puede retirar sin reparar
    notification: false
  },
  sin_reparacion: {
    label: 'Sin Reparación',
    color: 'gray',
    icon: 'Ban',
    nextStates: ['entregado'],
    notification: true,
    notificationTemplate: 'sin_reparacion'
  }
}
```

## Diagrama de Estados

```
                    ┌─────────────────┐
                    │   INGRESADO     │
                    └────────┬────────┘
                             │
                             ▼
                    ┌─────────────────┐
              ┌────►│  DIAGNOSTICADO  │◄────┐
              │     └────────┬────────┘     │
              │              │              │
              │     ┌────────┼────────┐     │
              │     ▼        ▼        ▼     │
         ┌────┴───┐    ┌─────┴─────┐    ┌───┴────┐
         │RECHAZADO│    │  APROBADO │    │SIN REP.│
         └────┬───┘    └─────┬─────┘    └───┬────┘
              │              │              │
              │              ▼              │
              │     ┌─────────────────┐     │
              │     │ EN_REPARACION  │◄────┤
              │     └────────┬────────┘     │
              │              │              │
              │     ┌────────┼────────┐     │
              │     ▼        │        ▼     │
              │  ┌──────┐    │    ┌────────┐│
              │  │ESPERA│────┘    │ LISTO  ││
              │  └──────┘         └───┬────┘│
              │                       │     │
              │                       ▼     │
              │              ┌─────────────────┐
              └─────────────►│   ENTREGADO     │
                             └─────────────────┘
```

## Plantillas de Notificación (WhatsApp)

```typescript
const NOTIFICATION_TEMPLATES = {
  diagnostico_listo: `
🔍 *Diagnóstico Listo*

Hola {{cliente_nombre}}!

Tu {{dispositivo}} ya fue diagnosticado:

📋 *Problema:* {{diagnostico}}
💰 *Presupuesto:* {{presupuesto}} UYU
⏰ *Tiempo estimado:* {{tiempo_estimado}}

👉 Respondé *APROBAR* para confirmar o *RECHAZAR* si preferís retirarlo sin reparar.

Smart Point - Servicio Técnico Premium
📍 Maldonado, Uruguay
  `,
  
  listo_para_retiro: `
✅ *¡Tu equipo está listo!*

Hola {{cliente_nombre}}!

Tu {{dispositivo}} ya está reparado y listo para retirar.

🎫 Ticket: #{{numero_ticket}}
📍 Dirección: {{direccion_local}}
🕐 Horario: Lun-Vie 9-19hs | Sáb 10-14hs

Recordá traer tu comprobante de ingreso.

Smart Point 🔴
  `,
  
  en_espera_repuesto: `
⏳ *Actualización de tu reparación*

Hola {{cliente_nombre}}!

Tu {{dispositivo}} está en espera por:
📦 {{motivo_espera}}

Te avisamos apenas continúe la reparación.

Smart Point - Servicio Técnico Premium
  `,
  
  sin_reparacion: `
ℹ️ *Información sobre tu equipo*

Hola {{cliente_nombre}}!

Lamentablemente tu {{dispositivo}} no pudo ser reparado:
❌ {{motivo}}

Podés pasar a retirarlo en nuestro local.

Smart Point - Servicio Técnico Premium
  `
}
```

## Reglas de Negocio

### 1. Tiempos de Respuesta
```typescript
const SLA = {
  diagnostico: 24, // horas máximo
  reparacion_simple: 48, // horas
  reparacion_compleja: 72, // horas
  espera_repuesto: 7, // días máximo antes de notificar
  retiro_post_listo: 30 // días antes de cobrar almacenamiento
}
```

### 2. Precios Base
```typescript
const PRECIOS_DIAGNOSTICO = {
  celular: 300,
  tablet: 400,
  notebook: 500,
  otro: 350
}

// El diagnóstico se descuenta si se aprueba reparación
const DESCUENTO_DIAGNOSTICO = true
```

### 3. Garantía
```typescript
const GARANTIA = {
  pantalla: 90, // días
  bateria: 90,
  carga: 30,
  software: 7,
  otro: 30
}
```

## Componentes UI Requeridos

### Badge de Estado
```tsx
function StatusBadge({ status }: { status: TicketStatus }) {
  const config = TICKET_STATUS_CONFIG[status]
  const colorClass = {
    blue: 'bg-blue-500/10 text-blue-400 border-blue-500/30',
    yellow: 'bg-yellow-500/10 text-yellow-400 border-yellow-500/30',
    green: 'bg-green-500/10 text-green-400 border-green-500/30',
    orange: 'bg-orange-500/10 text-orange-400 border-orange-500/30',
    red: 'bg-red-500/10 text-red-400 border-red-500/30',
    gray: 'bg-gray-500/10 text-gray-400 border-gray-500/30',
    emerald: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30',
  }[config.color]
  
  return (
    <span className={`px-3 py-1 rounded-full text-sm border ${colorClass}`}>
      {config.label}
    </span>
  )
}
```

## Checklist de Validación
- [ ] Estados siguen diagrama de flujo
- [ ] Transiciones validadas antes de ejecutar
- [ ] Notificaciones enviadas en estados correctos
- [ ] SLA monitoreado y alertado
- [ ] Historial de cambios registrado
- [ ] Garantía calculada según tipo de reparación
