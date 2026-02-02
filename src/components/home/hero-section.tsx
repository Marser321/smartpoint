'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import Image from 'next/image'
import FloatingImage from '@/components/ui/floating-image'
import { fadeInUp, delay, staggerContainer } from '@/lib/animations'
import { ArrowRight, Star } from 'lucide-react'

// Images from the real folder
const heroImages = [
    { src: '/assets/real/IMG_0438.JPG.jpeg', alt: 'Reparación de placa base', className: 'top-[5%] right-[5%] w-72 md:w-96 rotate-12 z-[60]', depth: 1 },
    { src: '/assets/real/IMG_0446.JPG.jpeg', alt: 'Microscopio de precisión', className: 'top-[35%] right-[25%] w-64 md:w-80 -rotate-6 z-20', depth: 1.5 },
    { src: '/assets/real/IMG_0442.JPG.jpeg', alt: 'Herramientas de taller', className: 'bottom-[5%] right-[45%] w-56 md:w-72 rotate-12 z-30', depth: 0.5 },
]

export default function HeroSection() {
    return (
        <section className="relative min-h-screen flex items-center pt-32 md:pt-40 overflow-hidden bg-[var(--cod-gray)]">
            {/* Ambient Background */}
            <div className="absolute inset-0 bg-hero-pattern bg-cover bg-center opacity-40 mix-blend-overlay" />
            <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[var(--cod-gray)]/80 to-[var(--cod-gray)]" />

            {/* Red Glow accents */}
            <div className="absolute top-20 left-20 w-96 h-96 bg-[var(--sp-red)]/20 rounded-full blur-[100px]" />
            <div className="absolute bottom-20 right-20 w-96 h-96 bg-[var(--sp-red)]/10 rounded-full blur-[100px]" />

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 w-full">
                <div className="grid lg:grid-cols-2 gap-12 items-center">

                    {/* Text Content */}
                    <motion.div
                        initial="initial"
                        animate="animate"
                        variants={staggerContainer}
                        className="max-w-2xl"
                    >
                        <motion.div variants={fadeInUp} className="flex items-center gap-2 mb-6">
                            <span className="px-3 py-1 rounded-full bg-[var(--sp-red)]/10 border border-[var(--sp-red)]/20 text-[var(--sp-red)] text-sm font-semibold tracking-wide">
                                #1 EN MALDONADO
                            </span>
                            <div className="flex gap-1">
                                {[1, 2, 3, 4, 5].map(i => (
                                    <Star key={i} className="w-4 h-4 text-[var(--sp-red)] fill-current" />
                                ))}
                            </div>
                        </motion.div>

                        <motion.h1 variants={fadeInUp} className="text-5xl md:text-7xl font-bold text-white leading-tight mb-6">
                            Reparamos <br />
                            <span className="text-gradient-red">lo imposible.</span>
                        </motion.h1>

                        <motion.p variants={fadeInUp} className="text-xl text-[var(--text-secondary)] mb-8 leading-relaxed">
                            Servicio técnico especializado Apple y Multimarca.
                            Rescatamos tus dispositivos con tecnología de precisión y
                            repuestos originales.
                        </motion.p>

                        <motion.div variants={delay(0.4)} className="flex flex-wrap gap-4">
                            <Link href="/reparacion" className="btn-premium">
                                Solicitar Diagnóstico
                                <ArrowRight className="w-5 h-5" />
                            </Link>
                            <Link href="/tienda" className="btn-glass group">
                                Ver Tienda
                                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                            </Link>
                        </motion.div>
                    </motion.div>

                    {/* Floating Images Area - Hidden on mobile, visible on LG */}
                    <div className="hidden lg:block relative h-[600px] w-full">
                        {heroImages.map((img, idx) => (
                            <FloatingImage
                                key={idx}
                                {...img}
                                delay={idx * 0.2}
                            />
                        ))}
                    </div>
                </div>
            </div>
        </section>
    )
}
