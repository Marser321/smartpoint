'use client'

import { useRef } from 'react'
import { motion, useScroll, useTransform } from 'framer-motion'
import { Smartphone, Zap, ShieldCheck, Crown } from 'lucide-react'

const CARDS = [
    {
        id: 1,
        title: "Diagnóstico IA",
        description: "Tu técnico experto en el bolsillo. Subí una foto y recibí un presupuesto estimado al instante con nuestra inteligencia artificial.",
        icon: Smartphone,
        color: "from-blue-500 to-cyan-500",
        bgGlow: "bg-blue-500/20"
    },
    {
        id: 2,
        title: "Reparación Express",
        description: "Sabemos que tu tiempo vale. La mayoría de nuestras reparaciones de pantalla y batería quedan listas en menos de 4 horas.",
        icon: Zap,
        color: "from-yellow-500 to-orange-500",
        bgGlow: "bg-orange-500/20"
    },
    {
        id: 3,
        title: "Garantía Smart",
        description: "Tranquilidad total. Todas nuestras reparaciones cuentan con 6 meses de garantía escrita sobre el repuesto y la mano de obra.",
        icon: ShieldCheck,
        color: "from-green-500 to-emerald-500",
        bgGlow: "bg-green-500/20"
    },
    {
        id: 4,
        title: "Club Shield",
        description: "Sumate a nuestra membresía exclusiva. Vidrios templados gratis, descuentos en reparaciones y préstamo de equipos.",
        icon: Crown,
        color: "from-[var(--sp-red)] to-red-600",
        bgGlow: "bg-[var(--sp-red)]/20"
    },
]

export default function HowItWorks() {
    const targetRef = useRef<HTMLDivElement>(null)
    const { scrollYProgress } = useScroll({
        target: targetRef,
    })

    const x = useTransform(scrollYProgress, [0, 1], ["1%", "-75%"])

    return (
        <section ref={targetRef} className="relative h-[300vh] bg-[var(--cod-gray)]">
            <div className="sticky top-0 flex h-screen items-center overflow-hidden">

                {/* Background Context */}
                <div className="absolute inset-0 z-0">
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-[var(--sp-red)]/5 rounded-full blur-[120px]" />
                </div>

                <motion.div style={{ x }} className="flex gap-12 px-12 md:px-24">

                    {/* Intro Card */}
                    <div className="flex h-[450px] w-[350px] md:w-[450px] shrink-0 flex-col justify-center">
                        <span className="text-[var(--sp-red)] uppercase tracking-widest font-bold mb-4">
                            Experiencia SmartPoint
                        </span>
                        <h2 className="text-4xl md:text-6xl font-bold text-white mb-6 leading-tight">
                            Reparar nunca fue tan <span className="text-gradient-gold">simple</span>.
                        </h2>
                        <p className="text-xl text-[var(--text-secondary)]">
                            Deslizá para descubrir cómo revolucionamos el servicio técnico en Maldonado.
                        </p>
                    </div>

                    {/* Step Cards */}
                    {CARDS.map((card) => (
                        <div
                            key={card.id}
                            className="group relative h-[450px] w-[350px] md:w-[400px] shrink-0 overflow-hidden rounded-3xl border border-white/10 bg-white/[0.03] backdrop-blur-xl transition-all hover:border-white/20"
                        >
                            {/* Inner Glow */}
                            <div className={`absolute top-0 right-0 w-64 h-64 ${card.bgGlow} blur-[80px] opacity-0 group-hover:opacity-100 transition-opacity duration-700`} />

                            <div className="relative h-full flex flex-col p-8 md:p-10 justify-between z-10">
                                <div>
                                    <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${card.color} flex items-center justify-center mb-8 shadow-lg`}>
                                        <card.icon className="w-7 h-7 text-white" />
                                    </div>
                                    <h3 className="text-3xl font-bold text-white mb-4">
                                        {card.title}
                                    </h3>
                                    <p className="text-lg text-[var(--text-secondary)] leading-relaxed">
                                        {card.description}
                                    </p>
                                </div>

                                <div className="flex items-center gap-2 text-white/40 text-sm font-mono tracking-widest uppercase">
                                    0{card.id} — Step
                                </div>
                            </div>
                        </div>
                    ))}
                </motion.div>
            </div>
        </section>
    )
}
