'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import {
    Smartphone, ChevronRight, ChevronLeft,
    AlertTriangle, Check, Loader2
} from 'lucide-react'
import {
    DEVICE_BRANDS,
    COMMON_ISSUES,
    type SolicitudReparacionForm
} from '@/types/sat'
import { staggerContainer, staggerItem, viewportOnce } from '@/lib/animations'
import { createClient } from '@/lib/supabase/client'

type Step = 'device' | 'issue' | 'contact' | 'confirm'

const STEPS: { id: Step; title: string }[] = [
    { id: 'device', title: 'Dispositivo' },
    { id: 'issue', title: 'Problema' },
    { id: 'contact', title: 'Contacto' },
    { id: 'confirm', title: 'Confirmar' },
]

export default function TicketForm() {
    const [currentStep, setCurrentStep] = useState<Step>('device')
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [submitSuccess, setSubmitSuccess] = useState(false)
    const [ticketNumber, setTicketNumber] = useState<string | null>(null)

    const [formData, setFormData] = useState<SolicitudReparacionForm>({
        nombre: '',
        telefono: '',
        email: '',
        marca: '',
        modelo: '',
        color: '',
        falla_id: '',
        descripcion_adicional: '',
        es_urgente: false,
        es_mojado: false,
    })

    const updateField = <K extends keyof SolicitudReparacionForm>(
        field: K,
        value: SolicitudReparacionForm[K]
    ) => {
        setFormData(prev => ({ ...prev, [field]: value }))
    }

    const currentStepIndex = STEPS.findIndex(s => s.id === currentStep)

    const canProceed = (): boolean => {
        switch (currentStep) {
            case 'device':
                return !!formData.marca && !!formData.modelo
            case 'issue':
                return !!formData.falla_id
            case 'contact':
                return !!formData.nombre && !!formData.telefono && formData.telefono.length >= 8
            default:
                return true
        }
    }

    const nextStep = () => {
        const idx = currentStepIndex
        if (idx < STEPS.length - 1) {
            setCurrentStep(STEPS[idx + 1].id)
        }
    }

    const prevStep = () => {
        const idx = currentStepIndex
        if (idx > 0) {
            setCurrentStep(STEPS[idx - 1].id)
        }
    }

    const handleSubmit = async () => {
        setIsSubmitting(true)

        try {
            const supabase = createClient()

            // Primero crear o buscar cliente
            const { data: existingClient } = await supabase
                .from('clientes')
                .select('id')
                .eq('telefono', formData.telefono)
                .single()

            let clienteId: string

            if (existingClient) {
                clienteId = existingClient.id
            } else {
                const { data: newClient, error: clientError } = await supabase
                    .from('clientes')
                    .insert({
                        nombre: formData.nombre,
                        telefono: formData.telefono,
                        email: formData.email || null,
                    })
                    .select('id')
                    .single()

                if (clientError) throw clientError
                clienteId = newClient.id
            }

            // Crear ticket
            const fallaInfo = COMMON_ISSUES.find(i => i.id === formData.falla_id)
            const fallaReportada = fallaInfo
                ? `${fallaInfo.label}${formData.descripcion_adicional ? '. ' + formData.descripcion_adicional : ''}`
                : formData.descripcion_adicional || 'Sin descripción'

            const { data: ticket, error: ticketError } = await supabase
                .from('tickets_reparacion')
                .insert({
                    cliente_id: clienteId,
                    marca: formData.marca,
                    modelo: formData.modelo,
                    color: formData.color || null,
                    falla_reportada: fallaReportada,
                    prioridad: formData.es_urgente || formData.es_mojado ? 'urgente' : 'normal',
                    estado: 'recepcion',
                })
                .select('numero_ticket')
                .single()

            if (ticketError) throw ticketError

            setTicketNumber(ticket.numero_ticket)
            setSubmitSuccess(true)
        } catch (error) {
            console.error('Error al crear ticket:', error)
            alert('Hubo un error al crear tu solicitud. Por favor intentá de nuevo.')
        } finally {
            setIsSubmitting(false)
        }
    }

    if (submitSuccess && ticketNumber) {
        return (
            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="glass-card-elevated p-8 text-center max-w-lg mx-auto"
            >
                <div className="w-20 h-20 rounded-full bg-[var(--success-bg)] border border-[var(--success)]/30 flex items-center justify-center mx-auto mb-6">
                    <Check className="w-10 h-10 text-[var(--success)]" />
                </div>
                <h2 className="heading-2 text-white mb-2">¡Solicitud Creada!</h2>
                <p className="body-large mb-6">
                    Tu número de ticket es:
                </p>
                <div className="bg-[var(--cod-gray)] rounded-xl p-4 mb-6">
                    <p className="text-3xl font-bold text-gradient-gold font-mono">
                        {ticketNumber}
                    </p>
                </div>
                <p className="text-[var(--text-secondary)] mb-6">
                    Guardá este número para consultar el estado de tu reparación.
                    Te contactaremos pronto para coordinar la recepción de tu equipo.
                </p>
                <a
                    href={`https://wa.me/59899123456?text=Hola! Acabo de crear el ticket ${ticketNumber}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn-premium w-full justify-center"
                >
                    Contactar por WhatsApp
                </a>
            </motion.div>
        )
    }

    return (
        <div className="max-w-2xl mx-auto">
            {/* Progress Steps */}
            <div className="flex items-center justify-between mb-8">
                {STEPS.map((step, idx) => (
                    <div key={step.id} className="flex items-center">
                        <div className={`
              w-10 h-10 rounded-full flex items-center justify-center text-sm font-semibold transition-all
              ${idx < currentStepIndex
                                ? 'bg-[var(--buddha-gold)] text-[var(--cod-gray)]'
                                : idx === currentStepIndex
                                    ? 'bg-[var(--buddha-gold-20)] border-2 border-[var(--buddha-gold)] text-[var(--buddha-gold)]'
                                    : 'bg-white/5 text-[var(--text-muted)]'
                            }
            `}>
                            {idx < currentStepIndex ? <Check className="w-5 h-5" /> : idx + 1}
                        </div>
                        <span className={`ml-2 text-sm hidden sm:block ${idx === currentStepIndex ? 'text-white' : 'text-[var(--text-muted)]'
                            }`}>
                            {step.title}
                        </span>
                        {idx < STEPS.length - 1 && (
                            <div className={`w-8 sm:w-16 h-0.5 mx-2 ${idx < currentStepIndex ? 'bg-[var(--buddha-gold)]' : 'bg-white/10'
                                }`} />
                        )}
                    </div>
                ))}
            </div>

            {/* Form Card */}
            <motion.div
                key={currentStep}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
                className="glass-card p-6 sm:p-8"
            >
                {/* Step: Device */}
                {currentStep === 'device' && (
                    <div>
                        <h3 className="heading-3 text-white mb-2">¿Qué dispositivo necesita reparación?</h3>
                        <p className="text-[var(--text-secondary)] mb-6">
                            Seleccioná la marca y escribí el modelo de tu equipo.
                        </p>

                        <div className="space-y-6">
                            {/* Marca */}
                            <div>
                                <label className="label block mb-3">Marca</label>
                                <div className="grid grid-cols-3 sm:grid-cols-5 gap-2">
                                    {DEVICE_BRANDS.map(brand => (
                                        <button
                                            key={brand}
                                            type="button"
                                            onClick={() => updateField('marca', brand)}
                                            className={`p-3 rounded-xl text-sm font-medium transition-all ${formData.marca === brand
                                                ? 'bg-[var(--buddha-gold)] text-[var(--cod-gray)]'
                                                : 'bg-white/5 text-[var(--text-secondary)] hover:bg-white/10'
                                                }`}
                                        >
                                            {brand}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* Modelo */}
                            <div>
                                <label className="label block mb-2">Modelo</label>
                                <input
                                    type="text"
                                    value={formData.modelo}
                                    onChange={e => updateField('modelo', e.target.value)}
                                    placeholder="Ej: iPhone 13 Pro, Galaxy S23, Redmi Note 12..."
                                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-base text-white placeholder:text-[var(--text-muted)] focus:outline-none focus:border-[var(--buddha-gold)] transition-colors"
                                />
                            </div>

                            {/* Color (opcional) */}
                            <div>
                                <label className="label block mb-2">Color (opcional)</label>
                                <input
                                    type="text"
                                    value={formData.color}
                                    onChange={e => updateField('color', e.target.value)}
                                    placeholder="Ej: Negro, Blanco, Azul..."
                                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-base text-white placeholder:text-[var(--text-muted)] focus:outline-none focus:border-[var(--buddha-gold)] transition-colors"
                                />
                            </div>
                        </div>
                    </div>
                )}

                {/* Step: Issue */}
                {currentStep === 'issue' && (
                    <div>
                        <h3 className="heading-3 text-white mb-2">¿Cuál es el problema?</h3>
                        <p className="text-[var(--text-secondary)] mb-6">
                            Seleccioná el tipo de falla que presenta tu {formData.marca} {formData.modelo}.
                        </p>

                        {/* Warning si es mojado */}
                        {formData.es_mojado && (
                            <motion.div
                                initial={{ opacity: 0, y: -10 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="bg-[var(--error-bg)] border border-[var(--error)]/30 rounded-xl p-4 mb-6"
                            >
                                <div className="flex items-start gap-3">
                                    <AlertTriangle className="w-5 h-5 text-[var(--error)] flex-shrink-0 mt-0.5" />
                                    <div>
                                        <p className="font-semibold text-[var(--error)] mb-1">⚠️ Equipo Mojado - IMPORTANTE</p>
                                        <ul className="text-sm text-[var(--text-secondary)] space-y-1">
                                            <li>• <strong>NO conectes el cargador</strong> (puede causar cortocircuito)</li>
                                            <li>• Apagá el equipo si aún prende</li>
                                            <li>• No uses arroz (es un mito y puede dañarlo más)</li>
                                            <li>• <strong>Traelo lo antes posible</strong> - las primeras 24hs son críticas</li>
                                        </ul>
                                    </div>
                                </div>
                            </motion.div>
                        )}

                        <div className="space-y-6">
                            {/* Tipo de falla */}
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                                {COMMON_ISSUES.map(issue => (
                                    <button
                                        key={issue.id}
                                        type="button"
                                        onClick={() => {
                                            updateField('falla_id', issue.id)
                                            if (issue.id === 'mojado') {
                                                updateField('es_mojado', true)
                                                updateField('es_urgente', true)
                                            }
                                        }}
                                        className={`p-4 rounded-xl text-left transition-all ${formData.falla_id === issue.id
                                            ? issue.id === 'mojado'
                                                ? 'bg-[var(--error-bg)] border-2 border-[var(--error)]'
                                                : 'bg-[var(--buddha-gold-10)] border-2 border-[var(--buddha-gold)]'
                                            : 'bg-white/5 border border-white/10 hover:bg-white/10'
                                            }`}
                                    >
                                        <span className={`font-medium ${formData.falla_id === issue.id
                                            ? issue.id === 'mojado' ? 'text-[var(--error)]' : 'text-[var(--buddha-gold)]'
                                            : 'text-white'
                                            }`}>
                                            {issue.label}
                                        </span>
                                    </button>
                                ))}
                            </div>

                            {/* Descripción adicional */}
                            <div>
                                <label className="label block mb-2">Descripción adicional (opcional)</label>
                                <textarea
                                    value={formData.descripcion_adicional}
                                    onChange={e => updateField('descripcion_adicional', e.target.value)}
                                    placeholder="Contanos más detalles sobre el problema..."
                                    rows={3}
                                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-base text-white placeholder:text-[var(--text-muted)] focus:outline-none focus:border-[var(--buddha-gold)] transition-colors resize-none"
                                />
                            </div>

                            {/* Urgente */}
                            <label className="flex items-center gap-3 cursor-pointer">
                                <input
                                    type="checkbox"
                                    checked={formData.es_urgente}
                                    onChange={e => updateField('es_urgente', e.target.checked)}
                                    className="w-5 h-5 rounded border-white/20 bg-white/5 text-[var(--buddha-gold)] focus:ring-[var(--buddha-gold)]"
                                />
                                <span className="text-white">Necesito reparación express (prioridad)</span>
                            </label>
                        </div>
                    </div>
                )}

                {/* Step: Contact */}
                {currentStep === 'contact' && (
                    <div>
                        <h3 className="heading-3 text-white mb-2">¿Cómo te contactamos?</h3>
                        <p className="text-[var(--text-secondary)] mb-6">
                            Dejanos tus datos para coordinar la recepción y avisarte cuando esté listo.
                        </p>

                        <div className="space-y-6">
                            <div>
                                <label className="label block mb-2">Nombre completo *</label>
                                <input
                                    type="text"
                                    value={formData.nombre}
                                    onChange={e => updateField('nombre', e.target.value)}
                                    placeholder="Tu nombre"
                                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-base text-white placeholder:text-[var(--text-muted)] focus:outline-none focus:border-[var(--buddha-gold)] transition-colors"
                                />
                            </div>

                            <div>
                                <label className="label block mb-2">Teléfono / WhatsApp *</label>
                                <input
                                    type="tel"
                                    value={formData.telefono}
                                    onChange={e => updateField('telefono', e.target.value)}
                                    placeholder="099 123 456"
                                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-base text-white placeholder:text-[var(--text-muted)] focus:outline-none focus:border-[var(--buddha-gold)] transition-colors"
                                />
                            </div>

                            <div>
                                <label className="label block mb-2">Email (opcional)</label>
                                <input
                                    type="email"
                                    value={formData.email}
                                    onChange={e => updateField('email', e.target.value)}
                                    placeholder="tu@email.com"
                                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-base text-white placeholder:text-[var(--text-muted)] focus:outline-none focus:border-[var(--buddha-gold)] transition-colors"
                                />
                            </div>
                        </div>
                    </div>
                )}

                {/* Step: Confirm */}
                {currentStep === 'confirm' && (
                    <div>
                        <h3 className="heading-3 text-white mb-2">Confirmá tu solicitud</h3>
                        <p className="text-[var(--text-secondary)] mb-6">
                            Revisá que los datos estén correctos antes de enviar.
                        </p>

                        <div className="space-y-4">
                            {/* Resumen */}
                            <div className="bg-[var(--cod-gray)] rounded-xl p-4 space-y-3">
                                <div className="flex justify-between">
                                    <span className="text-[var(--text-muted)]">Dispositivo</span>
                                    <span className="text-white font-medium">{formData.marca} {formData.modelo}</span>
                                </div>
                                {formData.color && (
                                    <div className="flex justify-between">
                                        <span className="text-[var(--text-muted)]">Color</span>
                                        <span className="text-white">{formData.color}</span>
                                    </div>
                                )}
                                <div className="flex justify-between">
                                    <span className="text-[var(--text-muted)]">Problema</span>
                                    <span className="text-white">{COMMON_ISSUES.find(i => i.id === formData.falla_id)?.label}</span>
                                </div>
                                {formData.es_urgente && (
                                    <div className="flex justify-between">
                                        <span className="text-[var(--text-muted)]">Prioridad</span>
                                        <span className="badge-premium text-xs">Express / Urgente</span>
                                    </div>
                                )}
                                <hr className="border-white/10" />
                                <div className="flex justify-between">
                                    <span className="text-[var(--text-muted)]">Nombre</span>
                                    <span className="text-white">{formData.nombre}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-[var(--text-muted)]">Teléfono</span>
                                    <span className="text-white">{formData.telefono}</span>
                                </div>
                                {formData.email && (
                                    <div className="flex justify-between">
                                        <span className="text-[var(--text-muted)]">Email</span>
                                        <span className="text-white">{formData.email}</span>
                                    </div>
                                )}
                            </div>

                            <p className="text-sm text-[var(--text-muted)]">
                                Al enviar esta solicitud, te contactaremos para coordinar la entrega de tu equipo
                                y realizaremos un diagnóstico gratuito.
                            </p>
                        </div>
                    </div>
                )}

                {/* Navigation Buttons */}
                <div className="flex gap-4 mt-8">
                    {currentStepIndex > 0 && (
                        <button
                            type="button"
                            onClick={prevStep}
                            className="btn-glass flex-1"
                        >
                            <ChevronLeft className="w-5 h-5" />
                            Anterior
                        </button>
                    )}

                    {currentStep !== 'confirm' ? (
                        <button
                            type="button"
                            onClick={nextStep}
                            disabled={!canProceed()}
                            className="btn-premium flex-1 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            Siguiente
                            <ChevronRight className="w-5 h-5" />
                        </button>
                    ) : (
                        <button
                            type="button"
                            onClick={handleSubmit}
                            disabled={isSubmitting}
                            className="btn-premium flex-1 disabled:opacity-50"
                        >
                            {isSubmitting ? (
                                <>
                                    <Loader2 className="w-5 h-5 animate-spin" />
                                    Enviando...
                                </>
                            ) : (
                                <>
                                    <Smartphone className="w-5 h-5" />
                                    Enviar Solicitud
                                </>
                            )}
                        </button>
                    )}
                </div>
            </motion.div>
        </div>
    )
}
