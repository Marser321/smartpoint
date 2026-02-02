'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { useBuild, ComponentCategory } from '../context/BuildContext'
import { Monitor, Cpu, CircuitBoard, MemoryStick, HardDrive, Zap, Box, Wind, Cable, Laptop } from 'lucide-react'

const CATEGORY_ICONS: Record<ComponentCategory, React.ReactNode> = {
    case: <Box className="w-5 h-5" />,
    motherboard: <CircuitBoard className="w-5 h-5" />,
    cpu: <Cpu className="w-5 h-5" />,
    cooling: <Wind className="w-5 h-5" />,
    gpu: <Monitor className="w-5 h-5" />,
    ram: <MemoryStick className="w-5 h-5" />,
    storage: <HardDrive className="w-5 h-5" />,
    psu: <Zap className="w-5 h-5" />,
    cables: <Cable className="w-5 h-5" />,
    os: <Laptop className="w-5 h-5" />,
}

const CATEGORY_LABELS: Record<ComponentCategory, string> = {
    case: 'Gabinete',
    motherboard: 'Motherboard',
    cpu: 'Procesador',
    cooling: 'Refrigeración',
    gpu: 'Gráfica',
    ram: 'Memoria RAM',
    storage: 'Almacenamiento',
    psu: 'Fuente',
    cables: 'Cables Custom',
    os: 'Sistema Operativo',
}

export default function ExplodedView() {
    const { build, nightMode, removeComponent } = useBuild()

    // Filtrar componentes seleccionados con tipo explícito
    const selectedComponents = (Object.entries(build) as [ComponentCategory, typeof build.cpu][])
        .filter(([_, component]) => component !== null)
        .map(([category, component]) => ({ category, ...component! }))

    return (
        <div className={`
            relative w-full rounded-3xl overflow-hidden min-h-[600px] flex flex-col
            border border-white/10 transition-colors duration-500
            ${nightMode
                ? 'bg-black shadow-[0_0_100px_rgba(100,100,255,0.1)]'
                : 'bg-gradient-to-br from-gray-900 to-gray-950'
            }
        `}>
            {/* Header Visual */}
            <div className="p-6 border-b border-white/5 flex items-center justify-between">
                <div>
                    <h3 className="text-xl font-bold text-white flex items-center gap-2">
                        <Box className="w-5 h-5 text-blue-500" />
                        Tu Setup
                    </h3>
                    <p className="text-sm text-white/40">Visualización de componentes seleccionados</p>
                </div>
                <div className="flex gap-2">
                    {/* Slots ocupados */}
                    <span className="px-3 py-1 rounded-full bg-white/5 text-xs text-white/60 border border-white/5">
                        {selectedComponents.length} / 9 Componentes
                    </span>
                </div>
            </div>

            {/* Grid de "Cajas" / Componentes */}
            <div className="flex-1 p-6 overflow-y-auto">
                {selectedComponents.length === 0 ? (
                    <div className="h-full flex flex-col items-center justify-center text-white/20">
                        <Box className="w-24 h-24 mb-4 stroke-[1]" />
                        <p className="text-lg">Tu gabinete está vacío</p>
                        <p className="text-sm">Seleccioná componentes para empezar</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4 auto-rows-max">
                        <AnimatePresence mode="popLayout">
                            {selectedComponents.map((item) => (
                                <motion.div
                                    key={item.category}
                                    layout
                                    initial={{ opacity: 0, scale: 0.8, y: 20 }}
                                    animate={{ opacity: 1, scale: 1, y: 0 }}
                                    exit={{ opacity: 0, scale: 0.8, y: 20 }}
                                    className={`
                                        group relative aspect-[4/5] rounded-2xl overflow-hidden cursor-pointer
                                        border border-white/10 bg-white/5 backdrop-blur-sm
                                        hover:border-white/30 hover:bg-white/10 transition-colors
                                        ${item.category === 'case' ? 'col-span-2 md:col-span-2 aspect-[16/9]' : ''}
                                    `}
                                    onClick={() => removeComponent(item.category)}
                                >
                                    {/* Imagen centrada */}
                                    <div className="absolute inset-0 p-6 flex items-center justify-center">
                                        {item.imagen_transparente ? (
                                            <motion.img
                                                src={item.imagen_transparente}
                                                alt={item.nombre}
                                                className="w-full h-full object-contain drop-shadow-2xl group-hover:scale-105 transition-transform duration-500"
                                            />
                                        ) : (
                                            <div className="w-16 h-16 text-white/20 group-hover:text-white/40 transition-colors">
                                                {CATEGORY_ICONS[item.category]}
                                            </div>
                                        )}
                                    </div>

                                    {/* Info Overlay (Bottom) */}
                                    <div className="absolute inset-x-0 bottom-0 p-4 bg-gradient-to-t from-black/90 via-black/50 to-transparent">
                                        <div className="flex items-start justify-between gap-2">
                                            <div>
                                                <p className="text-[10px] font-bold text-white/50 uppercase tracking-wider mb-0.5">
                                                    {CATEGORY_LABELS[item.category]}
                                                </p>
                                                <p className="text-sm font-medium text-white line-clamp-2 leading-tight">
                                                    {item.nombre}
                                                </p>
                                            </div>
                                            <div className="opacity-0 group-hover:opacity-100 transition-opacity bg-red-500/20 p-1.5 rounded-lg text-red-400">
                                                <span className="sr-only">Quitar</span>
                                                <svg className="w-3 h-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                                                    <path d="M18 6L6 18M6 6l12 12" />
                                                </svg>
                                            </div>
                                        </div>
                                    </div>

                                    {/* RGB Glow Effect */}
                                    {nightMode && item.color_palette?.includes('rgb') && (
                                        <div className="absolute inset-0 bg-gradient-to-tr from-purple-500/10 via-transparent to-cyan-500/10 mix-blend-overlay pointer-events-none" />
                                    )}
                                </motion.div>
                            ))}
                        </AnimatePresence>
                    </div>
                )}
            </div>

            {/* Footer con Resumen Rápido (Opcional, si sobra espacio) */}
            <div className="p-4 border-t border-white/5 bg-black/20 text-xs text-white/40 flex justify-center gap-4">
                <span>✨ Modo {nightMode ? 'RGB' : 'Studio'} Activo</span>
                <span>🖱️ Click en componente para quitar</span>
            </div>
        </div>
    )
}
