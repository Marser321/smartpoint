import { createClient } from '@/lib/supabase/server'
import {
    Ticket, Clock, CheckCircle, AlertTriangle,
    Package, TrendingUp, Users, DollarSign,
    ArrowUpRight, ArrowDownRight, ShoppingBag,
    Wrench, Star
} from 'lucide-react'
import Link from 'next/link'

async function getStats() {
    const supabase = await createClient()

    // Obtener todos los tickets con más información
    const { data: tickets } = await supabase
        .from('tickets_reparacion')
        .select('estado, prioridad, fecha_ingreso, monto_final')

    const now = new Date()
    const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate())
    const weekStart = new Date(todayStart)
    weekStart.setDate(weekStart.getDate() - 7)

    const stats = {
        total: tickets?.length || 0,
        pendientes: tickets?.filter(t => t.estado === 'recepcion' || t.estado === 'diagnostico').length || 0,
        enProceso: tickets?.filter(t => t.estado === 'en_mesa' || t.estado === 'espera_repuesto').length || 0,
        listos: tickets?.filter(t => t.estado === 'listo').length || 0,
        entregados: tickets?.filter(t => t.estado === 'entregado').length || 0,
        urgentes: tickets?.filter(t => t.prioridad === 'urgente' && t.estado !== 'entregado').length || 0,
    }

    // Calcular ingresos
    const ingresosTotal = tickets?.reduce((acc, t) => acc + (t.monto_final || 0), 0) || 0

    // Inventario bajo stock
    const { data: lowStock } = await supabase
        .from('inventario')
        .select('id, nombre, stock_actual')
        .lte('stock_actual', 5)
        .eq('activo', true)
        .limit(5)

    // Total clientes
    const { count: clientesCount } = await supabase
        .from('clientes')
        .select('id', { count: 'exact', head: true })

    // Ventas del día
    const { data: ventasHoy } = await supabase
        .from('ventas')
        .select('total')
        .gte('created_at', todayStart.toISOString())

    const totalVentasHoy = ventasHoy?.reduce((acc, v) => acc + (v.total || 0), 0) || 0

    // Productos con poco stock
    const { data: productosLowStock } = await supabase
        .from('productos')
        .select('id, nombre, stock')
        .lte('stock', 5)
        .eq('activo', true)
        .limit(5)

    // Membresías activas
    const { count: membresiasActivas } = await supabase
        .from('membresias')
        .select('id', { count: 'exact', head: true })
        .eq('activa', true)

    return {
        ...stats,
        ingresosTotal,
        lowStockCount: (lowStock?.length || 0) + (productosLowStock?.length || 0),
        lowStockItems: [...(lowStock || []), ...(productosLowStock || [])].slice(0, 5),
        clientesCount: clientesCount || 0,
        ventasHoy: totalVentasHoy,
        membresiasActivas: membresiasActivas || 0,
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
      fecha_ingreso,
      cliente:clientes(nombre)
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

const STATUS_BAR_COLORS: Record<string, string> = {
    recepcion: 'bg-blue-500',
    diagnostico: 'bg-yellow-500',
    espera_repuesto: 'bg-purple-500',
    en_mesa: 'bg-violet-500',
    listo: 'bg-green-500',
    entregado: 'bg-gray-500',
}

// Componente para las tarjetas de stats
function StatCard({
    icon: Icon,
    label,
    value,
    subValue,
    trend,
    alert,
    color = 'default'
}: {
    icon: React.ElementType
    label: string
    value: string | number
    subValue?: string
    trend?: 'up' | 'down'
    alert?: boolean
    color?: 'default' | 'warning' | 'success' | 'error' | 'info' | 'gold'
}) {
    const colorStyles = {
        default: 'bg-white/5',
        warning: 'bg-[var(--warning-bg)]',
        success: 'bg-[var(--success-bg)]',
        error: 'bg-[var(--error-bg)]',
        info: 'bg-[var(--info-bg)]',
        gold: 'bg-[var(--buddha-gold-10)]'
    }

    const iconColors = {
        default: 'text-white',
        warning: 'text-[var(--warning)]',
        success: 'text-[var(--success)]',
        error: 'text-[var(--error)]',
        info: 'text-[var(--info)]',
        gold: 'text-[var(--buddha-gold)]'
    }

    return (
        <div className="glass-card p-5 hover:scale-[1.02] transition-transform">
            <div className="flex items-center justify-between mb-3">
                <div className={`w-11 h-11 rounded-xl ${colorStyles[color]} flex items-center justify-center`}>
                    <Icon className={`w-5 h-5 ${iconColors[color]}`} />
                </div>
                {alert && (
                    <span className="text-xs bg-[var(--error)]/20 text-[var(--error)] px-2 py-1 rounded-full font-medium animate-pulse">
                        Alerta
                    </span>
                )}
                {trend && (
                    <span className={`flex items-center gap-1 text-xs font-medium ${trend === 'up' ? 'text-[var(--success)]' : 'text-[var(--error)]'}`}>
                        {trend === 'up' ? <ArrowUpRight className="w-3 h-3" /> : <ArrowDownRight className="w-3 h-3" />}
                        {subValue}
                    </span>
                )}
            </div>
            <p className="text-2xl font-bold text-white mb-0.5">{value}</p>
            <p className="text-sm text-[var(--text-muted)]">{label}</p>
        </div>
    )
}

export default async function AdminDashboardPage() {
    const stats = await getStats()
    const recentTickets = await getRecentTickets()

    // Calcular porcentajes para el gráfico de barras
    const totalActiveTickets = stats.pendientes + stats.enProceso + stats.listos
    const getPercentage = (count: number) => totalActiveTickets > 0 ? Math.round((count / totalActiveTickets) * 100) : 0

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                    <h1 className="heading-2 text-white mb-1">Dashboard</h1>
                    <p className="text-[var(--text-secondary)]">
                        Resumen del taller • {new Date().toLocaleDateString('es-UY', { weekday: 'long', day: 'numeric', month: 'long' })}
                    </p>
                </div>
                <Link href="/admin/tickets/nuevo" className="btn-premium">
                    <Wrench className="w-4 h-4" />
                    Nuevo Ticket
                </Link>
            </div>

            {/* Stats Grid - 2x3 on mobile, 3x2 on tablet, 6x1 on desktop */}
            <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-6 gap-4">
                <StatCard
                    icon={Clock}
                    label="Pendientes"
                    value={stats.pendientes}
                    color="warning"
                    alert={stats.pendientes > 5}
                />
                <StatCard
                    icon={Wrench}
                    label="En Proceso"
                    value={stats.enProceso}
                    color="info"
                />
                <StatCard
                    icon={CheckCircle}
                    label="Listos"
                    value={stats.listos}
                    color="success"
                />
                <StatCard
                    icon={AlertTriangle}
                    label="Urgentes"
                    value={stats.urgentes}
                    color="error"
                    alert={stats.urgentes > 0}
                />
                <StatCard
                    icon={DollarSign}
                    label="Ventas Hoy"
                    value={`$${stats.ventasHoy.toLocaleString()}`}
                    color="gold"
                />
                <StatCard
                    icon={Package}
                    label="Stock Bajo"
                    value={stats.lowStockCount}
                    color="error"
                    alert={stats.lowStockCount > 0}
                />
            </div>

            {/* Secondary Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <StatCard
                    icon={Ticket}
                    label="Total Tickets"
                    value={stats.total}
                    color="default"
                />
                <StatCard
                    icon={Users}
                    label="Clientes"
                    value={stats.clientesCount}
                    color="default"
                />
                <StatCard
                    icon={Star}
                    label="Membresías"
                    value={stats.membresiasActivas}
                    color="gold"
                />
                <StatCard
                    icon={TrendingUp}
                    label="Ingresos Totales"
                    value={`$${stats.ingresosTotal.toLocaleString()}`}
                    color="success"
                />
            </div>

            {/* Tickets por Estado - Gráfico de Barras */}
            {totalActiveTickets > 0 && (
                <div className="glass-card p-6">
                    <h2 className="text-lg font-semibold text-white mb-4">Distribución de Tickets Activos</h2>
                    <div className="flex h-4 rounded-full overflow-hidden bg-white/5">
                        {stats.pendientes > 0 && (
                            <div
                                className="bg-yellow-500 transition-all duration-500"
                                style={{ width: `${getPercentage(stats.pendientes)}%` }}
                                title={`Pendientes: ${stats.pendientes}`}
                            />
                        )}
                        {stats.enProceso > 0 && (
                            <div
                                className="bg-blue-500 transition-all duration-500"
                                style={{ width: `${getPercentage(stats.enProceso)}%` }}
                                title={`En Proceso: ${stats.enProceso}`}
                            />
                        )}
                        {stats.listos > 0 && (
                            <div
                                className="bg-green-500 transition-all duration-500"
                                style={{ width: `${getPercentage(stats.listos)}%` }}
                                title={`Listos: ${stats.listos}`}
                            />
                        )}
                    </div>
                    <div className="flex flex-wrap justify-center gap-4 mt-4 text-sm">
                        <div className="flex items-center gap-2">
                            <div className="w-3 h-3 rounded-full bg-yellow-500" />
                            <span className="text-[var(--text-muted)]">Pendientes ({stats.pendientes})</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <div className="w-3 h-3 rounded-full bg-blue-500" />
                            <span className="text-[var(--text-muted)]">En Proceso ({stats.enProceso})</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <div className="w-3 h-3 rounded-full bg-green-500" />
                            <span className="text-[var(--text-muted)]">Listos ({stats.listos})</span>
                        </div>
                    </div>
                </div>
            )}

            {/* Two Column Layout */}
            <div className="grid lg:grid-cols-3 gap-6">
                {/* Recent Tickets */}
                <div className="lg:col-span-2 glass-card p-6">
                    <div className="flex items-center justify-between mb-6">
                        <h2 className="text-lg font-semibold text-white">Tickets Recientes</h2>
                        <Link
                            href="/admin/tickets"
                            className="text-sm text-[var(--sp-red)] hover:text-[var(--sp-red-light)] transition-colors"
                        >
                            Ver todos →
                        </Link>
                    </div>

                    {recentTickets.length === 0 ? (
                        <div className="text-center py-12 text-[var(--text-muted)]">
                            <Ticket className="w-12 h-12 mx-auto mb-3 opacity-50" />
                            <p>No hay tickets todavía</p>
                            <Link href="/admin/tickets/nuevo" className="text-[var(--sp-red)] text-sm hover:underline mt-2 inline-block">
                                Crear primer ticket →
                            </Link>
                        </div>
                    ) : (
                        <div className="space-y-3">
                            {recentTickets.map((ticket: any) => (
                                <Link
                                    key={ticket.numero_ticket}
                                    href={`/admin/tickets/${ticket.numero_ticket}`}
                                    className="flex items-center gap-4 p-4 rounded-xl bg-white/5 hover:bg-white/10 transition-all hover:translate-x-1"
                                >
                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-center gap-2 mb-1">
                                            <span className="font-mono text-sm text-[var(--sp-red)]">
                                                {ticket.numero_ticket}
                                            </span>
                                            {ticket.prioridad === 'urgente' && (
                                                <span className="text-xs bg-[var(--error)]/20 text-[var(--error)] px-2 py-0.5 rounded-full animate-pulse">
                                                    Urgente
                                                </span>
                                            )}
                                        </div>
                                        <p className="text-white font-medium truncate">
                                            {ticket.marca} {ticket.modelo}
                                        </p>
                                        {ticket.cliente?.nombre && (
                                            <p className="text-xs text-[var(--text-muted)] truncate">
                                                {ticket.cliente.nombre}
                                            </p>
                                        )}
                                    </div>
                                    <span className={`text-xs px-3 py-1 rounded-full border ${STATUS_COLORS[ticket.estado]}`}>
                                        {STATUS_LABELS[ticket.estado]}
                                    </span>
                                </Link>
                            ))}
                        </div>
                    )}
                </div>

                {/* Quick Actions + Low Stock */}
                <div className="space-y-6">
                    {/* Quick Actions */}
                    <div className="glass-card p-6">
                        <h2 className="text-lg font-semibold text-white mb-4">Acciones Rápidas</h2>
                        <div className="space-y-2">
                            <Link
                                href="/admin/tickets/nuevo"
                                className="flex items-center gap-3 p-3 rounded-xl bg-[var(--sp-red)]/10 border border-[var(--sp-red)]/30 hover:bg-[var(--sp-red)]/20 transition-colors"
                            >
                                <Ticket className="w-5 h-5 text-[var(--sp-red)]" />
                                <span className="text-white font-medium">Nuevo Ticket</span>
                            </Link>
                            <Link
                                href="/admin/productos/nuevo"
                                className="flex items-center gap-3 p-3 rounded-xl bg-white/5 hover:bg-white/10 transition-colors"
                            >
                                <ShoppingBag className="w-5 h-5 text-[var(--text-secondary)]" />
                                <span className="text-white font-medium">Agregar Producto</span>
                            </Link>
                            <Link
                                href="/admin/inventario"
                                className="flex items-center gap-3 p-3 rounded-xl bg-white/5 hover:bg-white/10 transition-colors"
                            >
                                <Package className="w-5 h-5 text-[var(--text-secondary)]" />
                                <span className="text-white font-medium">Ver Inventario</span>
                            </Link>
                            <Link
                                href="/admin/clientes"
                                className="flex items-center gap-3 p-3 rounded-xl bg-white/5 hover:bg-white/10 transition-colors"
                            >
                                <Users className="w-5 h-5 text-[var(--text-secondary)]" />
                                <span className="text-white font-medium">Clientes</span>
                            </Link>
                        </div>
                    </div>

                    {/* Low Stock Alert */}
                    {stats.lowStockCount > 0 && (
                        <div className="glass-card p-6 border-[var(--error)]/30">
                            <div className="flex items-center gap-2 mb-4">
                                <AlertTriangle className="w-5 h-5 text-[var(--error)]" />
                                <h2 className="text-lg font-semibold text-white">Stock Bajo</h2>
                            </div>
                            <div className="space-y-2">
                                {stats.lowStockItems.map((item: any) => (
                                    <div key={item.id} className="flex items-center justify-between p-2 rounded-lg bg-[var(--error)]/5">
                                        <span className="text-sm text-white truncate flex-1">{item.nombre}</span>
                                        <span className="text-xs font-mono text-[var(--error)] ml-2">
                                            {item.stock_actual ?? item.stock} uds
                                        </span>
                                    </div>
                                ))}
                            </div>
                            <Link
                                href="/admin/inventario"
                                className="text-sm text-[var(--error)] hover:underline mt-3 inline-block"
                            >
                                Ver todo el inventario →
                            </Link>
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}

