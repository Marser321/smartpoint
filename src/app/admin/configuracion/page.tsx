'use client'

import { useState } from 'react'
import AdminSidebar from '@/components/admin/sidebar'
import {
    Settings, Store, Bell, Palette, MessageSquare,
    Save, ExternalLink
} from 'lucide-react'

export default function ConfiguracionPage() {
    const [config, setConfig] = useState({
        nombreNegocio: 'Smart Point',
        telefono: '099 123 456',
        whatsapp: '59899123456',
        email: 'contacto@smartpoint.uy',
        direccion: 'Av. España 1234, Maldonado',
        horario: 'Lun-Sáb: 10:00 - 20:00',
        notificacionesWhatsapp: true,
        notificacionesEmail: false,
        envioGratisMinimo: 3000,
        costoEnvio: 250,
    })

    const updateConfig = (field: string, value: string | number | boolean) => {
        setConfig(prev => ({ ...prev, [field]: value }))
    }

    const handleSave = () => {
        // En producción: guardar en Supabase
        alert('Configuración guardada (demo)')
    }

    return (
        <div className="min-h-screen bg-[var(--cod-gray)]">
            <AdminSidebar />
            <main className="lg:ml-72 pt-16 lg:pt-0">
                <div className="p-6 lg:p-8 max-w-4xl">
                    {/* Header */}
                    <div className="mb-8">
                        <h1 className="heading-2 text-white mb-1">Configuración</h1>
                        <p className="text-[var(--text-muted)]">
                            Ajustes generales del negocio
                        </p>
                    </div>

                    <div className="space-y-6">
                        {/* Negocio */}
                        <div className="glass-card p-6">
                            <div className="flex items-center gap-3 mb-6">
                                <div className="w-10 h-10 rounded-xl bg-[var(--buddha-gold-10)] flex items-center justify-center">
                                    <Store className="w-5 h-5 text-[var(--buddha-gold)]" />
                                </div>
                                <div>
                                    <h2 className="text-lg font-semibold text-white">Datos del Negocio</h2>
                                    <p className="text-sm text-[var(--text-muted)]">Información de contacto</p>
                                </div>
                            </div>

                            <div className="grid sm:grid-cols-2 gap-4">
                                <div>
                                    <label className="label block mb-2">Nombre del negocio</label>
                                    <input
                                        type="text"
                                        value={config.nombreNegocio}
                                        onChange={e => updateConfig('nombreNegocio', e.target.value)}
                                        className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-[var(--buddha-gold)]"
                                    />
                                </div>
                                <div>
                                    <label className="label block mb-2">Teléfono</label>
                                    <input
                                        type="text"
                                        value={config.telefono}
                                        onChange={e => updateConfig('telefono', e.target.value)}
                                        className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-[var(--buddha-gold)]"
                                    />
                                </div>
                                <div>
                                    <label className="label block mb-2">WhatsApp (sin +)</label>
                                    <input
                                        type="text"
                                        value={config.whatsapp}
                                        onChange={e => updateConfig('whatsapp', e.target.value)}
                                        className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-[var(--buddha-gold)]"
                                    />
                                </div>
                                <div>
                                    <label className="label block mb-2">Email</label>
                                    <input
                                        type="email"
                                        value={config.email}
                                        onChange={e => updateConfig('email', e.target.value)}
                                        className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-[var(--buddha-gold)]"
                                    />
                                </div>
                                <div className="sm:col-span-2">
                                    <label className="label block mb-2">Dirección</label>
                                    <input
                                        type="text"
                                        value={config.direccion}
                                        onChange={e => updateConfig('direccion', e.target.value)}
                                        className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-[var(--buddha-gold)]"
                                    />
                                </div>
                                <div className="sm:col-span-2">
                                    <label className="label block mb-2">Horario de atención</label>
                                    <input
                                        type="text"
                                        value={config.horario}
                                        onChange={e => updateConfig('horario', e.target.value)}
                                        className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-[var(--buddha-gold)]"
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Notificaciones */}
                        <div className="glass-card p-6">
                            <div className="flex items-center gap-3 mb-6">
                                <div className="w-10 h-10 rounded-xl bg-[var(--buddha-gold-10)] flex items-center justify-center">
                                    <Bell className="w-5 h-5 text-[var(--buddha-gold)]" />
                                </div>
                                <div>
                                    <h2 className="text-lg font-semibold text-white">Notificaciones</h2>
                                    <p className="text-sm text-[var(--text-muted)]">Cómo notificar a clientes</p>
                                </div>
                            </div>

                            <div className="space-y-4">
                                <label className="flex items-center justify-between p-4 bg-white/5 rounded-xl cursor-pointer">
                                    <div className="flex items-center gap-3">
                                        <MessageSquare className="w-5 h-5 text-[var(--success)]" />
                                        <div>
                                            <p className="text-white font-medium">WhatsApp</p>
                                            <p className="text-sm text-[var(--text-muted)]">Notificar cambios de estado por WhatsApp</p>
                                        </div>
                                    </div>
                                    <input
                                        type="checkbox"
                                        checked={config.notificacionesWhatsapp}
                                        onChange={e => updateConfig('notificacionesWhatsapp', e.target.checked)}
                                        className="w-5 h-5 accent-[var(--buddha-gold)]"
                                    />
                                </label>
                                <label className="flex items-center justify-between p-4 bg-white/5 rounded-xl cursor-pointer">
                                    <div className="flex items-center gap-3">
                                        <ExternalLink className="w-5 h-5 text-[var(--info)]" />
                                        <div>
                                            <p className="text-white font-medium">Email</p>
                                            <p className="text-sm text-[var(--text-muted)]">Enviar resumen por email</p>
                                        </div>
                                    </div>
                                    <input
                                        type="checkbox"
                                        checked={config.notificacionesEmail}
                                        onChange={e => updateConfig('notificacionesEmail', e.target.checked)}
                                        className="w-5 h-5 accent-[var(--buddha-gold)]"
                                    />
                                </label>
                            </div>
                        </div>

                        {/* E-commerce */}
                        <div className="glass-card p-6">
                            <div className="flex items-center gap-3 mb-6">
                                <div className="w-10 h-10 rounded-xl bg-[var(--buddha-gold-10)] flex items-center justify-center">
                                    <Palette className="w-5 h-5 text-[var(--buddha-gold)]" />
                                </div>
                                <div>
                                    <h2 className="text-lg font-semibold text-white">E-commerce</h2>
                                    <p className="text-sm text-[var(--text-muted)]">Configuración de tienda</p>
                                </div>
                            </div>

                            <div className="grid sm:grid-cols-2 gap-4">
                                <div>
                                    <label className="label block mb-2">Envío gratis desde (UYU)</label>
                                    <input
                                        type="number"
                                        value={config.envioGratisMinimo}
                                        onChange={e => updateConfig('envioGratisMinimo', Number(e.target.value))}
                                        className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-[var(--buddha-gold)]"
                                    />
                                </div>
                                <div>
                                    <label className="label block mb-2">Costo de envío (UYU)</label>
                                    <input
                                        type="number"
                                        value={config.costoEnvio}
                                        onChange={e => updateConfig('costoEnvio', Number(e.target.value))}
                                        className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-[var(--buddha-gold)]"
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Save */}
                        <button onClick={handleSave} className="btn-premium w-full sm:w-auto">
                            <Save className="w-5 h-5" />
                            Guardar Cambios
                        </button>
                    </div>
                </div>
            </main>
        </div>
    )
}
