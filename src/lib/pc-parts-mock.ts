import { Producto } from '@/types/ecommerce'

// Tipos auxiliares para el mapeo (extraídos de BuildContext)
type ComponentCategory = 'cpu' | 'gpu' | 'ram' | 'storage' | 'psu' | 'motherboard' | 'case' | 'cooling' | 'cables' | 'os'

const RAW_PARTS = {
    cpu: [
        { id: '1', sku: 'CPU-R7', nombre: 'AMD Ryzen 7 7800X3D', categoria: 'cpu', marca: 'AMD', specs: { tdp: 120 }, precio_venta: 18500, stock_actual: 5, bajo_pedido: false, oferta_activa: true, color_palette: ['stealth_black'], tier: 'high-end' },
        { id: '2', sku: 'CPU-R5', nombre: 'AMD Ryzen 5 7600X', categoria: 'cpu', marca: 'AMD', specs: { tdp: 105 }, precio_venta: 9800, stock_actual: 8, bajo_pedido: false, oferta_activa: false, color_palette: ['stealth_black'], tier: 'midrange' },
        { id: 'cpu-3', sku: 'CPU-I7', nombre: 'Intel Core i7-14700K', categoria: 'cpu', marca: 'Intel', specs: { tdp: 125 }, precio_venta: 16500, stock_actual: 3, bajo_pedido: false, oferta_activa: false, color_palette: ['stealth_black'], tier: 'high-end' },
    ],
    gpu: [
        { id: '3', sku: 'GPU-4090', nombre: 'NVIDIA GeForce RTX 4090', categoria: 'gpu', marca: 'NVIDIA', specs: { tdp: 450 }, precio_venta: 85000, stock_actual: 2, bajo_pedido: false, oferta_activa: true, color_palette: ['stealth_black'], tier: 'enthusiast' },
        { id: '4', sku: 'GPU-4070', nombre: 'NVIDIA GeForce RTX 4070 Ti', categoria: 'gpu', marca: 'NVIDIA', specs: { tdp: 285 }, precio_venta: 42000, stock_actual: 4, bajo_pedido: false, oferta_activa: false, color_palette: ['stealth_black'], tier: 'high-end' },
        { id: 'gpu-3', sku: 'GPU-7900', nombre: 'AMD Radeon RX 7900 XTX', categoria: 'gpu', marca: 'AMD', specs: { tdp: 355 }, precio_venta: 48000, stock_actual: 2, bajo_pedido: false, oferta_activa: false, color_palette: ['stealth_black'], tier: 'enthusiast' },
    ],
    motherboard: [
        { id: '5', sku: 'MB-X670', nombre: 'ASUS ROG X670E Hero', categoria: 'motherboard', marca: 'ASUS', specs: { socket: 'AM5' }, precio_venta: 22000, stock_actual: 2, bajo_pedido: false, oferta_activa: false, color_palette: ['stealth_black'], tier: 'enthusiast' },
        { id: 'mb-2', sku: 'MB-B650', nombre: 'MSI MAG B650 Tomahawk', categoria: 'motherboard', marca: 'MSI', specs: { socket: 'AM5' }, precio_venta: 12500, stock_actual: 4, bajo_pedido: false, oferta_activa: true, color_palette: ['stealth_black'], tier: 'high-end' },
    ],
    ram: [
        { id: '6', sku: 'RAM-32', nombre: 'Corsair Vengeance DDR5-6000 32GB', categoria: 'ram', marca: 'Corsair', specs: {}, precio_venta: 6500, stock_actual: 12, bajo_pedido: false, oferta_activa: false, color_palette: ['stealth_black'], tier: 'high-end' },
        { id: 'ram-2', sku: 'RAM-64', nombre: 'G.Skill Trident Z5 DDR5-6400 64GB', categoria: 'ram', marca: 'G.Skill', specs: {}, precio_venta: 14500, stock_actual: 3, bajo_pedido: false, oferta_activa: true, color_palette: ['stealth_black'], tier: 'enthusiast' },
    ],
    case: [
        { id: '7', sku: 'CASE-O11', nombre: 'Lian Li O11 Dynamic EVO', categoria: 'case', marca: 'Lian Li', specs: { max_gpu_length: 420 }, precio_venta: 7200, stock_actual: 4, bajo_pedido: false, oferta_activa: false, color_palette: ['stealth_black'], tier: 'high-end' },
        { id: 'case-2', sku: 'CASE-H9', nombre: 'NZXT H9 Elite', categoria: 'case', marca: 'NZXT', specs: { max_gpu_length: 435 }, precio_venta: 9800, stock_actual: 2, bajo_pedido: false, oferta_activa: true, color_palette: ['stealth_black'], tier: 'enthusiast' },
    ],
    psu: [
        { id: '8', sku: 'PSU-1000', nombre: 'Corsair RM1000x', categoria: 'psu', marca: 'Corsair', specs: { watts: 1000 }, precio_venta: 8500, stock_actual: 6, bajo_pedido: false, oferta_activa: false, color_palette: ['stealth_black'], tier: 'high-end' },
        { id: 'psu-2', sku: 'PSU-1200', nombre: 'EVGA SuperNOVA 1200 P3', categoria: 'psu', marca: 'EVGA', specs: { watts: 1200 }, precio_venta: 12000, stock_actual: 3, bajo_pedido: false, oferta_activa: false, color_palette: ['stealth_black'], tier: 'enthusiast' },
    ],
    storage: [
        { id: '9', sku: 'SSD-2TB', nombre: 'Samsung 990 PRO 2TB NVMe', categoria: 'storage', marca: 'Samsung', specs: {}, precio_venta: 9800, stock_actual: 8, bajo_pedido: false, oferta_activa: false, color_palette: ['stealth_black'], tier: 'high-end' },
        { id: 'ssd-2', sku: 'SSD-4TB', nombre: 'WD Black SN850X 4TB', categoria: 'storage', marca: 'WD', specs: {}, precio_venta: 18500, stock_actual: 2, bajo_pedido: false, oferta_activa: true, color_palette: ['stealth_black'], tier: 'enthusiast' },
    ],
    cooling: [
        { id: '10', sku: 'COOL-360', nombre: 'NZXT Kraken Z73', categoria: 'cooling', marca: 'NZXT', specs: { type: 'AIO' }, precio_venta: 12500, stock_actual: 5, bajo_pedido: false, oferta_activa: false, color_palette: ['stealth_black'], tier: 'high-end' },
        { id: 'cool-2', sku: 'COOL-NH', nombre: 'Noctua NH-D15', categoria: 'cooling', marca: 'Noctua', specs: { type: 'Air', height: 165 }, precio_venta: 5200, stock_actual: 8, bajo_pedido: false, oferta_activa: false, color_palette: ['stealth_black'], tier: 'high-end' },
    ],
    os: [
        { id: '11', sku: 'WIN-PRO', nombre: 'Windows 11 Pro', categoria: 'os', marca: 'Microsoft', specs: {}, precio_venta: 1200, stock_actual: 50, bajo_pedido: false, oferta_activa: false, color_palette: ['stealth_black'], tier: 'midrange' },
    ],
}

// Mapear a Producto[]
export const PC_PARTS_MOCK: Producto[] = Object.values(RAW_PARTS).flat().map((part: any) => ({
    id: part.id,
    sku: part.sku,
    nombre: part.nombre,
    descripcion: `Componente de hardware premium: ${part.nombre}. Diseñado para alto rendimiento y durabilidad.`,
    tipo: part.categoria,
    marca: part.marca,
    marca_compatible: ['PC Desktop', 'Workstation', 'Gaming Rig'],
    precio_venta: part.precio_venta,
    precio_anterior: part.oferta_activa ? Math.round(part.precio_venta * 1.15) : undefined,
    moneda: 'UYU',
    stock_actual: part.stock_actual,
    stock_critico: 2,
    es_repuesto: false,
    es_venta: true,
    imagen_url: part.img || `/components/${part.categoria}.png`, // Ajustar paths si es necesario
    imagenes_adicionales: [],
    activo: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
}))
