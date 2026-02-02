'use client'

import { useState } from 'react'
import Header from '@/components/layout/header'
import Footer from '@/components/layout/footer'
import { motion } from 'framer-motion'
import { Search, Loader2, Package, Clock, CheckCircle, Wrench, AlertTriangle } from 'lucide-react'
import { STATUS_CONFIG, type TicketStatus } from '@/types/sat'
import { createClient } from '@/lib/supabase/client'
import { formatDate } from '@/lib/utils'

interface TicketInfo {
    numero_ticket: string
    marca: string
    modelo: string
    estado: TicketStatus
    prioridad: string
    falla_reportada: string
    diagnostico?: string
    presupuesto?: number
    fecha_ingreso: string
    fecha_listo?: string
    historial: Array<{
        estado_nuevo: string
        created_at: string
    }>
}

export default function EstadoReparacionPage() {
    const [ticketNumber, setTicketNumber] = useState('')
    const [isSearching, setIsSearching] = useState(false)
    const [ticket, setTicket] = useState<TicketInfo | null>(null)
    const [notFound, setNotFound] = useState(false)

    const handleSearch = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!ticketNumber.trim()) return

        setIsSearching(true)
        setNotFound(false)
        setTicket(null)

        try {
            const supabase = createClient()

            // Buscar ticket
            const { data: ticketData, error } = await supabase
                .from('tickets_reparacion')
                .select(`
          numero_ticket,
          marca,
          modelo,
          estado,
          prioridad,
          falla_reportada,
          diagnostico,
          presupuesto,
          fecha_ingreso,
          fecha_listo
        `)
                .eq('numero_ticket', ticketNumber.toUpperCase())
                .single()

            if (error || !ticketData) {
                setNotFound(true)
                return
            }

            // Buscar historial
            const { data: historialData } = await supabase
                .from('historial_estados')
                .select('estado_nuevo, created_at')
                .eq('ticket_id', ticketData.numero_ticket)
                .order('created_at', { ascending: false })

            setTicket({
                ...ticketData,
                historial: historialData || []
            } as TicketInfo)
        } catch (error) {
            console.error('Error buscando ticket:', error)
            setNotFound(true)
        } finally {
            setIsSearching(false)
        }
    }

    const getStatusIcon = (status: TicketStatus) => {
        switch (status) {
            case 'recepcion': return Package
            case 'diagnostico': return Search
            case 'espera_repuesto': return Clock
            case 'en_mesa': return Wrench
            case 'listo': return CheckCircle
            case 'entregado': return CheckCircle
            case 'rechazado': return AlertTriangle
            default: return Package
        }
    }

    return (
        <>
            <Header />
            <main className="min-h-screen pt-28 pb-16">
                <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
                    {/* Header */}
                    <div className="text-center mb-12">
                        <h1 className="heading-1 mb-4">
                            Estado de tu{' '}
                            <span className="text-gradient-gold">reparación</span>
                        </h1>
                        <p className="body-large">
                            Ingresá tu número de ticket para ver el estado actual de tu equipo.
                        </p>
                    </div>

                    {/* Search Form */}
                    <form onSubmit={handleSearch} className="mb-12">
                        <div className="glass-card p-2 flex gap-2">
                            <input
                                type="text"
                                value={ticketNumber}
                                onChange={e => setTicketNumber(e.target.value)}
                                placeholder="Ej: SP-2602-0001"
                                className="flex-1 bg-transparent px-4 py-3 text-white placeholder:text-[var(--text-muted)] focus:outline-none text-lg font-mono"
                            />
                            <button
                                type="submit"
                                disabled={isSearching || !ticketNumber.trim()}
                                className="btn-premium px-6 disabled:opacity-50"
                            >
                                {isSearching ? (
                                    <Loader2 className="w-5 h-5 animate-spin" />
                                ) : (
                                    <>
                                        <Search className="w-5 h-5" />
                                        <span className="hidden sm:inline">Buscar</span>
                                    </>
                                )}
                            </button>
                        </div>
                    </form>

                    {/* Not Found */}
                    {notFound && (
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="glass-card p-8 text-center"
                        >
                            <div className="w-16 h-16 rounded-full bg-[var(--warning-bg)] border border-[var(--warning)]/30 flex items-center justify-center mx-auto mb-4">
                                <AlertTriangle className="w-8 h-8 text-[var(--warning)]" />
                            </div>
                            <h2 className="heading-3 text-white mb-2">Ticket no encontrado</h2>
                            <p className="text-[var(--text-secondary)]">
                                No encontramos un ticket con ese número. Verificá que esté escrito correctamente
                                o contactanos si tenés dudas.
                            </p>
                        </motion.div>
                    )}

                    {/* Ticket Result */}
                    {ticket && (
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="space-y-6"
                        >
                            {/* Status Card */}
                            <div className="glass-card-elevated p-8">
                                <div className="flex items-start justify-between mb-6">
                                    <div>
                                        <p className="text-[var(--text-muted)] text-sm">Ticket</p>
                                        <p className="text-2xl font-bold font-mono text-white">{ticket.numero_ticket}</p>
                                    </div>
                                    {ticket.prioridad === 'urgente' && (
                                        <span className="badge-premium text-xs">Express</span>
                                    )}
                                </div>

                                {/* Current Status */}
                                <div className={`${STATUS_CONFIG[ticket.estado].bgClass} rounded-xl p-6 border`}>
                                    <div className="flex items-center gap-4">
                                        {(() => {
                                            const IconComponent = getStatusIcon(ticket.estado)
                                            return (
                                                <div className="w-14 h-14 rounded-full bg-white/10 flex items-center justify-center">
                                                    <IconComponent className="w-7 h-7" />
                                                </div>
                                            )
                                        })()}
                                        <div>
                                            <p className="text-xl font-bold">{STATUS_CONFIG[ticket.estado].label}</p>
                                            <p className="text-sm opacity-80">{STATUS_CONFIG[ticket.estado].description}</p>
                                        </div>
                                    </div>
                                </div>

                                {/* Device Info */}
                                <div className="mt-6 grid grid-cols-2 gap-4">
                                    <div>
                                        <p className="text-[var(--text-muted)] text-sm">Dispositivo</p>
                                        <p className="text-white font-medium">{ticket.marca} {ticket.modelo}</p>
                                    </div>
                                    <div>
                                        <p className="text-[var(--text-muted)] text-sm">Fecha de ingreso</p>
                                        <p className="text-white font-medium">{formatDate(ticket.fecha_ingreso)}</p>
                                    </div>
                                    <div className="col-span-2">
                                        <p className="text-[var(--text-muted)] text-sm">Problema reportado</p>
                                        <p className="text-white">{ticket.falla_reportada}</p>
                                    </div>
                                    {ticket.diagnostico && (
                                        <div className="col-span-2">
                                            <p className="text-[var(--text-muted)] text-sm">Diagnóstico</p>
                                            <p className="text-white">{ticket.diagnostico}</p>
                                        </div>
                                    )}
                                    {ticket.presupuesto && (
                                        <div className="col-span-2">
                                            <p className="text-[var(--text-muted)] text-sm">Presupuesto</p>
                                            <p className="text-2xl font-bold text-gradient-gold">
                                                ${ticket.presupuesto.toLocaleString('es-UY')}
                                            </p>
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Timeline */}
                            {ticket.historial.length > 0 && (
                                <div className="glass-card p-6">
                                    <h3 className="font-semibold text-white mb-4">Historial de estados</h3>
                                    <div className="space-y-4">
                                        {ticket.historial.map((item, idx) => (
                                            <div key={idx} className="flex items-center gap-4">
                                                <div className="w-3 h-3 rounded-full bg-[var(--buddha-gold)]" />
                                                <div className="flex-1">
                                                    <p className="text-white text-sm">
                                                        {STATUS_CONFIG[item.estado_nuevo as TicketStatus]?.label || item.estado_nuevo}
                                                    </p>
                                                    <p className="text-[var(--text-muted)] text-xs">
                                                        {formatDate(item.created_at)}
                                                    </p>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* Actions */}
                            {ticket.estado === 'listo' && (
                                <div className="glass-card p-6 bg-[var(--success-bg)] border-[var(--success)]/30">
                                    <p className="text-[var(--success)] font-semibold mb-2">
                                        🎉 ¡Tu equipo está listo!
                                    </p>
                                    <p className="text-[var(--text-secondary)] text-sm mb-4">
                                        Podés pasar a retirarlo de Lunes a Sábado de 10:00 a 20:00 hs.
                                    </p>
                                    <a
                                        href={`https://wa.me/59899123456?text=Hola! Quiero coordinar el retiro de mi equipo, ticket ${ticket.numero_ticket}`}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="btn-premium w-full justify-center"
                                    >
                                        Coordinar Retiro
                                    </a>
                                </div>
                            )}
                        </motion.div>
                    )}

                    {/* Help */}
                    <div className="mt-12 text-center text-[var(--text-muted)]">
                        <p>¿No encontrás tu ticket o tenés dudas?</p>
                        <a
                            href="https://wa.me/59899123456"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-[var(--buddha-gold)] hover:underline"
                        >
                            Contactanos por WhatsApp
                        </a>
                    </div>
                </div>
            </main >
            <Footer />
        </>
    )
}
