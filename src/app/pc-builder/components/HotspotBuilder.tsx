'use client'

import { useState } from 'react'
import Image from 'next/image'
import { motion, AnimatePresence } from 'framer-motion'
import { X, Check, Cpu, MonitorPlay, CircuitBoard, MemoryStick, Box, Zap, HardDrive, Wind, Laptop, ShoppingCart } from 'lucide-react'
import { useBuild, ComponentCategory, HardwareComponent } from '../context/BuildContext'
import { formatPriceUYU } from '@/lib/utils'

// Configuración de hotspots - Posiciones optimizadas para layout de components
const HOTSPOTS = [
    { id: 'cpu' as ComponentCategory, label: 'Procesador', icon: Cpu, top: '25%', left: '25%', img: '/components/cpu.png' },
    { id: 'gpu' as ComponentCategory, label: 'Tarjeta Gráfica', icon: MonitorPlay, top: '50%', left: '50%', img: '/components/gpu.png' },
    { id: 'motherboard' as ComponentCategory, label: 'Motherboard', icon: CircuitBoard, top: '40%', left: '75%', img: '/components/motherboard.png' },
    { id: 'ram' as ComponentCategory, label: 'Memoria RAM', icon: MemoryStick, top: '20%', left: '50%', img: '/components/ram.png' },
    { id: 'case' as ComponentCategory, label: 'Gabinete', icon: Box, top: '75%', left: '25%', img: '/components/case.png' },
    { id: 'psu' as ComponentCategory, label: 'Fuente de Poder', icon: Zap, top: '75%', left: '75%', img: '/components/psu.png' },
    { id: 'storage' as ComponentCategory, label: 'Almacenamiento SSD', icon: HardDrive, top: '55%', left: '25%', img: '/components/storage.png' },
    { id: 'cooling' as ComponentCategory, label: 'Refrigeración', icon: Wind, top: '20%', left: '75%', img: '/components/cooling.png' },
]

// Mock products - En producción conectar a Supabase
const MOCK_PRODUCTS: Record<ComponentCategory, HardwareComponent[]> = {
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
    cables: [],
    os: [
        { id: '11', sku: 'WIN-PRO', nombre: 'Windows 11 Pro', categoria: 'os', marca: 'Microsoft', specs: {}, precio_venta: 1200, stock_actual: 50, bajo_pedido: false, oferta_activa: false, color_palette: ['stealth_black'], tier: 'midrange' },
    ],
}

export default function HotspotBuilder() {
    const { build, selectComponent, totalPrice } = useBuild()
    const [activeCategory, setActiveCategory] = useState<ComponentCategory | null>(null)

    const handleHotspotClick = (category: ComponentCategory) => {
        setActiveCategory(category)
    }

    const handleSelectProduct = (product: HardwareComponent) => {
        selectComponent(product)
        setActiveCategory(null)
    }

    const closeDrawer = () => setActiveCategory(null)

    const activeHotspot = HOTSPOTS.find(h => h.id === activeCategory)
    const activeProducts = activeCategory ? MOCK_PRODUCTS[activeCategory] : []

    // Contar componentes seleccionados
    const selectedCount = Object.values(build).filter(Boolean).length

    return (
        <div className="relative w-full rounded-3xl overflow-hidden border border-white/10 bg-gradient-to-br from-[#0a0a0a] via-[#0d0d0d] to-[#0a0a0a]">
            {/* Grid luminoso de fondo */}
            <div
                className="absolute inset-0 opacity-10"
                style={{
                    backgroundImage: `
                        radial-gradient(circle at 30% 20%, rgba(196, 176, 1, 0.15) 0%, transparent 40%),
                        radial-gradient(circle at 70% 80%, rgba(196, 176, 1, 0.1) 0%, transparent 40%),
                        linear-gradient(to right, rgba(255,255,255,0.02) 1px, transparent 1px),
                        linear-gradient(to bottom, rgba(255,255,255,0.02) 1px, transparent 1px)
                    `,
                    backgroundSize: '100% 100%, 100% 100%, 60px 60px, 60px 60px'
                }}
            />

            {/* Contenedor principal en grid */}
            <div className="relative p-6 lg:p-8">
                {/* Header del Builder */}
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
                    <div>
                        <div className="flex items-center gap-2 text-[#C4B001] text-sm font-medium mb-1">
                            <Box className="w-4 h-4" />
                            <span>Componentes Seleccionados</span>
                        </div>
                        <p className="text-white/50 text-sm">
                            {selectedCount} de {HOTSPOTS.length} • Hacé clic para configurar
                        </p>
                    </div>

                    {/* Total flotante */}
                    <div className="flex items-center gap-4">
                        <div className="text-right">
                            <p className="text-xs text-white/40 uppercase tracking-wider">Total Actual</p>
                            <p className="text-2xl font-bold text-white">
                                {formatPriceUYU(totalPrice)}
                            </p>
                        </div>
                        <button className="hidden sm:flex items-center gap-2 px-5 py-3 rounded-xl bg-[#C4B001] text-black font-semibold shadow-[0_4px_20px_rgba(196,176,1,0.3)] hover:shadow-[0_8px_30px_rgba(196,176,1,0.4)] transition-all">
                            <ShoppingCart className="w-5 h-5" />
                            Agregar al Carrito
                        </button>
                    </div>
                </div>

                {/* Grid de componentes visual */}
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
                    {HOTSPOTS.map((hotspot, index) => {
                        const IconComponent = hotspot.icon
                        const isSelected = !!build[hotspot.id]
                        const selectedProduct = build[hotspot.id]

                        return (
                            <motion.button
                                key={hotspot.id}
                                onClick={() => handleHotspotClick(hotspot.id)}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: index * 0.05 }}
                                whileHover={{ scale: 1.02, y: -4 }}
                                whileTap={{ scale: 0.98 }}
                                className={`
                                    relative group p-4 rounded-2xl text-left
                                    transition-all duration-300
                                    ${isSelected
                                        ? 'bg-[#C4B001]/10 border-2 border-[#C4B001]/50 shadow-[0_0_30px_rgba(196,176,1,0.15)]'
                                        : 'bg-white/[0.03] border border-white/10 hover:border-[#C4B001]/30 hover:bg-white/[0.06]'
                                    }
                                `}
                            >
                                {/* Imagen del componente */}
                                <div className="relative w-full aspect-square mb-3 rounded-xl overflow-hidden bg-gradient-to-br from-white/5 to-transparent">
                                    <Image
                                        src={hotspot.img}
                                        alt={hotspot.label}
                                        fill
                                        className={`object-contain p-2 transition-all duration-500 ${isSelected ? 'scale-105' : 'group-hover:scale-110 opacity-70 group-hover:opacity-100'}`}
                                    />

                                    {/* Badge de seleccionado */}
                                    {isSelected && (
                                        <motion.div
                                            initial={{ scale: 0 }}
                                            animate={{ scale: 1 }}
                                            className="absolute top-2 right-2 w-6 h-6 rounded-full bg-[#C4B001] flex items-center justify-center shadow-lg"
                                        >
                                            <Check className="w-4 h-4 text-black" />
                                        </motion.div>
                                    )}

                                    {/* Glow overlay para seleccionados */}
                                    {isSelected && (
                                        <div className="absolute inset-0 bg-gradient-to-t from-[#C4B001]/20 to-transparent" />
                                    )}
                                </div>

                                {/* Info del componente */}
                                <div>
                                    <div className="flex items-center gap-2 mb-1">
                                        <IconComponent className={`w-4 h-4 ${isSelected ? 'text-[#C4B001]' : 'text-white/40'}`} />
                                        <span className={`text-xs font-medium uppercase tracking-wider ${isSelected ? 'text-[#C4B001]' : 'text-white/40'}`}>
                                            {hotspot.label}
                                        </span>
                                    </div>

                                    {isSelected && selectedProduct ? (
                                        <>
                                            <p className="text-sm font-semibold text-white truncate">
                                                {selectedProduct.nombre}
                                            </p>
                                            <p className="text-sm font-bold text-[#C4B001]">
                                                {formatPriceUYU(selectedProduct.precio_venta)}
                                            </p>
                                        </>
                                    ) : (
                                        <p className="text-sm text-white/30">
                                            Sin seleccionar
                                        </p>
                                    )}
                                </div>

                                {/* Hover indicator */}
                                <div className="absolute inset-0 rounded-2xl border-2 border-[#C4B001] opacity-0 group-hover:opacity-20 transition-opacity pointer-events-none" />
                            </motion.button>
                        )
                    })}
                </div>

                {/* Botón mobile para agregar al carrito */}
                <button className="sm:hidden w-full mt-4 flex items-center justify-center gap-2 px-5 py-4 rounded-xl bg-[#C4B001] text-black font-semibold shadow-[0_4px_20px_rgba(196,176,1,0.3)]">
                    <ShoppingCart className="w-5 h-5" />
                    Agregar Build al Carrito
                </button>
            </div>

            {/* DRAWER para seleccionar productos */}
            <AnimatePresence>
                {activeCategory && (
                    <>
                        {/* Backdrop */}
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={closeDrawer}
                            className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm"
                        />

                        {/* Panel */}
                        <motion.div
                            initial={{ x: '100%', opacity: 0 }}
                            animate={{ x: 0, opacity: 1 }}
                            exit={{ x: '100%', opacity: 0 }}
                            transition={{ type: 'spring', damping: 25, stiffness: 250 }}
                            className="fixed top-0 right-0 bottom-0 z-50 w-full max-w-md bg-[#0a0a0a]/98 backdrop-blur-2xl border-l border-white/10"
                        >
                            {/* Header */}
                            <div className="flex items-center justify-between p-6 border-b border-white/10">
                                <div className="flex items-center gap-4">
                                    {activeHotspot && (
                                        <div className="w-12 h-12 rounded-xl bg-white/5 flex items-center justify-center">
                                            <activeHotspot.icon className="w-6 h-6 text-[#C4B001]" />
                                        </div>
                                    )}
                                    <div>
                                        <h3 className="text-xl font-bold text-white">{activeHotspot?.label}</h3>
                                        <p className="text-sm text-white/40">Elegí tu componente</p>
                                    </div>
                                </div>
                                <button
                                    onClick={closeDrawer}
                                    className="p-3 rounded-xl bg-white/5 hover:bg-white/10 transition-colors"
                                >
                                    <X className="w-5 h-5 text-white/60" />
                                </button>
                            </div>

                            {/* Products */}
                            <div className="p-6 space-y-4 overflow-y-auto max-h-[calc(100vh-100px)]">
                                {activeProducts.length === 0 ? (
                                    <div className="text-center py-12 text-white/40">
                                        <Box className="w-12 h-12 mx-auto mb-3 opacity-50" />
                                        <p>No hay productos disponibles</p>
                                    </div>
                                ) : (
                                    activeProducts.map((product) => {
                                        const isSelected = build[activeCategory]?.id === product.id

                                        return (
                                            <motion.button
                                                key={product.id}
                                                onClick={() => handleSelectProduct(product)}
                                                whileHover={{ scale: 1.01 }}
                                                whileTap={{ scale: 0.99 }}
                                                className={`
                                                    w-full p-5 rounded-2xl text-left transition-all
                                                    ${isSelected
                                                        ? 'bg-[#C4B001]/15 border-2 border-[#C4B001]/60 shadow-[0_0_30px_rgba(196,176,1,0.1)]'
                                                        : 'bg-white/[0.03] border border-white/10 hover:bg-white/[0.06] hover:border-white/20'
                                                    }
                                                `}
                                            >
                                                <div className="flex items-start justify-between gap-4">
                                                    <div className="flex-1">
                                                        <div className="flex items-center gap-2 mb-1">
                                                            <span className="text-xs text-white/40">{product.marca}</span>
                                                            {product.oferta_activa && (
                                                                <span className="text-xs bg-[#C4B001]/20 text-[#C4B001] px-2 py-0.5 rounded-full font-medium">
                                                                    Oferta
                                                                </span>
                                                            )}
                                                        </div>
                                                        <p className={`font-semibold mb-2 ${isSelected ? 'text-[#C4B001]' : 'text-white'}`}>
                                                            {product.nombre}
                                                        </p>
                                                        <p className={`text-xl font-bold ${isSelected ? 'text-[#C4B001]' : 'text-white'}`}>
                                                            {formatPriceUYU(product.precio_venta)}
                                                        </p>
                                                        <p className="text-xs text-white/30 mt-1">
                                                            {product.stock_actual > 0
                                                                ? `${product.stock_actual} en stock`
                                                                : 'Bajo pedido'
                                                            }
                                                        </p>
                                                    </div>
                                                    {isSelected && (
                                                        <div className="w-8 h-8 rounded-full bg-[#C4B001] flex items-center justify-center flex-shrink-0">
                                                            <Check className="w-5 h-5 text-black" />
                                                        </div>
                                                    )}
                                                </div>
                                            </motion.button>
                                        )
                                    })
                                )}
                            </div>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>
        </div>
    )
}
