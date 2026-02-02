'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
    Package, AlertTriangle, TrendingUp, TrendingDown,
    Search, Filter, ArrowUpDown, Clock,
    CheckCircle, XCircle, Truck, BarChart2
} from 'lucide-react'
import { formatPriceUYU } from '@/lib/utils'

// Apple easing
const appleEasing: [number, number, number, number] = [0.23, 1, 0.32, 1]

// Demo data - en producción viene de Supabase
const INVENTARIO = [
    {
        id: '1',
        nombre: 'Pantalla iPhone 13',
        sku: 'SCR-IP13-001',
        stock: 3,
        stockCritico: 5,
        precioCompra: 3200,
        precioVenta: 5500,
        ventasMensuales: 8,
        diasRestantes: 11,
        proveedor: 'TechParts'
    },
    {
        id: '2',
        nombre: 'Batería Samsung S21',
        sku: 'BAT-SS21-002',
        stock: 12,
        stockCritico: 5,
        precioCompra: 800,
        precioVenta: 1800,
        ventasMensuales: 6,
        diasRestantes: 60,
        proveedor: 'MobileSupply'
    },
    {
        id: '3',
        nombre: 'Vidrio Templado Universal',
        sku: 'VID-UNI-003',
        stock: 2,
        stockCritico: 10,
        precioCompra: 150,
        precioVenta: 450,
        ventasMensuales: 25,
        diasRestantes: 2,
        proveedor: 'GlassWorld'
    },
    {
        id: '4',
        nombre: 'Cargador USB-C 20W',
        sku: 'CHG-USC-004',
        stock: 18,
        stockCritico: 8,
        precioCompra: 350,
        precioVenta: 850,
        ventasMensuales: 10,
        diasRestantes: 54,
        proveedor: 'TechParts'
    },
    {
        id: '5',
        nombre: 'Pantalla iPhone 14 Pro',
        sku: 'SCR-IP14P-005',
        stock: 0,
        stockCritico: 3,
        precioCompra: 5500,
        precioVenta: 8500,
        ventasMensuales: 4,
        diasRestantes: 0,
        proveedor: 'AppleParts'
    },
]

type StockStatus = 'ok' | 'bajo' | 'critico' | 'agotado'

function getStockStatus(stock: number, critico: number): StockStatus {
    if (stock === 0) return 'agotado'
    if (stock <= critico * 0.5) return 'critico'
    if (stock <= critico) return 'bajo'
    return 'ok'
}

const statusConfig = {
    ok: { label: 'Normal', color: 'text-green-400', bg: 'bg-green-500/10', icon: CheckCircle },
    bajo: { label: 'Bajo', color: 'text-yellow-400', bg: 'bg-yellow-500/10', icon: AlertTriangle },
    critico: { label: 'Crítico', color: 'text-orange-400', bg: 'bg-orange-500/10', icon: AlertTriangle },
    agotado: { label: 'Agotado', color: 'text-red-400', bg: 'bg-red-500/10', icon: XCircle },
}

export default function InventarioPage() {
    const [mounted, setMounted] = useState(false)
    const [filtro, setFiltro] = useState<'todos' | 'alerta'>('todos')
    const [busqueda, setBusqueda] = useState('')

    useEffect(() => {
        setMounted(true)
    }, [])

    if (!mounted) return null

    const productosFiltrados = INVENTARIO.filter(p => {
        const matchBusqueda = p.nombre.toLowerCase().includes(busqueda.toLowerCase()) ||
            p.sku.toLowerCase().includes(busqueda.toLowerCase())
        const status = getStockStatus(p.stock, p.stockCritico)
        const matchFiltro = filtro === 'todos' || status !== 'ok'
        return matchBusqueda && matchFiltro
    })

    const productosAlerta = INVENTARIO.filter(p => getStockStatus(p.stock, p.stockCritico) !== 'ok')
    const valorInventario = INVENTARIO.reduce((acc, p) => acc + (p.stock * p.precioCompra), 0)

    return (
        <div className="space-y-6">
            {/* Header */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, ease: appleEasing }}
                className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4"
            >
                <div>
                    <h1 className="text-2xl font-bold text-white">Inventario Inteligente</h1>
                    <p className="text-white/50 mt-1">Control de stock con predicciones</p>
                </div>
            </motion.div>

            {/* Stats */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1, duration: 0.5, ease: appleEasing }}
                    className="p-5 rounded-2xl bg-white/[0.02] border border-white/[0.05]"
                >
                    <div className="flex items-center gap-3 mb-2">
                        <div className="w-10 h-10 rounded-xl bg-blue-500/10 flex items-center justify-center">
                            <Package className="w-5 h-5 text-blue-400" />
                        </div>
                        <span className="text-white/50 text-sm">Productos</span>
                    </div>
                    <p className="text-2xl font-bold text-white">{INVENTARIO.length}</p>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2, duration: 0.5, ease: appleEasing }}
                    className="p-5 rounded-2xl bg-white/[0.02] border border-white/[0.05]"
                >
                    <div className="flex items-center gap-3 mb-2">
                        <div className="w-10 h-10 rounded-xl bg-red-500/10 flex items-center justify-center">
                            <AlertTriangle className="w-5 h-5 text-red-400" />
                        </div>
                        <span className="text-white/50 text-sm">En Alerta</span>
                    </div>
                    <p className="text-2xl font-bold text-red-400">{productosAlerta.length}</p>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3, duration: 0.5, ease: appleEasing }}
                    className="p-5 rounded-2xl bg-white/[0.02] border border-white/[0.05]"
                >
                    <div className="flex items-center gap-3 mb-2">
                        <div className="w-10 h-10 rounded-xl bg-green-500/10 flex items-center justify-center">
                            <BarChart2 className="w-5 h-5 text-green-400" />
                        </div>
                        <span className="text-white/50 text-sm">Valor Inventario</span>
                    </div>
                    <p className="text-2xl font-bold text-green-400">{formatPriceUYU(valorInventario)}</p>
                </motion.div>
            </div>

            {/* Alerts Banner */}
            {productosAlerta.length > 0 && (
                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.4, duration: 0.5, ease: appleEasing }}
                    className="p-4 rounded-xl bg-red-500/10 border border-red-500/30 flex items-center gap-4"
                >
                    <AlertTriangle className="w-6 h-6 text-red-400 flex-shrink-0" />
                    <div className="flex-1">
                        <p className="text-red-400 font-medium">
                            {productosAlerta.length} productos requieren atención
                        </p>
                        <p className="text-sm text-red-400/70">
                            {productosAlerta.filter(p => p.stock === 0).length} agotados,
                            {productosAlerta.filter(p => p.stock > 0).length} con stock bajo
                        </p>
                    </div>
                    <button
                        onClick={() => setFiltro('alerta')}
                        className="px-4 py-2 rounded-lg bg-red-500/20 text-red-400 text-sm font-medium hover:bg-red-500/30 transition-colors"
                    >
                        Ver alertas
                    </button>
                </motion.div>
            )}

            {/* Filters */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5, duration: 0.5, ease: appleEasing }}
                className="flex flex-col sm:flex-row gap-4"
            >
                {/* Search */}
                <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-white/30" />
                    <input
                        type="text"
                        placeholder="Buscar por nombre o SKU..."
                        value={busqueda}
                        onChange={(e) => setBusqueda(e.target.value)}
                        className="
                            w-full pl-10 pr-4 py-3 rounded-xl
                            bg-white/5 border border-white/10
                            text-white placeholder:text-white/30
                            focus:outline-none focus:border-[var(--sp-red)]/50
                            transition-colors
                        "
                    />
                </div>

                {/* Filter Buttons */}
                <div className="flex gap-2">
                    <button
                        onClick={() => setFiltro('todos')}
                        className={`
                            px-4 py-3 rounded-xl font-medium text-sm
                            transition-all duration-300
                            ${filtro === 'todos'
                                ? 'bg-[var(--sp-red)] text-white'
                                : 'bg-white/5 text-white/70 hover:bg-white/10'
                            }
                        `}
                    >
                        Todos
                    </button>
                    <button
                        onClick={() => setFiltro('alerta')}
                        className={`
                            px-4 py-3 rounded-xl font-medium text-sm flex items-center gap-2
                            transition-all duration-300
                            ${filtro === 'alerta'
                                ? 'bg-red-500 text-white'
                                : 'bg-white/5 text-white/70 hover:bg-white/10'
                            }
                        `}
                    >
                        <AlertTriangle className="w-4 h-4" />
                        Alertas
                    </button>
                </div>
            </motion.div>

            {/* Products Table */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6, duration: 0.5, ease: appleEasing }}
                className="rounded-2xl bg-white/[0.02] border border-white/[0.05] overflow-hidden"
            >
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead>
                            <tr className="text-left text-sm text-white/50 border-b border-white/5">
                                <th className="p-4 font-medium">Producto</th>
                                <th className="p-4 font-medium text-center">Stock</th>
                                <th className="p-4 font-medium text-center">Estado</th>
                                <th className="p-4 font-medium text-center">Días Restantes</th>
                                <th className="p-4 font-medium text-right">Margen</th>
                            </tr>
                        </thead>
                        <tbody>
                            <AnimatePresence>
                                {productosFiltrados.map((producto, i) => {
                                    const status = getStockStatus(producto.stock, producto.stockCritico)
                                    const config = statusConfig[status]
                                    const margen = ((producto.precioVenta - producto.precioCompra) / producto.precioCompra) * 100
                                    const StatusIcon = config.icon

                                    return (
                                        <motion.tr
                                            key={producto.id}
                                            initial={{ opacity: 0, x: -10 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            exit={{ opacity: 0, x: 10 }}
                                            transition={{ delay: i * 0.05 }}
                                            className="border-b border-white/5 last:border-0 hover:bg-white/[0.02] transition-colors"
                                        >
                                            <td className="p-4">
                                                <div>
                                                    <p className="text-white font-medium">{producto.nombre}</p>
                                                    <p className="text-sm text-white/40">{producto.sku}</p>
                                                </div>
                                            </td>
                                            <td className="p-4 text-center">
                                                <span className={`text-lg font-bold ${config.color}`}>
                                                    {producto.stock}
                                                </span>
                                                <span className="text-white/40 text-sm"> / {producto.stockCritico}</span>
                                            </td>
                                            <td className="p-4">
                                                <div className="flex justify-center">
                                                    <span className={`
                                                        inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium
                                                        ${config.bg} ${config.color}
                                                    `}>
                                                        <StatusIcon className="w-3 h-3" />
                                                        {config.label}
                                                    </span>
                                                </div>
                                            </td>
                                            <td className="p-4 text-center">
                                                <div className="flex items-center justify-center gap-2">
                                                    <Clock className={`w-4 h-4 ${producto.diasRestantes <= 7 ? 'text-red-400' : 'text-white/40'}`} />
                                                    <span className={producto.diasRestantes <= 7 ? 'text-red-400 font-medium' : 'text-white/70'}>
                                                        {producto.diasRestantes === 0 ? 'Agotado' : `${producto.diasRestantes} días`}
                                                    </span>
                                                </div>
                                            </td>
                                            <td className="p-4 text-right">
                                                <span className={`font-medium ${margen > 50 ? 'text-green-400' : 'text-white/70'}`}>
                                                    {margen.toFixed(0)}%
                                                </span>
                                            </td>
                                        </motion.tr>
                                    )
                                })}
                            </AnimatePresence>
                        </tbody>
                    </table>
                </div>
            </motion.div>
        </div>
    )
}
