'use client'

import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Bell, X, Ticket, Package, Users, AlertTriangle, CheckCircle } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'

interface Notification {
    id: string
    type: 'ticket' | 'stock' | 'cliente' | 'venta'
    title: string
    message: string
    timestamp: Date
    read: boolean
}

export default function AdminNotifications() {
    const [notifications, setNotifications] = useState<Notification[]>([])
    const [isOpen, setIsOpen] = useState(false)
    const [unreadCount, setUnreadCount] = useState(0)

    useEffect(() => {
        const supabase = createClient()

        // Escuchar nuevos tickets
        const ticketsChannel = supabase
            .channel('new_tickets')
            .on(
                'postgres_changes',
                {
                    event: 'INSERT',
                    schema: 'public',
                    table: 'tickets_reparacion'
                },
                (payload) => {
                    const ticket = payload.new as any
                    addNotification({
                        type: 'ticket',
                        title: 'Nuevo Ticket',
                        message: `${ticket.marca} ${ticket.modelo} - ${ticket.numero_ticket}`
                    })
                }
            )
            .subscribe()

        // Escuchar cambios de stock bajo
        const stockChannel = supabase
            .channel('low_stock')
            .on(
                'postgres_changes',
                {
                    event: 'UPDATE',
                    schema: 'public',
                    table: 'inventario'
                },
                (payload) => {
                    const item = payload.new as any
                    if (item.stock_actual <= 5 && item.activo) {
                        addNotification({
                            type: 'stock',
                            title: 'Stock Bajo',
                            message: `${item.nombre} tiene solo ${item.stock_actual} unidades`
                        })
                    }
                }
            )
            .subscribe()

        // Escuchar tickets listos
        const readyChannel = supabase
            .channel('ready_tickets')
            .on(
                'postgres_changes',
                {
                    event: 'UPDATE',
                    schema: 'public',
                    table: 'tickets_reparacion',
                    filter: 'estado=eq.listo'
                },
                (payload) => {
                    const ticket = payload.new as any
                    if (payload.old && (payload.old as any).estado !== 'listo') {
                        addNotification({
                            type: 'ticket',
                            title: 'Ticket Listo',
                            message: `${ticket.numero_ticket} está listo para retirar`
                        })
                    }
                }
            )
            .subscribe()

        return () => {
            supabase.removeChannel(ticketsChannel)
            supabase.removeChannel(stockChannel)
            supabase.removeChannel(readyChannel)
        }
    }, [])

    const addNotification = ({ type, title, message }: Omit<Notification, 'id' | 'timestamp' | 'read'>) => {
        const newNotification: Notification = {
            id: `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
            type,
            title,
            message,
            timestamp: new Date(),
            read: false
        }

        setNotifications(prev => [newNotification, ...prev].slice(0, 20))
        setUnreadCount(prev => prev + 1)

        // Auto-cerrar después de 5 segundos si no está abierto el panel
        setTimeout(() => {
            setNotifications(prev =>
                prev.map(n => n.id === newNotification.id ? { ...n, read: true } : n)
            )
        }, 10000)
    }

    const markAllAsRead = () => {
        setNotifications(prev => prev.map(n => ({ ...n, read: true })))
        setUnreadCount(0)
    }

    const clearNotification = (id: string) => {
        setNotifications(prev => prev.filter(n => n.id !== id))
    }

    const getIcon = (type: Notification['type']) => {
        switch (type) {
            case 'ticket':
                return <Ticket className="w-4 h-4" />
            case 'stock':
                return <Package className="w-4 h-4" />
            case 'cliente':
                return <Users className="w-4 h-4" />
            case 'venta':
                return <CheckCircle className="w-4 h-4" />
            default:
                return <AlertTriangle className="w-4 h-4" />
        }
    }

    const getIconColor = (type: Notification['type']) => {
        switch (type) {
            case 'ticket':
                return 'text-[var(--info)] bg-[var(--info-bg)]'
            case 'stock':
                return 'text-[var(--error)] bg-[var(--error-bg)]'
            case 'cliente':
                return 'text-[var(--success)] bg-[var(--success-bg)]'
            case 'venta':
                return 'text-[var(--buddha-gold)] bg-[var(--buddha-gold-10)]'
            default:
                return 'text-white bg-white/10'
        }
    }

    return (
        <div className="relative">
            {/* Bell Button */}
            <motion.button
                onClick={() => {
                    setIsOpen(!isOpen)
                    if (!isOpen) markAllAsRead()
                }}
                whileTap={{ scale: 0.95 }}
                className="relative p-2 rounded-xl bg-white/5 hover:bg-white/10 transition-colors"
            >
                <Bell className="w-5 h-5 text-white/70" />
                <AnimatePresence>
                    {unreadCount > 0 && (
                        <motion.span
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            exit={{ scale: 0 }}
                            className="absolute -top-1 -right-1 w-5 h-5 bg-[var(--sp-red)] text-white text-xs font-bold rounded-full flex items-center justify-center"
                        >
                            {unreadCount > 9 ? '9+' : unreadCount}
                        </motion.span>
                    )}
                </AnimatePresence>
            </motion.button>

            {/* Notifications Panel */}
            <AnimatePresence>
                {isOpen && (
                    <>
                        {/* Backdrop */}
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setIsOpen(false)}
                            className="fixed inset-0 z-40"
                        />

                        {/* Panel */}
                        <motion.div
                            initial={{ opacity: 0, y: 10, scale: 0.95 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            exit={{ opacity: 0, y: 10, scale: 0.95 }}
                            transition={{ duration: 0.2 }}
                            className="absolute right-0 top-full mt-2 w-80 sm:w-96 max-h-[70vh] overflow-hidden z-50
                                bg-[var(--cod-gray-light)]/95 backdrop-blur-xl rounded-2xl
                                border border-white/10 shadow-2xl"
                        >
                            {/* Header */}
                            <div className="flex items-center justify-between p-4 border-b border-white/5">
                                <h3 className="font-semibold text-white">Notificaciones</h3>
                                {notifications.length > 0 && (
                                    <button
                                        onClick={markAllAsRead}
                                        className="text-xs text-[var(--sp-red)] hover:underline"
                                    >
                                        Marcar todas como leídas
                                    </button>
                                )}
                            </div>

                            {/* Notifications List */}
                            <div className="max-h-[50vh] overflow-y-auto">
                                {notifications.length === 0 ? (
                                    <div className="p-8 text-center text-[var(--text-muted)]">
                                        <Bell className="w-8 h-8 mx-auto mb-2 opacity-50" />
                                        <p className="text-sm">Sin notificaciones</p>
                                    </div>
                                ) : (
                                    <div className="p-2 space-y-1">
                                        {notifications.map((notification) => (
                                            <motion.div
                                                key={notification.id}
                                                initial={{ opacity: 0, x: -20 }}
                                                animate={{ opacity: 1, x: 0 }}
                                                exit={{ opacity: 0, x: 20 }}
                                                className={`
                                                    flex items-start gap-3 p-3 rounded-xl transition-colors
                                                    ${notification.read ? 'bg-white/0' : 'bg-white/5'}
                                                    hover:bg-white/10 group
                                                `}
                                            >
                                                <div className={`p-2 rounded-lg ${getIconColor(notification.type)}`}>
                                                    {getIcon(notification.type)}
                                                </div>
                                                <div className="flex-1 min-w-0">
                                                    <p className="text-sm font-medium text-white">
                                                        {notification.title}
                                                    </p>
                                                    <p className="text-xs text-[var(--text-muted)] truncate">
                                                        {notification.message}
                                                    </p>
                                                    <p className="text-xs text-[var(--text-muted)] mt-1">
                                                        {notification.timestamp.toLocaleTimeString('es-UY', {
                                                            hour: '2-digit',
                                                            minute: '2-digit'
                                                        })}
                                                    </p>
                                                </div>
                                                <button
                                                    onClick={() => clearNotification(notification.id)}
                                                    className="p-1 rounded opacity-0 group-hover:opacity-100 hover:bg-white/10 transition-all"
                                                >
                                                    <X className="w-4 h-4 text-[var(--text-muted)]" />
                                                </button>
                                            </motion.div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>
        </div>
    )
}
