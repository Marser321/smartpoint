import { createClient } from '@/lib/supabase/server'
import AdminSidebar from '@/components/admin/sidebar'
import Link from 'next/link'
import { Plus, Search, Filter, Clock, AlertTriangle } from 'lucide-react'

const STATUS_COLORS: Record<string, string> = {
    recepcion: 'status-recepcion',
    diagnostico: 'status-diagnostico',
    espera_repuesto: 'status-espera-repuesto',
    en_mesa: 'status-en-mesa',
    listo: 'status-listo',
    entregado: 'status-entregado',
    rechazado: 'status-rechazado',
}

const STATUS_LABELS: Record<string, string> = {
    recepcion: 'Recepción',
    diagnostico: 'Diagnóstico',
    espera_repuesto: 'Esp. Repuesto',
    en_mesa: 'En Mesa',
    listo: 'Listo',
    entregado: 'Entregado',
    rechazado: 'Rechazado',
}

async function getTickets() {
    const supabase = await createClient()

    const { data } = await supabase
        .from('tickets_reparacion')
        .select(`
      numero_ticket,
      marca,
      modelo,
      estado,
      prioridad,
      falla_reportada,
      fecha_ingreso,
      clientes (
        nombre,
        telefono
      )
    `)
        .order('fecha_ingreso', { ascending: false })

    return data || []
}

function formatDate(dateStr: string) {
    const date = new Date(dateStr)
    return date.toLocaleDateString('es-UY', {
        day: '2-digit',
        month: 'short',
        hour: '2-digit',
        minute: '2-digit'
    })
}

function getDaysAgo(dateStr: string) {
    const date = new Date(dateStr)
    const now = new Date()
    const diffTime = Math.abs(now.getTime() - date.getTime())
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24))
    if (diffDays === 0) return 'Hoy'
    if (diffDays === 1) return 'Ayer'
    return `Hace ${diffDays} días`
}

export default async function AdminTicketsPage() {
    const tickets = await getTickets()

    return (
        <div className="min-h-screen bg-[var(--cod-gray)]">
            <AdminSidebar />

            <main className="lg:ml-72 pt-16 lg:pt-0">
                <div className="p-6 lg:p-8">
                    {/* Header */}
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
                        <div>
                            <h1 className="heading-2 text-white mb-2">Tickets de Reparación</h1>
                            <p className="text-[var(--text-secondary)]">
                                {tickets.length} tickets en total
                            </p>
                        </div>
                        <Link href="/admin/tickets/nuevo" className="btn-premium">
                            <Plus className="w-5 h-5" />
                            Nuevo Ticket
                        </Link>
                    </div>

                    {/* Filters */}
                    <div className="glass-card p-4 mb-6 flex flex-col sm:flex-row gap-4">
                        <div className="flex-1 relative">
                            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[var(--text-muted)]" />
                            <input
                                type="text"
                                placeholder="Buscar por ticket, cliente o modelo..."
                                className="w-full bg-white/5 border border-white/10 rounded-xl pl-12 pr-4 py-2.5 text-white placeholder:text-[var(--text-muted)] focus:outline-none focus:border-[var(--buddha-gold)]"
                            />
                        </div>
                        <button className="btn-glass">
                            <Filter className="w-5 h-5" />
                            Filtros
                        </button>
                    </div>

                    {/* Tickets Table */}
                    {tickets.length === 0 ? (
                        <div className="glass-card p-12 text-center">
                            <Clock className="w-16 h-16 mx-auto mb-4 text-[var(--text-muted)] opacity-50" />
                            <h3 className="text-lg font-semibold text-white mb-2">No hay tickets</h3>
                            <p className="text-[var(--text-muted)] mb-6">
                                Creá el primer ticket de reparación
                            </p>
                            <Link href="/admin/tickets/nuevo" className="btn-premium">
                                <Plus className="w-5 h-5" />
                                Nuevo Ticket
                            </Link>
                        </div>
                    ) : (
                        <div className="glass-card overflow-hidden">
                            {/* Desktop Table */}
                            <div className="hidden md:block overflow-x-auto">
                                <table className="w-full">
                                    <thead>
                                        <tr className="border-b border-white/5">
                                            <th className="text-left text-xs text-[var(--text-muted)] font-medium uppercase tracking-wider px-6 py-4">
                                                Ticket
                                            </th>
                                            <th className="text-left text-xs text-[var(--text-muted)] font-medium uppercase tracking-wider px-6 py-4">
                                                Dispositivo
                                            </th>
                                            <th className="text-left text-xs text-[var(--text-muted)] font-medium uppercase tracking-wider px-6 py-4">
                                                Cliente
                                            </th>
                                            <th className="text-left text-xs text-[var(--text-muted)] font-medium uppercase tracking-wider px-6 py-4">
                                                Estado
                                            </th>
                                            <th className="text-left text-xs text-[var(--text-muted)] font-medium uppercase tracking-wider px-6 py-4">
                                                Ingreso
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-white/5">
                                        {tickets.map((ticket: any) => (
                                            <tr
                                                key={ticket.numero_ticket}
                                                className="hover:bg-white/5 transition-colors cursor-pointer"
                                            >
                                                <td className="px-6 py-4">
                                                    <Link href={`/admin/tickets/${ticket.numero_ticket}`} className="block">
                                                        <div className="flex items-center gap-2">
                                                            <span className="font-mono text-[var(--buddha-gold)] font-medium">
                                                                {ticket.numero_ticket}
                                                            </span>
                                                            {ticket.prioridad === 'urgente' && (
                                                                <AlertTriangle className="w-4 h-4 text-[var(--error)]" />
                                                            )}
                                                        </div>
                                                    </Link>
                                                </td>
                                                <td className="px-6 py-4">
                                                    <Link href={`/admin/tickets/${ticket.numero_ticket}`} className="block">
                                                        <p className="text-white font-medium">
                                                            {ticket.marca} {ticket.modelo}
                                                        </p>
                                                        <p className="text-sm text-[var(--text-muted)] truncate max-w-xs">
                                                            {ticket.falla_reportada}
                                                        </p>
                                                    </Link>
                                                </td>
                                                <td className="px-6 py-4">
                                                    <Link href={`/admin/tickets/${ticket.numero_ticket}`} className="block">
                                                        <p className="text-white">
                                                            {ticket.clientes?.nombre || 'Sin cliente'}
                                                        </p>
                                                        <p className="text-sm text-[var(--text-muted)]">
                                                            {ticket.clientes?.telefono || '-'}
                                                        </p>
                                                    </Link>
                                                </td>
                                                <td className="px-6 py-4">
                                                    <span className={`text-xs px-3 py-1 rounded-full border ${STATUS_COLORS[ticket.estado]}`}>
                                                        {STATUS_LABELS[ticket.estado]}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4">
                                                    <p className="text-white text-sm">{getDaysAgo(ticket.fecha_ingreso)}</p>
                                                    <p className="text-xs text-[var(--text-muted)]">
                                                        {formatDate(ticket.fecha_ingreso)}
                                                    </p>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>

                            {/* Mobile List */}
                            <div className="md:hidden divide-y divide-white/5">
                                {tickets.map((ticket: any) => (
                                    <Link
                                        key={ticket.numero_ticket}
                                        href={`/admin/tickets/${ticket.numero_ticket}`}
                                        className="block p-4 hover:bg-white/5 transition-colors"
                                    >
                                        <div className="flex items-start justify-between mb-2">
                                            <div className="flex items-center gap-2">
                                                <span className="font-mono text-[var(--buddha-gold)] font-medium">
                                                    {ticket.numero_ticket}
                                                </span>
                                                {ticket.prioridad === 'urgente' && (
                                                    <AlertTriangle className="w-4 h-4 text-[var(--error)]" />
                                                )}
                                            </div>
                                            <span className={`text-xs px-2 py-1 rounded-full border ${STATUS_COLORS[ticket.estado]}`}>
                                                {STATUS_LABELS[ticket.estado]}
                                            </span>
                                        </div>
                                        <p className="text-white font-medium mb-1">
                                            {ticket.marca} {ticket.modelo}
                                        </p>
                                        <p className="text-sm text-[var(--text-muted)] mb-2 line-clamp-1">
                                            {ticket.falla_reportada}
                                        </p>
                                        <div className="flex items-center justify-between text-sm">
                                            <span className="text-[var(--text-secondary)]">
                                                {ticket.clientes?.nombre || 'Sin cliente'}
                                            </span>
                                            <span className="text-[var(--text-muted)]">
                                                {getDaysAgo(ticket.fecha_ingreso)}
                                            </span>
                                        </div>
                                    </Link>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            </main>
        </div>
    )
}
