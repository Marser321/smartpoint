/**
 * Tipos para el Sistema SAT (Servicio de Asistencia Técnica)
 * Basado en sat_logic_engine.md
 */

// Estados del ticket de reparación
export type TicketStatus =
    | 'recepcion'       // Equipo ingresado, pendiente diagnóstico
    | 'diagnostico'     // Técnico evaluando falla
    | 'espera_repuesto' // Aguardando pieza de inventario/proveedor
    | 'en_mesa'         // En reparación activa
    | 'listo'           // Reparado, esperando retiro
    | 'entregado'       // Cliente retiró el equipo
    | 'rechazado'       // Cliente rechazó presupuesto

export type TicketPriority = 'normal' | 'urgente'

// Marcas comunes de dispositivos
export const DEVICE_BRANDS = [
    'Apple',
    'Samsung',
    'Xiaomi',
    'Motorola',
    'Huawei',
    'OnePlus',
    'Google',
    'LG',
    'Sony',
    'Otro'
] as const

export type DeviceBrand = typeof DEVICE_BRANDS[number]

// Tipos de fallas comunes
export const COMMON_ISSUES = [
    { id: 'pantalla_rota', label: 'Pantalla rota o rayada', category: 'pantalla' },
    { id: 'pantalla_manchas', label: 'Manchas en pantalla', category: 'pantalla' },
    { id: 'touch_no_funciona', label: 'Touch no responde', category: 'pantalla' },
    { id: 'bateria_agotada', label: 'Batería se agota rápido', category: 'bateria' },
    { id: 'bateria_hinchada', label: 'Batería hinchada', category: 'bateria' },
    { id: 'no_carga', label: 'No carga', category: 'carga' },
    { id: 'carga_lenta', label: 'Carga muy lento', category: 'carga' },
    { id: 'puerto_flojo', label: 'Puerto de carga flojo', category: 'carga' },
    { id: 'no_enciende', label: 'No enciende', category: 'encendido' },
    { id: 'reinicia_solo', label: 'Se reinicia solo', category: 'software' },
    { id: 'lento', label: 'Muy lento', category: 'software' },
    { id: 'camara_borrosa', label: 'Cámara borrosa', category: 'camara' },
    { id: 'camara_no_funciona', label: 'Cámara no funciona', category: 'camara' },
    { id: 'altavoz_no_suena', label: 'Altavoz no suena', category: 'audio' },
    { id: 'microfono_no_funciona', label: 'Micrófono no funciona', category: 'audio' },
    { id: 'mojado', label: 'Daño por agua/líquido', category: 'agua' },
    { id: 'otro', label: 'Otro problema', category: 'otro' }
] as const

// Interface para ticket de reparación
export interface TicketReparacion {
    id: string
    numero_ticket: string
    cliente_id: string | null

    // Dispositivo
    marca: string
    modelo: string
    imei?: string
    color?: string
    patron_desbloqueo_encrypted?: string

    // Reparación
    falla_reportada: string
    diagnostico?: string
    presupuesto?: number
    presupuesto_aceptado?: boolean
    costo_repuestos?: number
    costo_mano_obra?: number

    // Estado
    estado: TicketStatus
    prioridad: TicketPriority

    // Media
    fotos_ingreso: string[]
    fotos_reparacion: string[]
    firma_cliente?: string

    // Asignación
    tecnico_id?: string

    // Timestamps
    fecha_ingreso: string
    fecha_diagnostico?: string
    fecha_listo?: string
    fecha_entrega?: string
    updated_at: string
}

// Interface para cliente
export interface Cliente {
    id: string
    nombre: string
    email?: string
    telefono: string
    whatsapp?: string
    direccion?: {
        street?: string
        number?: string
        parada?: number
        zone?: string
        department?: string
    }
    dispositivos_registrados?: Array<{
        marca: string
        modelo: string
    }>
    notas?: string
    created_at: string
    updated_at: string
}

// Interface para formulario de solicitud
export interface SolicitudReparacionForm {
    // Datos del cliente
    nombre: string
    telefono: string
    email?: string

    // Dispositivo
    marca: string
    modelo: string
    color?: string

    // Problema
    falla_id: string
    descripcion_adicional?: string

    // Prioridad
    es_urgente: boolean
    es_mojado: boolean
}

// Estados con metadata para UI
export const STATUS_CONFIG: Record<TicketStatus, {
    label: string
    description: string
    color: string
    bgClass: string
    icon: string
}> = {
    recepcion: {
        label: 'Recepción',
        description: 'Tu equipo fue recibido y está esperando diagnóstico',
        color: '#3B82F6',
        bgClass: 'status-recepcion',
        icon: 'inbox'
    },
    diagnostico: {
        label: 'En Diagnóstico',
        description: 'Un técnico está evaluando tu equipo',
        color: '#F59E0B',
        bgClass: 'status-diagnostico',
        icon: 'search'
    },
    espera_repuesto: {
        label: 'Esperando Repuesto',
        description: 'Estamos esperando la llegada del repuesto necesario',
        color: '#A855F7',
        bgClass: 'status-espera-repuesto',
        icon: 'package'
    },
    en_mesa: {
        label: 'En Reparación',
        description: 'Tu equipo está siendo reparado',
        color: '#8B5CF6',
        bgClass: 'status-en-mesa',
        icon: 'wrench'
    },
    listo: {
        label: '¡Listo para Retirar!',
        description: 'Tu equipo está reparado y te espera',
        color: '#22C55E',
        bgClass: 'status-listo',
        icon: 'check-circle'
    },
    entregado: {
        label: 'Entregado',
        description: 'Equipo entregado al cliente',
        color: '#6B7280',
        bgClass: 'status-entregado',
        icon: 'check'
    },
    rechazado: {
        label: 'Rechazado',
        description: 'El cliente rechazó el presupuesto',
        color: '#EF4444',
        bgClass: 'status-rechazado',
        icon: 'x-circle'
    }
}
