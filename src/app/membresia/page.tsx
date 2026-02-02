'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import {
    Shield, Check, Sparkles, Crown,
    Smartphone, Gift, Percent, Star,
    ArrowRight, CreditCard
} from 'lucide-react'
import Link from 'next/link'
import { formatPriceUYU } from '@/lib/utils'

// Apple easing
const appleEasing: [number, number, number, number] = [0.23, 1, 0.32, 1]

const PLANES = [
    {
        id: 'basic',
        nombre: 'Smart Basic',
        precio: 0,
        periodo: 'Sin costo',
        descripcion: 'Para clientes ocasionales',
        beneficios: [
            'Diagnóstico gratuito',
            'Garantía estándar 30 días',
            'Acceso a promociones'
        ],
        destacado: false,
        cta: 'Plan Actual'
    },
    {
        id: 'shield',
        nombre: 'Smart Shield',
        precio: 2990,
        periodo: '/año',
        descripcion: 'Protección premium para tu dispositivo',
        beneficios: [
            '2 cambios de vidrio templado GRATIS',
            '10% OFF en todas las reparaciones',
            'Diagnóstico prioritario',
            'Garantía extendida 90 días',
            'Soporte WhatsApp prioritario',
            'Limpieza profesional incluida'
        ],
        destacado: true,
        cta: 'Activar Smart Shield'
    },
    {
        id: 'pro',
        nombre: 'Smart Pro',
        precio: 5990,
        periodo: '/año',
        descripcion: 'Para usuarios intensivos',
        beneficios: [
            'Todo de Smart Shield +',
            '4 cambios de vidrio templado',
            '20% OFF en reparaciones',
            '1 cambio de batería con 50% OFF',
            'Préstamo de equipo durante reparación',
            'Envío gratis en compras tienda'
        ],
        destacado: false,
        cta: 'Activar Smart Pro'
    }
]

export default function MembresiaPage() {
    const [planSeleccionado, setPlanSeleccionado] = useState<string | null>(null)

    return (
        <main className="min-h-screen pt-24 pb-16">
            <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Header */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, ease: appleEasing }}
                    className="text-center mb-16"
                >
                    <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ type: "spring", stiffness: 200, delay: 0.2 }}
                        className="inline-flex items-center justify-center w-20 h-20 rounded-3xl bg-gradient-to-br from-[var(--sp-red)] to-[var(--sp-red-dark)] shadow-lg shadow-[var(--sp-red)]/30 mb-6"
                    >
                        <Crown className="w-10 h-10 text-white" />
                    </motion.div>

                    <h1 className="heading-hero text-white mb-4">
                        Club <span className="text-gradient-gold">Smart Shield</span>
                    </h1>
                    <p className="text-lg text-white/60 max-w-2xl mx-auto">
                        Protegé tu dispositivo con nuestro plan de membresía exclusivo.
                        Ahorrá en reparaciones y disfrutá de beneficios premium todo el año.
                    </p>
                </motion.div>

                {/* Plans */}
                <div className="grid md:grid-cols-3 gap-6 mb-16">
                    {PLANES.map((plan, i) => (
                        <motion.div
                            key={plan.id}
                            initial={{ opacity: 0, y: 30 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: i * 0.1, duration: 0.5, ease: appleEasing }}
                            whileHover={{ y: -8 }}
                            className={`
                                relative p-6 rounded-3xl
                                ${plan.destacado
                                    ? 'bg-gradient-to-br from-[var(--sp-red)]/20 via-[var(--sp-red)]/10 to-transparent border-[var(--sp-red)]/50'
                                    : 'bg-white/[0.02] border-white/[0.08]'
                                }
                                backdrop-blur-xl border
                                transition-all duration-500
                            `}
                        >
                            {/* Popular Badge */}
                            {plan.destacado && (
                                <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                                    <span className="px-4 py-1 rounded-full bg-[var(--sp-red)] text-white text-xs font-semibold shadow-lg shadow-[var(--sp-red)]/30">
                                        Más Popular
                                    </span>
                                </div>
                            )}

                            {/* Plan Header */}
                            <div className="text-center mb-6 pt-2">
                                <h3 className="text-xl font-bold text-white mb-2">{plan.nombre}</h3>
                                <p className="text-sm text-white/50 mb-4">{plan.descripcion}</p>

                                <div className="flex items-baseline justify-center gap-1">
                                    {plan.precio === 0 ? (
                                        <span className="text-3xl font-bold text-white">Gratis</span>
                                    ) : (
                                        <>
                                            <span className="text-4xl font-bold bg-gradient-to-r from-[var(--sp-red)] to-[var(--sp-red-light)] bg-clip-text text-transparent">
                                                {formatPriceUYU(plan.precio)}
                                            </span>
                                            <span className="text-white/50">{plan.periodo}</span>
                                        </>
                                    )}
                                </div>
                            </div>

                            {/* Benefits */}
                            <ul className="space-y-3 mb-8">
                                {plan.beneficios.map((beneficio, j) => (
                                    <motion.li
                                        key={j}
                                        initial={{ opacity: 0, x: -10 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{ delay: i * 0.1 + j * 0.05 }}
                                        className="flex items-start gap-3"
                                    >
                                        <div className={`
                                            w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5
                                            ${plan.destacado ? 'bg-[var(--sp-red)]' : 'bg-white/10'}
                                        `}>
                                            <Check className="w-3 h-3 text-white" />
                                        </div>
                                        <span className="text-sm text-white/70">{beneficio}</span>
                                    </motion.li>
                                ))}
                            </ul>

                            {/* CTA */}
                            <motion.button
                                onClick={() => setPlanSeleccionado(plan.id)}
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                                disabled={plan.id === 'basic'}
                                className={`
                                    w-full py-3 rounded-xl font-semibold
                                    flex items-center justify-center gap-2
                                    transition-all duration-300
                                    ${plan.destacado
                                        ? 'bg-gradient-to-r from-[var(--sp-red)] to-[var(--sp-red-dark)] text-white shadow-lg shadow-[var(--sp-red)]/20'
                                        : plan.id === 'basic'
                                            ? 'bg-white/5 text-white/50 cursor-default'
                                            : 'bg-white/10 text-white hover:bg-white/15'
                                    }
                                `}
                            >
                                {plan.cta}
                                {plan.id !== 'basic' && <ArrowRight className="w-4 h-4" />}
                            </motion.button>
                        </motion.div>
                    ))}
                </div>

                {/* Benefits Grid */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5, duration: 0.6, ease: appleEasing }}
                    className="mb-16"
                >
                    <h2 className="text-2xl font-bold text-white text-center mb-8">
                        ¿Por qué unirse al Club?
                    </h2>
                    <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
                        {[
                            { icon: Gift, title: 'Vidrios Gratis', desc: 'Cambios de vidrio templado sin costo' },
                            { icon: Percent, title: 'Descuentos', desc: 'Hasta 20% OFF en reparaciones' },
                            { icon: Sparkles, title: 'Prioridad', desc: 'Atención preferencial siempre' },
                            { icon: Shield, title: 'Garantía+', desc: 'Garantía extendida en reparaciones' }
                        ].map((item, i) => (
                            <motion.div
                                key={i}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.6 + i * 0.1 }}
                                className="p-5 rounded-2xl bg-white/[0.02] border border-white/5 text-center"
                            >
                                <div className="w-12 h-12 mx-auto mb-3 rounded-xl bg-[var(--sp-red)]/10 flex items-center justify-center">
                                    <item.icon className="w-6 h-6 text-[var(--sp-red)]" />
                                </div>
                                <h3 className="font-semibold text-white mb-1">{item.title}</h3>
                                <p className="text-sm text-white/50">{item.desc}</p>
                            </motion.div>
                        ))}
                    </div>
                </motion.div>

                {/* FAQ */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.8 }}
                    className="text-center"
                >
                    <p className="text-white/50 mb-4">¿Tenés preguntas?</p>
                    <Link
                        href="/contacto"
                        className="inline-flex items-center gap-2 text-[var(--sp-red)] hover:underline"
                    >
                        Contactanos por WhatsApp
                        <ArrowRight className="w-4 h-4" />
                    </Link>
                </motion.div>
            </div>
        </main>
    )
}
