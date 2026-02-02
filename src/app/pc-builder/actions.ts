'use server'

import { createClient } from '@/lib/supabase/server'
import { HardwareComponent, ComponentCategory } from './context/BuildContext'

export async function getBuilderProducts(): Promise<Record<ComponentCategory, HardwareComponent[]> | null> {
    const supabase = await createClient()

    // Obtener productos de tipos específicos de PC
    const { data, error } = await supabase
        .from('inventario')
        .select('*')
        .eq('activo', true)
        .in('tipo', [
            'cpu', 'gpu', 'motherboard', 'ram', 'case',
            'psu', 'storage', 'cooling', 'os', 'cables'
        ])

    if (error) {
        console.error('Error fetching builder products:', error)
        return null
    }

    if (!data || data.length === 0) {
        return null
    }

    // Agrupar productos por categoría
    const grouped: Partial<Record<ComponentCategory, HardwareComponent[]>> = {}

    data.forEach((item) => {
        const type = item.tipo as ComponentCategory

        // Inicializar array si no existe
        if (!grouped[type]) {
            grouped[type] = []
        }

        // Mapear DB item a HardwareComponent
        // Nota: Specs, tier y color_palette son hardcoded por ahora ya que no están en DB aún
        grouped[type]!.push({
            id: item.id,
            sku: item.sku,
            nombre: item.nombre,
            categoria: type,
            marca: item.marca,
            specs: {
                detalles: item.descripcion
            },
            precio_venta: Number(item.precio_venta),
            stock_actual: item.stock_actual,
            bajo_pedido: item.stock_actual <= 0,
            oferta_activa: false,
            color_palette: ['stealth_black'],
            tier: 'high-end',
            imagen_url: item.imagen_url || undefined
        })
    })

    return grouped as Record<ComponentCategory, HardwareComponent[]>
}
