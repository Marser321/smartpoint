'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
    MessageCircle, Send, Clock, CheckCheck,
    AlertCircle, Settings, Phone, User,
    Bell, BellOff, RefreshCw, Smartphone
} from 'lucide-react'

// Apple easing
const appleEasing: [number, number, number, number] = [0.23, 1, 0.32, 1]

// Demo data - en producción viene de Supabase
const MENSAJES_ENVIADOS = [
    {
        id: '1',
        cliente: 'Juan Pérez',
        telefono: '+598 99 123 456',
        mensaje: 'Tu reparación de iPhone 13 pasó a estado: En Proceso',
        estado: 'entregado',
        fecha: '2026-02-02T10:30:00',
    },
    {
        id: '2',
        cliente: 'María García',
        telefono: '+598 99 654 321',
        mensaje: 'Tu reparación de Samsung S21 pasó a estado: Listo para Retirar',
        estado: 'entregado',
        fecha: '2026-02-02T09:15:00',
    },
    {
        id: '3',
        cliente: 'Carlos López',
        telefono: '+598 99 111 222',
        mensaje: 'Tu reparación de iPad Pro pasó a estado: Esperando Repuesto',
        estado: 'pendiente',
        fecha: '2026-02-02T08:45:00',
    },
]

const TEMPLATES = [
    {
        id: 'estado_proceso',
        nombre: 'En Proceso',
        mensaje: 'Hola {{nombre}}, tu reparación de {{dispositivo}} pasó a estado: En Proceso. Te avisamos cuando esté lista.',
        activo: true
    },
    {
        id: 'estado_listo',
        nombre: 'Listo para Retirar',
        mensaje: 'Hola {{nombre}}, tu {{dispositivo}} ya está listo. Pasá a retirarlo en Smart Point. 📱✨',
        activo: true
    },
    {
        id: 'estado_repuesto',
        nombre: 'Esperando Repuesto',
        mensaje: 'Hola {{nombre}}, estamos esperando el repuesto para tu {{dispositivo}}. Te avisamos cuando llegue.',
        activo: true
    },
    {
        id: 'recordatorio',
        nombre: 'Recordatorio Retiro',
        mensaje: 'Hola {{nombre}}, recordá que tu {{dispositivo}} está listo en Smart Point. ¡Te esperamos!',
        activo: false
    },
]

const estadoConfig = {
    entregado: { label: 'Entregado', color: 'text-green-400', icon: CheckCheck },
    pendiente: { label: 'Pendiente', color: 'text-yellow-400', icon: Clock },
    error: { label: 'Error', color: 'text-red-400', icon: AlertCircle },
}

export default function NotificacionesPage() {
    const [mounted, setMounted] = useState(false)
    const [templates, setTemplates] = useState(TEMPLATES)
    const [activeTab, setActiveTab] = useState<'historial' | 'templates'>('historial')

    useEffect(() => {
        setMounted(true)
    }, [])

    if (!mounted) return null

    const toggleTemplate = (id: string) => {
        setTemplates(prev =>
            prev.map(t => t.id === id ? { ...t, activo: !t.activo } : t)
        )
    }

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
                    <h1 className="text-2xl font-bold text-white">Notificaciones WhatsApp</h1>
                    <p className="text-white/50 mt-1">Mensajes automáticos a clientes</p>
                </div>
                <div className="flex items-center gap-2 text-sm">
                    <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
                    <span className="text-green-400">WhatsApp Conectado</span>
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
                        <div className="w-10 h-10 rounded-xl bg-green-500/10 flex items-center justify-center">
                            <Send className="w-5 h-5 text-green-400" />
                        </div>
                        <span className="text-white/50 text-sm">Enviados Hoy</span>
                    </div>
                    <p className="text-2xl font-bold text-white">24</p>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2, duration: 0.5, ease: appleEasing }}
                    className="p-5 rounded-2xl bg-white/[0.02] border border-white/[0.05]"
                >
                    <div className="flex items-center gap-3 mb-2">
                        <div className="w-10 h-10 rounded-xl bg-blue-500/10 flex items-center justify-center">
                            <CheckCheck className="w-5 h-5 text-blue-400" />
                        </div>
                        <span className="text-white/50 text-sm">Tasa Entrega</span>
                    </div>
                    <p className="text-2xl font-bold text-blue-400">98%</p>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3, duration: 0.5, ease: appleEasing }}
                    className="p-5 rounded-2xl bg-white/[0.02] border border-white/[0.05]"
                >
                    <div className="flex items-center gap-3 mb-2">
                        <div className="w-10 h-10 rounded-xl bg-purple-500/10 flex items-center justify-center">
                            <MessageCircle className="w-5 h-5 text-purple-400" />
                        </div>
                        <span className="text-white/50 text-sm">Este Mes</span>
                    </div>
                    <p className="text-2xl font-bold text-purple-400">312</p>
                </motion.div>
            </div>

            {/* Tabs */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4, duration: 0.5, ease: appleEasing }}
                className="flex gap-2"
            >
                <button
                    onClick={() => setActiveTab('historial')}
                    className={`
                        px-4 py-2 rounded-xl font-medium text-sm
                        transition-all duration-300
                        ${activeTab === 'historial'
                            ? 'bg-[var(--sp-red)] text-white'
                            : 'bg-white/5 text-white/70 hover:bg-white/10'
                        }
                    `}
                >
                    Historial
                </button>
                <button
                    onClick={() => setActiveTab('templates')}
                    className={`
                        px-4 py-2 rounded-xl font-medium text-sm
                        transition-all duration-300
                        ${activeTab === 'templates'
                            ? 'bg-[var(--sp-red)] text-white'
                            : 'bg-white/5 text-white/70 hover:bg-white/10'
                        }
                    `}
                >
                    Templates
                </button>
            </motion.div>

            {/* Content */}
            <AnimatePresence mode="wait">
                {activeTab === 'historial' ? (
                    <motion.div
                        key="historial"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        transition={{ duration: 0.3, ease: appleEasing }}
                        className="space-y-4"
                    >
                        {MENSAJES_ENVIADOS.map((mensaje, i) => {
                            const config = estadoConfig[mensaje.estado as keyof typeof estadoConfig]
                            const StatusIcon = config.icon
                            const fecha = new Date(mensaje.fecha)

                            return (
                                <motion.div
                                    key={mensaje.id}
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: i * 0.1 }}
                                    className="
                                        p-4 rounded-2xl
                                        bg-white/[0.02] border border-white/[0.05]
                                        hover:bg-white/[0.04] transition-colors
                                    "
                                >
                                    <div className="flex items-start gap-4">
                                        <div className="w-10 h-10 rounded-xl bg-green-500/10 flex items-center justify-center flex-shrink-0">
                                            <MessageCircle className="w-5 h-5 text-green-400" />
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <div className="flex items-center gap-2 mb-1">
                                                <span className="font-medium text-white">{mensaje.cliente}</span>
                                                <span className="text-sm text-white/40">{mensaje.telefono}</span>
                                            </div>
                                            <p className="text-white/70 text-sm mb-2">{mensaje.mensaje}</p>
                                            <div className="flex items-center gap-4 text-xs">
                                                <span className={`flex items-center gap-1 ${config.color}`}>
                                                    <StatusIcon className="w-3 h-3" />
                                                    {config.label}
                                                </span>
                                                <span className="text-white/40">
                                                    {fecha.toLocaleTimeString('es-UY', { hour: '2-digit', minute: '2-digit' })}
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                </motion.div>
                            )
                        })}
                    </motion.div>
                ) : (
                    <motion.div
                        key="templates"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        transition={{ duration: 0.3, ease: appleEasing }}
                        className="space-y-4"
                    >
                        {templates.map((template, i) => (
                            <motion.div
                                key={template.id}
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: i * 0.1 }}
                                className="
                                    p-4 rounded-2xl
                                    bg-white/[0.02] border border-white/[0.05]
                                "
                            >
                                <div className="flex items-start justify-between gap-4">
                                    <div className="flex-1">
                                        <div className="flex items-center gap-2 mb-2">
                                            <h3 className="font-medium text-white">{template.nombre}</h3>
                                            <span className={`
                                                px-2 py-0.5 rounded-full text-xs
                                                ${template.activo
                                                    ? 'bg-green-500/10 text-green-400'
                                                    : 'bg-white/5 text-white/40'
                                                }
                                            `}>
                                                {template.activo ? 'Activo' : 'Inactivo'}
                                            </span>
                                        </div>
                                        <p className="text-sm text-white/60 bg-white/5 p-3 rounded-lg font-mono">
                                            {template.mensaje}
                                        </p>
                                    </div>
                                    <button
                                        onClick={() => toggleTemplate(template.id)}
                                        className={`
                                            p-2 rounded-lg transition-colors
                                            ${template.activo
                                                ? 'bg-green-500/10 text-green-400 hover:bg-green-500/20'
                                                : 'bg-white/5 text-white/40 hover:bg-white/10'
                                            }
                                        `}
                                    >
                                        {template.activo ? <Bell className="w-5 h-5" /> : <BellOff className="w-5 h-5" />}
                                    </button>
                                </div>
                            </motion.div>
                        ))}

                        {/* Info */}
                        <div className="p-4 rounded-xl bg-blue-500/10 border border-blue-500/30">
                            <p className="text-sm text-blue-400">
                                <strong>Variables disponibles:</strong> {'{{nombre}}'}, {'{{dispositivo}}'}, {'{{estado}}'}, {'{{ticket}}'}
                            </p>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    )
}
