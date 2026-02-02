import { createClient } from '@/lib/supabase/server'
import AdminSidebar from '@/components/admin/sidebar'
import {
    Ticket, Clock, CheckCircle, AlertTriangle,
    Package, TrendingUp, Users
} from 'lucide-react'
import Link from 'next/link'

async function getStats() {
    const supabase = await createClient()

    // Contar tickets por estado
    const { data: tickets } = await supabase
        .from('tickets_reparacion')
        .select('estado')

    const stats = {
        total: tickets?.length || 0,
        pendientes: tickets?.filter(t => t.estado === 'recepcion' || t.estado === 'diagnostico').length || 0,
        enProceso: tickets?.filter(t => t.estado === 'en_mesa' || t.estado === 'espera_repuesto').length || 0,
        listos: tickets?.filter(t => t.estado === 'listo').length || 0,
    }

    // Inventario bajo stock
    const { data: lowStock } = await supabase
        .from('inventario')
        .select('id')
        .lte('stock_actual', 5)
        .eq('activo', true)

    // Total clientes
    const { count: clientesCount } = await supabase
        .from('clientes')
        .select('id', { count: 'exact', head: true })

    return {
        ...stats,
        lowStockCount: lowStock?.length || 0,
        clientesCount: clientesCount || 0,
    }
}

async function getRecentTickets() {
    const supabase = await createClient()

    const { data } = await supabase
        .from('tickets_reparacion')
        .select(`
      numero_ticket,
      marca,
      modelo,
      estado,
      prioridad,
      fecha_ingreso
    `)
        .order('fecha_ingreso', { ascending: false })
        .limit(5)

    return data || []
}

const STATUS_COLORS: Record<string, string> = {
    recepcion: 'status-recepcion',
    diagnostico: 'status-diagnostico',
    espera_repuesto: 'status-espera-repuesto',
    en_mesa: 'status-en-mesa',
    listo: 'status-listo',
    entregado: 'status-entregado',
}

const STATUS_LABELS: Record<string, string> = {
    recepcion: 'Recepción',
    diagnostico: 'Diagnóstico',
    espera_repuesto: 'Esp. Repuesto',
    en_mesa: 'En Mesa',
    listo: 'Listo',
    entregado: 'Entregado',
}

export default async function AdminDashboardPage() {
    const stats = await getStats()
    const recentTickets = await getRecentTickets()

    return (
        <div className="min-h-screen bg-[var(--cod-gray)]">
            <AdminSidebar />

            <main className="lg:ml-72 pt-16 lg:pt-0">
                <div className="p-6 lg:p-8">
                    {/* Header */}
                    <div className="mb-8">
                        <h1 className="heading-2 text-white mb-2">Dashboard</h1>
                        <p className="text-[var(--text-secondary)]">
                            Resumen del taller y tickets activos
                        </p>
                    </div>

                    {/* Stats Grid */}
                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                        {/* Tickets Pendientes */}
                        <div className="glass-card p-6">
                            <div className="flex items-center justify-between mb-4">
                                <div className="w-12 h-12 rounded-xl bg-[var(--warning-bg)] flex items-center justify-center">
                                    <Clock className="w-6 h-6 text-[var(--warning)]" />
                                </div>
                                {stats.pendientes > 0 && (
                                    <span className="text-xs bg-[var(--warning)]/20 text-[var(--warning)] px-2 py-1 rounded-full font-medium">
                                        Requiere atención
                                    </span>
                                )}
                            </div>
                            <p className="text-3xl font-bold text-white mb-1">{stats.pendientes}</p>
                            <p className="text-sm text-[var(--text-muted)]">Pendientes</p>
                        </div>

                        {/* En Proceso */}
                        <div className="glass-card p-6">
                            <div className="flex items-center justify-between mb-4">
                                <div className="w-12 h-12 rounded-xl bg-[var(--info-bg)] flex items-center justify-center">
                                    <Ticket className="w-6 h-6 text-[var(--info)]" />
                                </div>
                            </div>
                            <p className="text-3xl font-bold text-white mb-1">{stats.enProceso}</p>
                            <p className="text-sm text-[var(--text-muted)]">En Proceso</p>
                        </div>

                        {/* Listos */}
                        <div className="glass-card p-6">
                            <div className="flex items-center justify-between mb-4">
                                <div className="w-12 h-12 rounded-xl bg-[var(--success-bg)] flex items-center justify-center">
                                    <CheckCircle className="w-6 h-6 text-[var(--success)]" />
                                </div>
                            </div>
                            <p className="text-3xl font-bold text-white mb-1">{stats.listos}</p>
                            <p className="text-sm text-[var(--text-muted)]">Listos para Retirar</p>
                        </div>

                        {/* Stock Bajo */}
                        <div className="glass-card p-6">
                            <div className="flex items-center justify-between mb-4">
                                <div className="w-12 h-12 rounded-xl bg-[var(--error-bg)] flex items-center justify-center">
                                    <Package className="w-6 h-6 text-[var(--error)]" />
                                </div>
                                {stats.lowStockCount > 0 && (
                                    <span className="text-xs bg-[var(--error)]/20 text-[var(--error)] px-2 py-1 rounded-full font-medium">
                                        Alerta
                                    </span>
                                )}
                            </div>
                            <p className="text-3xl font-bold text-white mb-1">{stats.lowStockCount}</p>
                            <p className="text-sm text-[var(--text-muted)]">Stock Bajo</p>
                        </div>
                    </div>

                    {/* Two Column Layout */}
                    <div className="grid lg:grid-cols-3 gap-6">
                        {/* Recent Tickets */}
                        <div className="lg:col-span-2 glass-card p-6">
                            <div className="flex items-center justify-between mb-6">
                                <h2 className="text-lg font-semibold text-white">Tickets Recientes</h2>
                                <Link
                                    href="/admin/tickets"
                                    className="text-sm text-[var(--buddha-gold)] hover:underline"
                                >
                                    Ver todos
                                </Link>
                            </div>

                            {recentTickets.length === 0 ? (
                                <div className="text-center py-12 text-[var(--text-muted)]">
                                    <Ticket className="w-12 h-12 mx-auto mb-3 opacity-50" />
                                    <p>No hay tickets todavía</p>
                                </div>
                            ) : (
                                <div className="space-y-3">
                                    {recentTickets.map((ticket) => (
                                        <Link
                                            key={ticket.numero_ticket}
                                            href={`/admin/tickets/${ticket.numero_ticket}`}
                                            className="flex items-center gap-4 p-4 rounded-xl bg-white/5 hover:bg-white/10 transition-colors"
                                        >
                                            <div className="flex-1 min-w-0">
                                                <div className="flex items-center gap-2 mb-1">
                                                    <span className="font-mono text-sm text-[var(--buddha-gold)]">
                                                        {ticket.numero_ticket}
                                                    </span>
                                                    {ticket.prioridad === 'urgente' && (
                                                        <span className="text-xs bg-[var(--error)]/20 text-[var(--error)] px-2 py-0.5 rounded-full">
                                                            Urgente
                                                        </span>
                                                    )}
                                                </div>
                                                <p className="text-white font-medium truncate">
                                                    {ticket.marca} {ticket.modelo}
                                                </p>
                                            </div>
                                            <span className={`text-xs px-3 py-1 rounded-full border ${STATUS_COLORS[ticket.estado]}`}>
                                                {STATUS_LABELS[ticket.estado]}
                                            </span>
                                        </Link>
                                    ))}
                                </div>
                            )}
                        </div>

                        {/* Quick Actions */}
                        <div className="glass-card p-6">
                            <h2 className="text-lg font-semibold text-white mb-6">Acciones Rápidas</h2>
                            <div className="space-y-3">
                                <Link
                                    href="/admin/tickets/nuevo"
                                    className="flex items-center gap-3 p-4 rounded-xl bg-[var(--buddha-gold-10)] border border-[var(--buddha-gold-30)] hover:bg-[var(--buddha-gold-20)] transition-colors"
                                >
                                    <Ticket className="w-5 h-5 text-[var(--buddha-gold)]" />
                                    <span className="text-white font-medium">Nuevo Ticket</span>
                                </Link>
                                <Link
                                    href="/admin/inventario"
                                    className="flex items-center gap-3 p-4 rounded-xl bg-white/5 hover:bg-white/10 transition-colors"
                                >
                                    <Package className="w-5 h-5 text-[var(--text-secondary)]" />
                                    <span className="text-white font-medium">Ver Inventario</span>
                                </Link>
                                <Link
                                    href="/admin/clientes"
                                    className="flex items-center gap-3 p-4 rounded-xl bg-white/5 hover:bg-white/10 transition-colors"
                                >
                                    <Users className="w-5 h-5 text-[var(--text-secondary)]" />
                                    <span className="text-white font-medium">Clientes</span>
                                </Link>
                            </div>

                            {/* Stats Summary */}
                            <div className="mt-6 pt-6 border-t border-white/5">
                                <div className="flex items-center justify-between mb-2">
                                    <span className="text-[var(--text-muted)] text-sm">Total tickets</span>
                                    <span className="text-white font-medium">{stats.total}</span>
                                </div>
                                <div className="flex items-center justify-between">
                                    <span className="text-[var(--text-muted)] text-sm">Total clientes</span>
                                    <span className="text-white font-medium">{stats.clientesCount}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    )
}
