'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import AdminSidebar from '@/components/admin/sidebar'
import {
    BarChart3, TrendingUp, DollarSign, Wrench, Calendar,
    Download, Filter, RefreshCw
} from 'lucide-react'
import { formatPriceUYU, formatDate } from '@/lib/utils'

interface ReportStats {
    totalTickets: number
    ticketsCompletados: number
    ingresosMes: number
    ticketPromedioDia: number
    tiempoPromedioReparacion: number
    topFallas: { falla: string; count: number }[]
    ticketsPorEstado: { estado: string; count: number }[]
    ingresosPorMes: { mes: string; total: number }[]
}

export default function ReportesPage() {
    const [stats, setStats] = useState<ReportStats | null>(null)
    const [loading, setLoading] = useState(true)
    const [periodo, setPeriodo] = useState<'semana' | 'mes' | 'ano'>('mes')

    useEffect(() => {
        loadStats()
    }, [periodo])

    const loadStats = async () => {
        setLoading(true)
        const supabase = createClient()

        // Fechas según período
        const now = new Date()
        let startDate = new Date()
        if (periodo === 'semana') startDate.setDate(now.getDate() - 7)
        else if (periodo === 'mes') startDate.setMonth(now.getMonth() - 1)
        else startDate.setFullYear(now.getFullYear() - 1)

        const startISO = startDate.toISOString()

        // Total tickets
        const { count: totalTickets } = await supabase
            .from('tickets_reparacion')
            .select('*', { count: 'exact', head: true })
            .gte('fecha_ingreso', startISO)

        // Tickets completados
        const { count: ticketsCompletados } = await supabase
            .from('tickets_reparacion')
            .select('*', { count: 'exact', head: true })
            .in('estado', ['listo', 'entregado'])
            .gte('fecha_ingreso', startISO)

        // Ingresos (presupuestos aceptados)
        const { data: ticketsConPresupuesto } = await supabase
            .from('tickets_reparacion')
            .select('presupuesto')
            .in('estado', ['listo', 'entregado'])
            .not('presupuesto', 'is', null)
            .gte('fecha_ingreso', startISO)

        const ingresosMes = ticketsConPresupuesto?.reduce((sum, t) => sum + (t.presupuesto || 0), 0) || 0

        // Tickets por estado
        const { data: allTickets } = await supabase
            .from('tickets_reparacion')
            .select('estado')
            .gte('fecha_ingreso', startISO)

        const estadoCounts: Record<string, number> = {}
        allTickets?.forEach(t => {
            estadoCounts[t.estado] = (estadoCounts[t.estado] || 0) + 1
        })
        const ticketsPorEstado = Object.entries(estadoCounts).map(([estado, count]) => ({ estado, count }))

        // Top fallas
        const { data: fallasData } = await supabase
            .from('tickets_reparacion')
            .select('falla_reportada')
            .gte('fecha_ingreso', startISO)

        const fallaCounts: Record<string, number> = {}
        fallasData?.forEach(t => {
            const falla = t.falla_reportada.split(',')[0].trim().substring(0, 30)
            fallaCounts[falla] = (fallaCounts[falla] || 0) + 1
        })
        const topFallas = Object.entries(fallaCounts)
            .sort((a, b) => b[1] - a[1])
            .slice(0, 5)
            .map(([falla, count]) => ({ falla, count }))

        // Días del período
        const dias = periodo === 'semana' ? 7 : periodo === 'mes' ? 30 : 365
        const ticketPromedioDia = Math.round((totalTickets || 0) / dias * 10) / 10

        setStats({
            totalTickets: totalTickets || 0,
            ticketsCompletados: ticketsCompletados || 0,
            ingresosMes,
            ticketPromedioDia,
            tiempoPromedioReparacion: 2.5, // Demo
            topFallas,
            ticketsPorEstado,
            ingresosPorMes: [], // TODO: implementar
        })
        setLoading(false)
    }

    const exportCSV = () => {
        // TODO: implementar exportación
        alert('Exportación CSV próximamente')
    }

    return (
        <div className="min-h-screen bg-[var(--cod-gray)]">
            <AdminSidebar />
            <main className="lg:ml-72 pt-16 lg:pt-0">
                <div className="p-6 lg:p-8">
                    {/* Header */}
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
                        <div>
                            <h1 className="heading-2 text-white mb-1">Reportes</h1>
                            <p className="text-[var(--text-muted)]">
                                Analytics y estadísticas del negocio
                            </p>
                        </div>
                        <div className="flex gap-3">
                            <select
                                value={periodo}
                                onChange={e => setPeriodo(e.target.value as 'semana' | 'mes' | 'ano')}
                                className="bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-white focus:outline-none focus:border-[var(--buddha-gold)]"
                            >
                                <option value="semana">Última semana</option>
                                <option value="mes">Último mes</option>
                                <option value="ano">Último año</option>
                            </select>
                            <button onClick={exportCSV} className="btn-glass">
                                <Download className="w-5 h-5" />
                                Exportar
                            </button>
                        </div>
                    </div>

                    {loading ? (
                        <div className="glass-card p-12 text-center">
                            <RefreshCw className="w-8 h-8 mx-auto mb-4 text-[var(--buddha-gold)] animate-spin" />
                            <p className="text-[var(--text-muted)]">Cargando estadísticas...</p>
                        </div>
                    ) : stats && (
                        <>
                            {/* KPIs */}
                            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                                <div className="glass-card p-6">
                                    <div className="flex items-center gap-3 mb-3">
                                        <div className="w-10 h-10 rounded-xl bg-[var(--info-bg)] flex items-center justify-center">
                                            <Wrench className="w-5 h-5 text-[var(--info)]" />
                                        </div>
                                    </div>
                                    <p className="text-3xl font-bold text-white">{stats.totalTickets}</p>
                                    <p className="text-sm text-[var(--text-muted)]">Tickets totales</p>
                                </div>
                                <div className="glass-card p-6">
                                    <div className="flex items-center gap-3 mb-3">
                                        <div className="w-10 h-10 rounded-xl bg-[var(--success-bg)] flex items-center justify-center">
                                            <TrendingUp className="w-5 h-5 text-[var(--success)]" />
                                        </div>
                                    </div>
                                    <p className="text-3xl font-bold text-white">{stats.ticketsCompletados}</p>
                                    <p className="text-sm text-[var(--text-muted)]">Completados</p>
                                </div>
                                <div className="glass-card p-6">
                                    <div className="flex items-center gap-3 mb-3">
                                        <div className="w-10 h-10 rounded-xl bg-[var(--buddha-gold-10)] flex items-center justify-center">
                                            <DollarSign className="w-5 h-5 text-[var(--buddha-gold)]" />
                                        </div>
                                    </div>
                                    <p className="text-3xl font-bold text-gradient-gold">{formatPriceUYU(stats.ingresosMes)}</p>
                                    <p className="text-sm text-[var(--text-muted)]">Ingresos</p>
                                </div>
                                <div className="glass-card p-6">
                                    <div className="flex items-center gap-3 mb-3">
                                        <div className="w-10 h-10 rounded-xl bg-[var(--warning-bg)] flex items-center justify-center">
                                            <Calendar className="w-5 h-5 text-[var(--warning)]" />
                                        </div>
                                    </div>
                                    <p className="text-3xl font-bold text-white">{stats.ticketPromedioDia}</p>
                                    <p className="text-sm text-[var(--text-muted)]">Tickets/día promedio</p>
                                </div>
                            </div>

                            <div className="grid lg:grid-cols-2 gap-6">
                                {/* Tickets por Estado */}
                                <div className="glass-card p-6">
                                    <h3 className="font-semibold text-white mb-4 flex items-center gap-2">
                                        <BarChart3 className="w-5 h-5 text-[var(--buddha-gold)]" />
                                        Tickets por Estado
                                    </h3>
                                    <div className="space-y-3">
                                        {stats.ticketsPorEstado.map(item => {
                                            const percent = stats.totalTickets > 0
                                                ? Math.round((item.count / stats.totalTickets) * 100)
                                                : 0
                                            return (
                                                <div key={item.estado}>
                                                    <div className="flex justify-between text-sm mb-1">
                                                        <span className="text-[var(--text-secondary)] capitalize">{item.estado.replace('_', ' ')}</span>
                                                        <span className="text-white font-medium">{item.count} ({percent}%)</span>
                                                    </div>
                                                    <div className="h-2 bg-white/5 rounded-full overflow-hidden">
                                                        <div
                                                            className="h-full bg-gradient-to-r from-[var(--buddha-gold)] to-[var(--buddha-gold-light)]"
                                                            style={{ width: `${percent}%` }}
                                                        />
                                                    </div>
                                                </div>
                                            )
                                        })}
                                        {stats.ticketsPorEstado.length === 0 && (
                                            <p className="text-[var(--text-muted)] text-center py-4">Sin datos</p>
                                        )}
                                    </div>
                                </div>

                                {/* Top Fallas */}
                                <div className="glass-card p-6">
                                    <h3 className="font-semibold text-white mb-4 flex items-center gap-2">
                                        <Wrench className="w-5 h-5 text-[var(--buddha-gold)]" />
                                        Fallas más Comunes
                                    </h3>
                                    <div className="space-y-3">
                                        {stats.topFallas.map((item, idx) => (
                                            <div key={idx} className="flex items-center justify-between p-3 bg-white/5 rounded-xl">
                                                <div className="flex items-center gap-3">
                                                    <span className="w-6 h-6 rounded-full bg-[var(--buddha-gold-10)] text-[var(--buddha-gold)] text-xs flex items-center justify-center font-bold">
                                                        {idx + 1}
                                                    </span>
                                                    <span className="text-white text-sm">{item.falla}</span>
                                                </div>
                                                <span className="text-[var(--text-muted)] text-sm">{item.count} tickets</span>
                                            </div>
                                        ))}
                                        {stats.topFallas.length === 0 && (
                                            <p className="text-[var(--text-muted)] text-center py-4">Sin datos</p>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </>
                    )}
                </div>
            </main>
        </div>
    )
}
