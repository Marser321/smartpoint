'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import AdminSidebar from '@/components/admin/sidebar'
import { createClient } from '@/lib/supabase/client'
import {
    ArrowLeft, Smartphone, User, Wrench, CheckCircle, Loader2
} from 'lucide-react'
import Link from 'next/link'
import { DEVICE_BRANDS, COMMON_ISSUES } from '@/types/sat'

export default function NuevoTicketPage() {
    const router = useRouter()
    const [isLoading, setIsLoading] = useState(false)
    const [step, setStep] = useState(1)

    const [formData, setFormData] = useState({
        // Cliente
        nombre: '',
        telefono: '',
        email: '',
        // Dispositivo
        marca: '',
        modelo: '',
        color: '',
        imei: '',
        // Problema
        falla_reportada: '',
        es_mojado: false,
        prioridad: 'normal' as 'normal' | 'urgente',
        accesorios: '',
        notas_internas: '',
    })

    const updateField = (field: string, value: string | boolean) => {
        setFormData(prev => ({ ...prev, [field]: value }))
    }

    const handleSubmit = async () => {
        setIsLoading(true)
        try {
            const supabase = createClient()

            // Buscar o crear cliente
            let { data: cliente } = await supabase
                .from('clientes')
                .select('id')
                .eq('telefono', formData.telefono)
                .single()

            if (!cliente) {
                const { data: newCliente } = await supabase
                    .from('clientes')
                    .insert({
                        nombre: formData.nombre,
                        telefono: formData.telefono,
                        email: formData.email || null,
                    })
                    .select('id')
                    .single()
                cliente = newCliente
            }

            // Generar número de ticket
            const fecha = new Date()
            const prefix = `SP-${String(fecha.getDate()).padStart(2, '0')}${String(fecha.getMonth() + 1).padStart(2, '0')}`
            const random = Math.random().toString(36).substring(2, 6).toUpperCase()
            const numero_ticket = `${prefix}-${random}`

            // Crear ticket
            await supabase.from('tickets_reparacion').insert({
                numero_ticket,
                cliente_id: cliente?.id,
                marca: formData.marca,
                modelo: formData.modelo,
                color: formData.color,
                imei: formData.imei || null,
                falla_reportada: formData.falla_reportada,
                es_mojado: formData.es_mojado,
                prioridad: formData.es_mojado ? 'urgente' : formData.prioridad,
                accesorios_recibidos: formData.accesorios || null,
                estado: 'recepcion',
            })

            router.push('/admin/tickets')
            router.refresh()
        } catch (error) {
            console.error('Error creando ticket:', error)
            alert('Error al crear el ticket')
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <div className="min-h-screen bg-[var(--cod-gray)]">
            <AdminSidebar />
            <main className="lg:ml-72 pt-16 lg:pt-0">
                <div className="p-6 lg:p-8 max-w-3xl">
                    {/* Header */}
                    <div className="mb-8">
                        <Link
                            href="/admin/tickets"
                            className="inline-flex items-center gap-2 text-[var(--text-muted)] hover:text-white mb-4"
                        >
                            <ArrowLeft className="w-4 h-4" />
                            Volver a tickets
                        </Link>
                        <h1 className="heading-2 text-white">Nuevo Ticket</h1>
                    </div>

                    {/* Progress */}
                    <div className="flex items-center gap-2 mb-8">
                        {[1, 2, 3].map(s => (
                            <div key={s} className="flex-1 flex items-center gap-2">
                                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${step >= s
                                        ? 'bg-[var(--buddha-gold)] text-[var(--cod-gray)]'
                                        : 'bg-white/5 text-[var(--text-muted)]'
                                    }`}>
                                    {step > s ? <CheckCircle className="w-5 h-5" /> : s}
                                </div>
                                {s < 3 && <div className={`flex-1 h-0.5 ${step > s ? 'bg-[var(--buddha-gold)]' : 'bg-white/10'}`} />}
                            </div>
                        ))}
                    </div>

                    {/* Step 1: Cliente */}
                    {step === 1 && (
                        <div className="glass-card p-6">
                            <div className="flex items-center gap-3 mb-6">
                                <User className="w-6 h-6 text-[var(--buddha-gold)]" />
                                <h2 className="text-lg font-semibold text-white">Datos del Cliente</h2>
                            </div>
                            <div className="space-y-4">
                                <div>
                                    <label className="label block mb-2">Nombre *</label>
                                    <input
                                        type="text"
                                        value={formData.nombre}
                                        onChange={e => updateField('nombre', e.target.value)}
                                        className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-[var(--buddha-gold)]"
                                    />
                                </div>
                                <div className="grid sm:grid-cols-2 gap-4">
                                    <div>
                                        <label className="label block mb-2">Teléfono *</label>
                                        <input
                                            type="tel"
                                            value={formData.telefono}
                                            onChange={e => updateField('telefono', e.target.value)}
                                            className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-[var(--buddha-gold)]"
                                        />
                                    </div>
                                    <div>
                                        <label className="label block mb-2">Email</label>
                                        <input
                                            type="email"
                                            value={formData.email}
                                            onChange={e => updateField('email', e.target.value)}
                                            className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-[var(--buddha-gold)]"
                                        />
                                    </div>
                                </div>
                            </div>
                            <div className="mt-6 flex justify-end">
                                <button
                                    onClick={() => setStep(2)}
                                    disabled={!formData.nombre || !formData.telefono}
                                    className="btn-premium disabled:opacity-50"
                                >
                                    Siguiente
                                </button>
                            </div>
                        </div>
                    )}

                    {/* Step 2: Dispositivo */}
                    {step === 2 && (
                        <div className="glass-card p-6">
                            <div className="flex items-center gap-3 mb-6">
                                <Smartphone className="w-6 h-6 text-[var(--buddha-gold)]" />
                                <h2 className="text-lg font-semibold text-white">Dispositivo</h2>
                            </div>
                            <div className="space-y-4">
                                <div className="grid sm:grid-cols-2 gap-4">
                                    <div>
                                        <label className="label block mb-2">Marca *</label>
                                        <select
                                            value={formData.marca}
                                            onChange={e => updateField('marca', e.target.value)}
                                            className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-[var(--buddha-gold)]"
                                        >
                                            <option value="">Seleccionar</option>
                                            {DEVICE_BRANDS.map(b => (
                                                <option key={b} value={b}>{b}</option>
                                            ))}
                                        </select>
                                    </div>
                                    <div>
                                        <label className="label block mb-2">Modelo *</label>
                                        <input
                                            type="text"
                                            value={formData.modelo}
                                            onChange={e => updateField('modelo', e.target.value)}
                                            placeholder="Ej: iPhone 14 Pro"
                                            className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder:text-[var(--text-muted)] focus:outline-none focus:border-[var(--buddha-gold)]"
                                        />
                                    </div>
                                </div>
                                <div className="grid sm:grid-cols-2 gap-4">
                                    <div>
                                        <label className="label block mb-2">Color</label>
                                        <input
                                            type="text"
                                            value={formData.color}
                                            onChange={e => updateField('color', e.target.value)}
                                            className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-[var(--buddha-gold)]"
                                        />
                                    </div>
                                    <div>
                                        <label className="label block mb-2">IMEI</label>
                                        <input
                                            type="text"
                                            value={formData.imei}
                                            onChange={e => updateField('imei', e.target.value)}
                                            className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-[var(--buddha-gold)]"
                                        />
                                    </div>
                                </div>
                            </div>
                            <div className="mt-6 flex justify-between">
                                <button onClick={() => setStep(1)} className="btn-glass">Atrás</button>
                                <button
                                    onClick={() => setStep(3)}
                                    disabled={!formData.marca || !formData.modelo}
                                    className="btn-premium disabled:opacity-50"
                                >
                                    Siguiente
                                </button>
                            </div>
                        </div>
                    )}

                    {/* Step 3: Problema */}
                    {step === 3 && (
                        <div className="glass-card p-6">
                            <div className="flex items-center gap-3 mb-6">
                                <Wrench className="w-6 h-6 text-[var(--buddha-gold)]" />
                                <h2 className="text-lg font-semibold text-white">Problema</h2>
                            </div>
                            <div className="space-y-4">
                                <div>
                                    <label className="label block mb-2">Falla reportada *</label>
                                    <textarea
                                        value={formData.falla_reportada}
                                        onChange={e => updateField('falla_reportada', e.target.value)}
                                        placeholder="Describir el problema..."
                                        rows={4}
                                        className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder:text-[var(--text-muted)] focus:outline-none focus:border-[var(--buddha-gold)] resize-none"
                                    />
                                </div>
                                <div className="grid sm:grid-cols-2 gap-4">
                                    <label className="flex items-center gap-3 p-4 bg-white/5 rounded-xl cursor-pointer">
                                        <input
                                            type="checkbox"
                                            checked={formData.es_mojado}
                                            onChange={e => updateField('es_mojado', e.target.checked)}
                                            className="w-5 h-5 accent-[var(--buddha-gold)]"
                                        />
                                        <div>
                                            <p className="text-white font-medium">Equipo mojado</p>
                                            <p className="text-xs text-[var(--text-muted)]">Marca como urgente</p>
                                        </div>
                                    </label>
                                    <div>
                                        <label className="label block mb-2">Prioridad</label>
                                        <select
                                            value={formData.prioridad}
                                            onChange={e => updateField('prioridad', e.target.value)}
                                            className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-[var(--buddha-gold)]"
                                        >
                                            <option value="normal">Normal</option>
                                            <option value="urgente">Urgente (Express)</option>
                                        </select>
                                    </div>
                                </div>
                                <div>
                                    <label className="label block mb-2">Accesorios recibidos</label>
                                    <input
                                        type="text"
                                        value={formData.accesorios}
                                        onChange={e => updateField('accesorios', e.target.value)}
                                        placeholder="Ej: Funda, cargador"
                                        className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder:text-[var(--text-muted)] focus:outline-none focus:border-[var(--buddha-gold)]"
                                    />
                                </div>
                            </div>
                            <div className="mt-6 flex justify-between">
                                <button onClick={() => setStep(2)} className="btn-glass">Atrás</button>
                                <button
                                    onClick={handleSubmit}
                                    disabled={!formData.falla_reportada || isLoading}
                                    className="btn-premium disabled:opacity-50"
                                >
                                    {isLoading ? (
                                        <>
                                            <Loader2 className="w-5 h-5 animate-spin" />
                                            Creando...
                                        </>
                                    ) : (
                                        'Crear Ticket'
                                    )}
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </main>
        </div>
    )
}
