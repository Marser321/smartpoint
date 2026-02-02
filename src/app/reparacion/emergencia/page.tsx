'use client'

import { useState } from 'react'
import Header from '@/components/layout/header'
import Footer from '@/components/layout/footer'
import { motion } from 'framer-motion'
import Link from 'next/link'
import {
    Droplets, AlertTriangle, Phone, Clock,
    XCircle, Zap, ChevronRight
} from 'lucide-react'
import { staggerContainer, staggerItem } from '@/lib/animations'

const EMERGENCY_STEPS = [
    {
        icon: XCircle,
        title: 'NO conectes el cargador',
        description: 'Conectar el cargador a un equipo mojado puede causar un cortocircuito irreversible que dañe componentes internos.',
        critical: true,
    },
    {
        icon: Zap,
        title: 'Apagá el equipo',
        description: 'Si aún prende, mantené presionado el botón de encendido hasta que se apague. Esto evita daños eléctricos.',
        critical: true,
    },
    {
        icon: XCircle,
        title: 'NO uses arroz',
        description: 'Es un mito. El arroz no absorbe la humedad interna y puede dejar residuos que complican la reparación.',
        critical: false,
    },
    {
        icon: Clock,
        title: 'Traelo lo antes posible',
        description: 'Las primeras 24-48 horas son críticas. Cuanto antes lo traes, mayor probabilidad de recuperarlo.',
        critical: true,
    },
]

export default function EmergenciaPage() {
    const [showForm, setShowForm] = useState(false)

    return (
        <>
            <Header />
            <main className="min-h-screen pt-28 pb-16">
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                    {/* Emergency Banner */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="bg-gradient-to-r from-[var(--error)]/20 to-[var(--error)]/5 border border-[var(--error)]/30 rounded-2xl p-6 sm:p-8 mb-8"
                    >
                        <div className="flex items-start gap-4">
                            <div className="w-16 h-16 rounded-full bg-[var(--error)]/20 flex items-center justify-center flex-shrink-0">
                                <Droplets className="w-8 h-8 text-[var(--error)]" />
                            </div>
                            <div>
                                <h1 className="text-2xl sm:text-3xl font-bold text-white mb-2">
                                    ¿Tu celular se mojó?
                                </h1>
                                <p className="text-[var(--text-secondary)]">
                                    Mantené la calma. Seguí estos pasos y contactanos de inmediato
                                    para maximizar las chances de recuperarlo.
                                </p>
                            </div>
                        </div>
                    </motion.div>

                    {/* Critical Steps */}
                    <motion.div
                        initial="initial"
                        animate="animate"
                        variants={staggerContainer}
                        className="space-y-4 mb-12"
                    >
                        {EMERGENCY_STEPS.map((step, idx) => (
                            <motion.div
                                key={idx}
                                variants={staggerItem}
                                className={`glass-card p-6 flex items-start gap-4 ${step.critical ? 'border-[var(--error)]/30' : ''
                                    }`}
                            >
                                <div className={`w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 ${step.critical
                                        ? 'bg-[var(--error)]/20 text-[var(--error)]'
                                        : 'bg-[var(--warning-bg)] text-[var(--warning)]'
                                    }`}>
                                    <step.icon className="w-6 h-6" />
                                </div>
                                <div>
                                    <div className="flex items-center gap-2 mb-1">
                                        <span className="text-[var(--text-muted)] text-sm font-mono">
                                            0{idx + 1}
                                        </span>
                                        {step.critical && (
                                            <span className="text-xs bg-[var(--error)]/20 text-[var(--error)] px-2 py-0.5 rounded-full font-medium">
                                                CRÍTICO
                                            </span>
                                        )}
                                    </div>
                                    <h3 className="text-lg font-semibold text-white mb-1">{step.title}</h3>
                                    <p className="text-[var(--text-secondary)] text-sm">{step.description}</p>
                                </div>
                            </motion.div>
                        ))}
                    </motion.div>

                    {/* CTA Section */}
                    <div className="glass-card-elevated p-8 text-center">
                        <AlertTriangle className="w-12 h-12 text-[var(--buddha-gold)] mx-auto mb-4" />
                        <h2 className="heading-2 text-white mb-2">
                            El tiempo es crucial
                        </h2>
                        <p className="body-large mb-6 max-w-lg mx-auto">
                            Cuanto antes traigas tu equipo, mayor probabilidad de recuperarlo.
                            Atendemos casos de emergencia con prioridad.
                        </p>

                        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                            <a
                                href="tel:+59899123456"
                                className="btn-premium w-full sm:w-auto justify-center text-lg py-4"
                            >
                                <Phone className="w-5 h-5" />
                                Llamar Ahora
                            </a>
                            <a
                                href="https://wa.me/59899123456?text=🚨 URGENTE: Mi celular se mojó y necesito ayuda"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="btn-glass w-full sm:w-auto justify-center text-lg py-4 border-[var(--success)] text-[var(--success)]"
                            >
                                WhatsApp Urgente
                            </a>
                        </div>

                        <div className="mt-8 pt-6 border-t border-white/10">
                            <p className="text-[var(--text-muted)] text-sm mb-2">
                                ¿No podés llamar ahora?
                            </p>
                            <Link
                                href="/reparacion"
                                className="inline-flex items-center gap-2 text-[var(--buddha-gold)] hover:underline"
                            >
                                Solicitar turno urgente online
                                <ChevronRight className="w-4 h-4" />
                            </Link>
                        </div>
                    </div>

                    {/* FAQ */}
                    <div className="mt-12">
                        <h3 className="heading-3 text-white mb-6">Preguntas frecuentes</h3>
                        <div className="space-y-4">
                            {[
                                {
                                    q: '¿Cuánto cuesta reparar un celular mojado?',
                                    a: 'El diagnóstico es gratuito. El costo depende del daño interno, pero te damos un presupuesto antes de cualquier trabajo.'
                                },
                                {
                                    q: '¿Se puede recuperar un celular que estuvo mucho tiempo en agua?',
                                    a: 'Depende del tiempo y tipo de líquido. Agua salada o con cloro causa más daño. Traelo igual para evaluar.'
                                },
                                {
                                    q: '¿Pierdo mis datos si se mojó?',
                                    a: 'En muchos casos podemos recuperar los datos. Es importante no intentar encenderlo antes de traerlo.'
                                },
                            ].map((item, idx) => (
                                <div key={idx} className="glass-card p-5">
                                    <h4 className="font-semibold text-white mb-2">{item.q}</h4>
                                    <p className="text-[var(--text-secondary)] text-sm">{item.a}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </main>
            <Footer />
        </>
    )
}
