'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import {
    TrendingUp, TrendingDown, DollarSign, Wrench,
    ShoppingBag, Users, Clock, Package, Star,
    ArrowUpRight, ArrowDownRight
} from 'lucide-react'
import { formatPriceUYU } from '@/lib/utils'

// Apple easing
const appleEasing: [number, number, number, number] = [0.23, 1, 0.32, 1]

// Demo data - en producción viene de Supabase
const STATS = [
    {
        label: 'Ingresos del Mes',
        value: 187500,
        prefix: '$',
        change: 12.5,
        icon: DollarSign,
        color: 'text-green-400',
        bgColor: 'bg-green-500/10'
    },
    {
        label: 'Reparaciones',
        value: 47,
        change: 8.2,
        icon: Wrench,
        color: 'text-blue-400',
        bgColor: 'bg-blue-500/10'
    },
    {
        label: 'Ventas Tienda',
        value: 23,
        change: -3.1,
        icon: ShoppingBag,
        color: 'text-purple-400',
        bgColor: 'bg-purple-500/10'
    },
    {
        label: 'Clientes Nuevos',
        value: 18,
        change: 15.0,
        icon: Users,
        color: 'text-[var(--sp-red)]',
        bgColor: 'bg-[var(--sp-red)]/10'
    },
]

const REPARACIONES_POR_ESTADO = [
    { estado: 'Pendiente', cantidad: 8, color: 'bg-yellow-500' },
    { estado: 'En Proceso', cantidad: 12, color: 'bg-blue-500' },
    { estado: 'Esperando Repuesto', cantidad: 5, color: 'bg-orange-500' },
    { estado: 'Completado', cantidad: 47, color: 'bg-green-500' },
]

const TOP_PRODUCTOS = [
    { nombre: 'Vidrio Templado iPhone 15', vendidos: 15, ingresos: 14250 },
    { nombre: 'Funda Silicona Samsung S24', vendidos: 12, ingresos: 10800 },
    { nombre: 'Cargador USB-C 20W', vendidos: 10, ingresos: 8500 },
    { nombre: 'AirPods Pro 2', vendidos: 3, ingresos: 27000 },
]

const TENDENCIA_SEMANAL = [
    { dia: 'Lun', ventas: 12500, reparaciones: 5 },
    { dia: 'Mar', ventas: 18200, reparaciones: 8 },
    { dia: 'Mié', ventas: 15800, reparaciones: 6 },
    { dia: 'Jue', ventas: 22100, reparaciones: 9 },
    { dia: 'Vie', ventas: 31500, reparaciones: 12 },
    { dia: 'Sáb', ventas: 28900, reparaciones: 7 },
    { dia: 'Dom', ventas: 8500, reparaciones: 0 },
]

export default function AnalyticsPage() {
    const [mounted, setMounted] = useState(false)

    useEffect(() => {
        setMounted(true)
    }, [])

    if (!mounted) return null

    const maxVentas = Math.max(...TENDENCIA_SEMANAL.map(d => d.ventas))

    return (
        <div className="space-y-6">
            {/* Header */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, ease: appleEasing }}
            >
                <h1 className="text-2xl font-bold text-white">Dashboard Analytics</h1>
                <p className="text-white/50 mt-1">Métricas del mes actual</p>
            </motion.div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {STATS.map((stat, i) => (
                    <motion.div
                        key={stat.label}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.1, duration: 0.5, ease: appleEasing }}
                        className="
                            p-5 rounded-2xl
                            bg-white/[0.02] backdrop-blur-xl
                            border border-white/[0.05]
                            hover:bg-white/[0.04] hover:border-white/[0.08]
                            transition-all duration-300
                        "
                    >
                        <div className="flex items-start justify-between mb-4">
                            <div className={`w-12 h-12 rounded-xl ${stat.bgColor} flex items-center justify-center`}>
                                <stat.icon className={`w-6 h-6 ${stat.color}`} />
                            </div>
                            <div className={`flex items-center gap-1 text-sm ${stat.change >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                                {stat.change >= 0 ? (
                                    <ArrowUpRight className="w-4 h-4" />
                                ) : (
                                    <ArrowDownRight className="w-4 h-4" />
                                )}
                                {Math.abs(stat.change)}%
                            </div>
                        </div>
                        <p className="text-2xl font-bold text-white">
                            {stat.prefix}{stat.value.toLocaleString('es-UY')}
                        </p>
                        <p className="text-sm text-white/50 mt-1">{stat.label}</p>
                    </motion.div>
                ))}
            </div>

            {/* Charts Row */}
            <div className="grid lg:grid-cols-2 gap-6">
                {/* Tendencia Semanal */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4, duration: 0.5, ease: appleEasing }}
                    className="
                        p-6 rounded-2xl
                        bg-white/[0.02] backdrop-blur-xl
                        border border-white/[0.05]
                    "
                >
                    <h3 className="text-lg font-semibold text-white mb-6">Tendencia Semanal</h3>
                    <div className="flex items-end justify-between h-48 gap-2">
                        {TENDENCIA_SEMANAL.map((dia, i) => (
                            <div key={dia.dia} className="flex-1 flex flex-col items-center gap-2">
                                <motion.div
                                    initial={{ height: 0 }}
                                    animate={{ height: `${(dia.ventas / maxVentas) * 100}%` }}
                                    transition={{ delay: 0.5 + i * 0.1, duration: 0.5, ease: appleEasing }}
                                    className="w-full bg-gradient-to-t from-[var(--sp-red)] to-[var(--sp-red-light)] rounded-t-lg relative group cursor-pointer"
                                >
                                    <div className="
                                        absolute -top-8 left-1/2 -translate-x-1/2
                                        px-2 py-1 rounded bg-white/10 text-xs text-white
                                        opacity-0 group-hover:opacity-100 transition-opacity
                                        whitespace-nowrap
                                    ">
                                        {formatPriceUYU(dia.ventas)}
                                    </div>
                                </motion.div>
                                <span className="text-xs text-white/50">{dia.dia}</span>
                            </div>
                        ))}
                    </div>
                </motion.div>

                {/* Reparaciones por Estado */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5, duration: 0.5, ease: appleEasing }}
                    className="
                        p-6 rounded-2xl
                        bg-white/[0.02] backdrop-blur-xl
                        border border-white/[0.05]
                    "
                >
                    <h3 className="text-lg font-semibold text-white mb-6">Reparaciones por Estado</h3>
                    <div className="space-y-4">
                        {REPARACIONES_POR_ESTADO.map((item, i) => {
                            const total = REPARACIONES_POR_ESTADO.reduce((acc, r) => acc + r.cantidad, 0)
                            const porcentaje = (item.cantidad / total) * 100

                            return (
                                <div key={item.estado}>
                                    <div className="flex justify-between text-sm mb-2">
                                        <span className="text-white/70">{item.estado}</span>
                                        <span className="text-white font-medium">{item.cantidad}</span>
                                    </div>
                                    <div className="h-2 bg-white/5 rounded-full overflow-hidden">
                                        <motion.div
                                            initial={{ width: 0 }}
                                            animate={{ width: `${porcentaje}%` }}
                                            transition={{ delay: 0.6 + i * 0.1, duration: 0.5, ease: appleEasing }}
                                            className={`h-full ${item.color} rounded-full`}
                                        />
                                    </div>
                                </div>
                            )
                        })}
                    </div>
                </motion.div>
            </div>

            {/* Top Productos */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6, duration: 0.5, ease: appleEasing }}
                className="
                    p-6 rounded-2xl
                    bg-white/[0.02] backdrop-blur-xl
                    border border-white/[0.05]
                "
            >
                <h3 className="text-lg font-semibold text-white mb-6">Top Productos</h3>
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead>
                            <tr className="text-left text-sm text-white/50 border-b border-white/5">
                                <th className="pb-3 font-medium">Producto</th>
                                <th className="pb-3 font-medium text-center">Vendidos</th>
                                <th className="pb-3 font-medium text-right">Ingresos</th>
                            </tr>
                        </thead>
                        <tbody>
                            {TOP_PRODUCTOS.map((producto, i) => (
                                <motion.tr
                                    key={producto.nombre}
                                    initial={{ opacity: 0, x: -10 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: 0.7 + i * 0.1 }}
                                    className="border-b border-white/5 last:border-0"
                                >
                                    <td className="py-4 text-white">{producto.nombre}</td>
                                    <td className="py-4 text-center">
                                        <span className="px-2 py-1 rounded-lg bg-white/5 text-white/70 text-sm">
                                            {producto.vendidos}
                                        </span>
                                    </td>
                                    <td className="py-4 text-right text-[var(--sp-red)] font-medium">
                                        {formatPriceUYU(producto.ingresos)}
                                    </td>
                                </motion.tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </motion.div>
        </div>
    )
}
