'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useBuild, ComponentCategory, HardwareComponent, StylePalette } from '../context/BuildContext'
import { ChevronDown, Check, AlertTriangle, Package, Flame, Clock } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'

const CATEGORY_LABELS: Record<ComponentCategory, string> = {
    case: 'Gabinete',
    motherboard: 'Placa Madre',
    cpu: 'Procesador',
    cooling: 'Enfriamiento',
    gpu: 'Tarjeta Gráfica',
    ram: 'Memoria RAM',
    storage: 'Almacenamiento',
    psu: 'Fuente de Poder',
    cables: 'Cables Custom',
    os: 'Sistema Operativo',
}

const CATEGORY_ORDER: ComponentCategory[] = [
    'case', 'motherboard', 'cpu', 'cooling', 'gpu', 'ram', 'storage', 'psu', 'cables', 'os'
]

// Mock data para demo (se reemplaza con Supabase real)
const MOCK_COMPONENTS: HardwareComponent[] = [
    { id: '1', sku: 'CASE-O11DEVO', nombre: 'Lian Li O11 Dynamic EVO', categoria: 'case', marca: 'Lian Li', specs: { max_gpu_length: 423, max_cooler_height: 167 }, precio_venta: 7200, stock_actual: 4, bajo_pedido: false, oferta_activa: false, color_palette: ['stealth_black', 'pure_white'], tier: 'high-end', imagen_url: '/components/case.png' },
    { id: '2', sku: 'CASE-H9ELITE', nombre: 'NZXT H9 Elite', categoria: 'case', marca: 'NZXT', specs: { max_gpu_length: 435, max_cooler_height: 165 }, precio_venta: 9500, stock_actual: 3, bajo_pedido: false, oferta_activa: false, color_palette: ['stealth_black', 'pure_white'], tier: 'high-end', imagen_url: '/components/case.png' },
    { id: '3', sku: 'CPU-R7-7800X3D', nombre: 'AMD Ryzen 7 7800X3D', categoria: 'cpu', marca: 'AMD', specs: { socket: 'AM5', cores: 8, tdp: 120 }, precio_venta: 18500, precio_anterior: 21000, stock_actual: 5, bajo_pedido: false, oferta_activa: true, color_palette: ['stealth_black'], tier: 'high-end', imagen_url: '/components/cpu.png' },
    { id: '4', sku: 'CPU-R5-7600X', nombre: 'AMD Ryzen 5 7600X', categoria: 'cpu', marca: 'AMD', specs: { socket: 'AM5', cores: 6, tdp: 105 }, precio_venta: 9800, stock_actual: 8, bajo_pedido: false, oferta_activa: false, color_palette: ['stealth_black'], tier: 'midrange', imagen_url: '/components/cpu.png' },
    { id: '5', sku: 'GPU-RTX4090', nombre: 'NVIDIA RTX 4090 Founders', categoria: 'gpu', marca: 'NVIDIA', specs: { vram: 24, tdp: 450, length_mm: 336 }, precio_venta: 85000, precio_anterior: 92000, stock_actual: 2, bajo_pedido: false, oferta_activa: true, color_palette: ['stealth_black', 'pure_white'], tier: 'enthusiast', imagen_url: '/components/gpu.png' },
    { id: '6', sku: 'GPU-RTX4070TIS', nombre: 'NVIDIA RTX 4070 Ti SUPER', categoria: 'gpu', marca: 'NVIDIA', specs: { vram: 16, tdp: 285, length_mm: 310 }, precio_venta: 42000, stock_actual: 4, bajo_pedido: false, oferta_activa: false, color_palette: ['stealth_black'], tier: 'high-end', imagen_url: '/components/gpu.png' },
    { id: '7', sku: 'GPU-RTX4060', nombre: 'NVIDIA RTX 4060', categoria: 'gpu', marca: 'NVIDIA', specs: { vram: 8, tdp: 115, length_mm: 240 }, precio_venta: 14500, stock_actual: 10, bajo_pedido: false, oferta_activa: false, color_palette: ['stealth_black', 'pure_white'], tier: 'midrange', imagen_url: '/components/gpu.png' },
    { id: '8', sku: 'MB-X670E-HERO', nombre: 'ASUS ROG Crosshair X670E Hero', categoria: 'motherboard', marca: 'ASUS', specs: { socket: 'AM5', chipset: 'X670E' }, precio_venta: 22000, stock_actual: 2, bajo_pedido: false, oferta_activa: false, color_palette: ['stealth_black', 'rgb'], tier: 'enthusiast', imagen_url: '/components/motherboard.png' },
    { id: '9', sku: 'MB-B650-AORUS', nombre: 'Gigabyte B650 AORUS Elite', categoria: 'motherboard', marca: 'Gigabyte', specs: { socket: 'AM5', chipset: 'B650' }, precio_venta: 9500, precio_anterior: 11000, stock_actual: 5, bajo_pedido: false, oferta_activa: true, color_palette: ['stealth_black'], tier: 'midrange', imagen_url: '/components/motherboard.png' },
    { id: '10', sku: 'RAM-DDR5-32GB', nombre: 'Corsair Vengeance DDR5-6000 32GB', categoria: 'ram', marca: 'Corsair', specs: { type: 'DDR5', speed: 6000, capacity: 32 }, precio_venta: 6500, stock_actual: 12, bajo_pedido: false, oferta_activa: false, color_palette: ['stealth_black'], tier: 'high-end', imagen_url: '/components/ram.png' },
    { id: '11', sku: 'RAM-DDR5-32RGB', nombre: 'G.Skill Trident Z5 RGB DDR5 32GB', categoria: 'ram', marca: 'G.Skill', specs: { type: 'DDR5', speed: 6400, capacity: 32 }, precio_venta: 8200, stock_actual: 6, bajo_pedido: false, oferta_activa: false, color_palette: ['stealth_black', 'rgb'], tier: 'enthusiast', imagen_url: '/components/ram.png' },
    { id: '12', sku: 'SSD-990PRO-2TB', nombre: 'Samsung 990 PRO 2TB NVMe', categoria: 'storage', marca: 'Samsung', specs: { type: 'NVMe', capacity: 2000 }, precio_venta: 9800, stock_actual: 8, bajo_pedido: false, oferta_activa: false, color_palette: ['stealth_black'], tier: 'high-end', imagen_url: '/components/storage.png' },
    { id: '13', sku: 'PSU-RM1000X', nombre: 'Corsair RM1000x 80+ Gold', categoria: 'psu', marca: 'Corsair', specs: { watts: 1000, efficiency: '80+ Gold' }, precio_venta: 8500, stock_actual: 6, bajo_pedido: false, oferta_activa: false, color_palette: ['stealth_black'], tier: 'high-end', imagen_url: '/components/psu.png' },
    { id: '14', sku: 'PSU-THOR1200', nombre: 'ASUS ROG Thor 1200W Platinum', categoria: 'psu', marca: 'ASUS', specs: { watts: 1200, efficiency: '80+ Platinum' }, precio_venta: 14500, precio_anterior: 16000, stock_actual: 2, bajo_pedido: false, oferta_activa: true, color_palette: ['stealth_black', 'rgb'], tier: 'enthusiast', imagen_url: '/components/psu.png' },
    { id: '15', sku: 'COOL-KRAKEN360', nombre: 'NZXT Kraken Z63 RGB', categoria: 'cooling', marca: 'NZXT', specs: { type: 'AIO', radiator: 360 }, precio_venta: 12500, stock_actual: 5, bajo_pedido: false, oferta_activa: false, color_palette: ['stealth_black', 'rgb'], tier: 'high-end', imagen_url: '/components/cooling.png' },
    { id: '16', sku: 'COOL-NHDS15', nombre: 'Noctua NH-D15 chromax.black', categoria: 'cooling', marca: 'Noctua', specs: { type: 'Air', height: 165 }, precio_venta: 4200, stock_actual: 8, bajo_pedido: false, oferta_activa: false, color_palette: ['stealth_black'], tier: 'high-end', imagen_url: '/components/cooling.png' },
    // Sistemas Operativos mock
    { id: '17', sku: 'OS-WIN11-PRO', nombre: 'Windows 11 Pro (Licencia Original)', categoria: 'os', marca: 'Microsoft', specs: { type: 'Digital License' }, precio_venta: 1200, stock_actual: 50, bajo_pedido: false, oferta_activa: false, color_palette: ['stealth_black', 'pure_white', 'rgb'], tier: 'midrange', imagen_url: '/components/os_win11.png' },
    { id: '18', sku: 'OS-WIN11-HOME', nombre: 'Windows 11 Home', categoria: 'os', marca: 'Microsoft', specs: { type: 'Digital License' }, precio_venta: 800, stock_actual: 50, bajo_pedido: false, oferta_activa: false, color_palette: ['stealth_black', 'pure_white', 'rgb'], tier: 'budget', imagen_url: '/components/os_win11.png' },
]

export default function ComponentSelector() {
    const { build, styleFilter, selectComponent } = useBuild()
    const [expandedCategory, setExpandedCategory] = useState<ComponentCategory | null>('case')
    const [components, setComponents] = useState<HardwareComponent[]>(MOCK_COMPONENTS)
    const [loading, setLoading] = useState(false)

    // Intentar cargar desde Supabase (fallback a mock)
    useEffect(() => {
        const loadComponents = async () => {
            setLoading(true)
            try {
                const supabase = createClient()
                const { data, error } = await supabase
                    .from('hardware_stock')
                    .select('*')
                    .eq('activo', true)
                    .gt('stock_actual', 0)
                    .order('oferta_activa', { ascending: false })
                    .order('precio_venta', { ascending: true })

                if (data && data.length > 0) {
                    setComponents(data as HardwareComponent[])
                }
            } catch (e) {
                // Usar mock data
            } finally {
                setLoading(false)
            }
        }
        loadComponents()
    }, [])

    const handleSelect = (component: HardwareComponent) => {
        const errors = selectComponent(component)
        // Los errores se manejan en el context
    }

    const getFilteredComponents = (category: ComponentCategory) => {
        return components
            .filter(c => c.categoria === category)
            .filter(c => !styleFilter || c.color_palette?.includes(styleFilter))
    }

    return (
        <div className="space-y-2 max-h-[700px] overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-white/10 scrollbar-track-transparent">
            {CATEGORY_ORDER.map(category => {
                const isExpanded = expandedCategory === category
                const selectedComponent = build[category]
                const filteredComponents = getFilteredComponents(category)

                return (
                    <div key={category} className="rounded-xl overflow-hidden border border-white/5">
                        {/* Header de categoría */}
                        <button
                            onClick={() => setExpandedCategory(isExpanded ? null : category)}
                            className={`
                                w-full px-4 py-3 flex items-center justify-between
                                transition-colors
                                ${selectedComponent
                                    ? 'bg-green-500/10 hover:bg-green-500/20'
                                    : 'bg-white/[0.02] hover:bg-white/[0.05]'
                                }
                            `}
                        >
                            <div className="flex items-center gap-3">
                                {selectedComponent ? (
                                    <Check className="w-4 h-4 text-green-400" />
                                ) : (
                                    <div className="w-4 h-4 rounded-full border border-white/20" />
                                )}
                                <span className="font-medium text-white">
                                    {CATEGORY_LABELS[category]}
                                </span>
                                {selectedComponent && (
                                    <span className="text-xs text-white/50 ml-2">
                                        {selectedComponent.nombre}
                                    </span>
                                )}
                            </div>
                            <ChevronDown className={`w-4 h-4 text-white/50 transition-transform ${isExpanded ? 'rotate-180' : ''}`} />
                        </button>

                        {/* Lista de componentes */}
                        <AnimatePresence>
                            {isExpanded && (
                                <motion.div
                                    initial={{ height: 0, opacity: 0 }}
                                    animate={{ height: 'auto', opacity: 1 }}
                                    exit={{ height: 0, opacity: 0 }}
                                    className="overflow-hidden"
                                >
                                    <div className="p-3 space-y-2 bg-black/20">
                                        {filteredComponents.length === 0 ? (
                                            <p className="text-center text-white/40 py-4 text-sm">
                                                No hay componentes disponibles con ese estilo
                                            </p>
                                        ) : filteredComponents.map(component => (
                                            <ComponentCard
                                                key={component.id}
                                                component={component}
                                                isSelected={selectedComponent?.id === component.id}
                                                onSelect={() => handleSelect(component)}
                                            />
                                        ))}
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>
                )
            })}
        </div>
    )
}

function ComponentCard({ component, isSelected, onSelect }: {
    component: HardwareComponent
    isSelected: boolean
    onSelect: () => void
}) {
    const stockStatus = component.stock_actual === 0
        ? 'out'
        : component.stock_actual <= 3
            ? 'low'
            : component.bajo_pedido
                ? 'order'
                : 'available'

    return (
        <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={onSelect}
            disabled={stockStatus === 'out'}
            className={`
                relative w-full p-3 rounded-xl text-left transition-all overflow-hidden
                ${isSelected
                    ? 'border-2 border-yellow-500/80'
                    : 'border border-white/10 hover:border-white/30'
                }
                ${stockStatus === 'out' ? 'opacity-50 cursor-not-allowed' : ''}
            `}
        >
            {/* Glow dorado cuando está seleccionado */}
            {isSelected && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="absolute inset-0 bg-gradient-to-br from-yellow-500/20 via-amber-500/10 to-transparent pointer-events-none"
                />
            )}

            {/* Glow effect en el borde */}
            {isSelected && (
                <div className="absolute inset-0 rounded-xl shadow-[0_0_30px_rgba(234,179,8,0.3)] pointer-events-none" />
            )}

            <div className="relative flex items-start gap-3">
                {/* Imagen/Placeholder */}
                <motion.div
                    className="w-16 h-16 rounded-lg bg-white/5 flex items-center justify-center flex-shrink-0 overflow-hidden"
                    animate={isSelected ? { scale: [1, 1.05, 1] } : {}}
                    transition={{ duration: 0.3 }}
                >
                    {component.imagen_url ? (
                        <img src={component.imagen_url} alt={component.nombre} className="w-full h-full object-cover" />
                    ) : (
                        <Package className="w-6 h-6 text-white/30" />
                    )}
                </motion.div>

                {/* Info */}
                <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                        <div>
                            <p className={`font-medium text-sm truncate ${isSelected ? 'text-yellow-300' : 'text-white'}`}>
                                {component.nombre}
                            </p>
                            <p className="text-xs text-white/50">{component.marca}</p>
                        </div>

                        {/* Badges */}
                        <div className="flex flex-col items-end gap-1">
                            {component.oferta_activa && (
                                <span className="px-2 py-0.5 rounded-full bg-gradient-to-r from-yellow-500/80 to-orange-500/80 text-white text-[10px] font-bold flex items-center gap-1">
                                    <Flame className="w-3 h-3" />
                                    OFERTA
                                </span>
                            )}
                            {stockStatus === 'low' && (
                                <span className="px-2 py-0.5 rounded-full bg-orange-500/20 text-orange-400 text-[10px] font-medium">
                                    ¡Últimas!
                                </span>
                            )}
                            {stockStatus === 'order' && (
                                <span className="px-2 py-0.5 rounded-full bg-blue-500/20 text-blue-400 text-[10px] font-medium flex items-center gap-1">
                                    <Clock className="w-3 h-3" />
                                    7 días
                                </span>
                            )}
                        </div>
                    </div>

                    {/* Precio */}
                    <div className="mt-2 flex items-baseline gap-2">
                        <span className={`font-bold ${component.oferta_activa ? 'text-yellow-400' : isSelected ? 'text-yellow-300' : 'text-white'}`}>
                            ${component.precio_venta.toLocaleString()}
                        </span>
                        {component.precio_anterior && (
                            <span className="text-xs text-white/40 line-through">
                                ${component.precio_anterior.toLocaleString()}
                            </span>
                        )}
                    </div>
                </div>
            </div>
        </motion.button>
    )
}

