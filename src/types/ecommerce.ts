/**
 * Tipos para E-commerce
 */

export type ProductType =
    | 'pantalla'
    | 'bateria'
    | 'funda'
    | 'vidrio'
    | 'cargador'
    | 'cable'
    | 'auricular'
    | 'accesorio'
    | 'repuesto'
    | 'otro'

export type PaymentMethod = 'bamboo' | 'mercadopago' | 'efectivo' | 'transferencia'
export type PaymentStatus = 'pendiente' | 'procesando' | 'pagado' | 'fallido' | 'reembolsado'
export type ShippingType = 'retiro' | 'ues' | 'depunta' | 'uesgo'
export type ShippingStatus = 'preparando' | 'enviado' | 'en_camino' | 'entregado'

export interface Producto {
    id: string
    sku: string
    nombre: string
    descripcion?: string
    tipo: ProductType | string
    marca?: string
    marca_compatible?: string[]
    precio_compra?: number
    precio_costo?: number
    precio_venta: number
    precio_anterior?: number
    moneda?: 'UYU' | 'USD'
    stock_actual: number
    stock_critico: number
    es_repuesto: boolean
    es_venta: boolean
    imagen_url?: string
    imagenes_adicionales?: string[]
    activo: boolean
    created_at?: string
    updated_at?: string
}

export interface CartItem {
    producto: Producto
    cantidad: number
}

export interface Venta {
    id: string
    numero_orden: string
    cliente_id?: string
    ticket_reparacion_id?: string
    items: Array<{
        producto_id: string
        nombre: string
        cantidad: number
        precio_unitario: number
        subtotal: number
    }>
    subtotal: number
    descuento: number
    envio: number
    total: number
    moneda: 'UYU' | 'USD'
    metodo_pago?: PaymentMethod
    estado_pago: PaymentStatus
    pago_referencia?: string
    tipo_envio?: ShippingType
    direccion_envio?: {
        street?: string
        number?: string
        parada?: number
        zone?: string
        reference?: string
    }
    estado_envio: ShippingStatus
    tracking_number?: string
    notas?: string
    created_at: string
    updated_at: string
}
