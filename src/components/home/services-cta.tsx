'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import { Wrench, ShoppingBag, ArrowRight, Smartphone, Laptop, Tablet, Droplets } from 'lucide-react'
import { fadeInUp, staggerContainer, staggerItem, viewportOnce } from '@/lib/animations'

const services = [
    {
        icon: Smartphone,
        title: 'Celulares',
        description: 'Pantallas, baterías, puertos de carga y más',
        popular: true,
    },
    {
        icon: Tablet,
        title: 'Tablets',
        description: 'iPad, Samsung Tab, reparación completa',
        popular: false,
    },
    {
        icon: Laptop,
        title: 'Notebooks',
        description: 'Teclados, pantallas, upgrades SSD/RAM',
        popular: false,
    },
    {
        icon: Droplets,
        title: 'Daño por Agua',
        description: 'Recuperación de equipos mojados',
        popular: false,
        urgent: true,
    },
]

export default function ServicesCTA() {
    return (
        <section className="relative py-24 overflow-hidden">
            {/* Background */}
            <div className="absolute inset-0 bg-gradient-to-b from-[var(--cod-gray)] via-[var(--cod-gray-light)] to-[var(--cod-gray)]" />

            <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <motion.div
                    initial="initial"
                    whileInView="animate"
                    viewport={viewportOnce}
                    variants={staggerContainer}
                >
                    {/* Header */}
                    <motion.div variants={staggerItem} className="text-center mb-16">
                        <h2 className="heading-1 mb-4">
                            ¿Qué necesitás{' '}
                            <span className="text-gradient-red">hoy</span>?
                        </h2>
                        <p className="body-large max-w-2xl mx-auto">
                            Elegí si querés reparar tu dispositivo o conseguir los mejores accesorios
                            para protegerlo.
                        </p>
                    </motion.div>

                    {/* Main CTAs - Two Cards */}
                    <motion.div
                        variants={staggerItem}
                        className="grid md:grid-cols-2 gap-6 mb-16"
                    >
                        {/* Reparar */}
                        <Link href="/reparacion" className="group">
                            <div className="glass-card-elevated p-8 h-full relative overflow-hidden">
                                {/* Gradient Background on Hover */}
                                <div className="absolute inset-0 bg-gradient-to-br from-[var(--buddha-gold)]/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                                <div className="relative z-10">
                                    <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-[var(--sp-red)] to-[var(--sp-red-dark)] flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300 shadow-[0_0_20px_rgba(196,30,58,0.3)]">
                                        <Wrench className="w-8 h-8 text-white" />
                                    </div>

                                    <h3 className="heading-2 text-white mb-3">Reparar mi equipo</h3>
                                    <p className="body-base text-[var(--text-secondary)] mb-6">
                                        Diagnóstico gratuito en el momento. Reparamos pantallas, baterías,
                                        puertos de carga y más. Garantía de 6 meses.
                                    </p>

                                    <div className="flex items-center gap-2 text-[var(--sp-red)] font-semibold">
                                        <span>Solicitar turno</span>
                                        <ArrowRight className="w-5 h-5 group-hover:translate-x-2 transition-transform duration-300" />
                                    </div>
                                </div>

                                {/* Decorative Elements */}
                                <div className="absolute -bottom-10 -right-10 w-40 h-40 rounded-full bg-[var(--buddha-gold)]/5 blur-2xl" />
                            </div>
                        </Link>

                        {/* Tienda */}
                        <Link href="/tienda" className="group">
                            <div className="glass-card p-8 h-full relative overflow-hidden">
                                {/* Gradient Background on Hover */}
                                <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                                <div className="relative z-10">
                                    <div className="w-16 h-16 rounded-2xl bg-white/10 border border-white/10 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                                        <ShoppingBag className="w-8 h-8 text-white" />
                                    </div>

                                    <h3 className="heading-2 text-white mb-3">Comprar Accesorios</h3>
                                    <p className="body-base text-[var(--text-secondary)] mb-6">
                                        Fundas premium, vidrios templados, cargadores originales y más.
                                        Envío express en Punta del Este.
                                    </p>

                                    <div className="flex items-center gap-2 text-white font-semibold">
                                        <span>Ver catálogo</span>
                                        <ArrowRight className="w-5 h-5 group-hover:translate-x-2 transition-transform duration-300" />
                                    </div>
                                </div>

                                {/* Decorative Elements */}
                                <div className="absolute -bottom-10 -right-10 w-40 h-40 rounded-full bg-white/5 blur-2xl" />
                            </div>
                        </Link>
                    </motion.div>

                    {/* Service Types */}
                    <motion.div variants={staggerItem}>
                        <h3 className="label text-center mb-8">Tipos de reparación</h3>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                            {services.map((service) => (
                                <Link
                                    key={service.title}
                                    href={service.urgent ? '/reparacion/emergencia' : '/reparacion'}
                                    className="group"
                                >
                                    <div className={`glass-card p-6 text-center h-full relative ${service.urgent ? 'border-[var(--error)]/30 hover:border-[var(--error)]/50' : ''
                                        }`}>
                                        {service.popular && (
                                            <span className="absolute -top-2 -right-2 badge-premium text-xs py-1 px-2">
                                                Popular
                                            </span>
                                        )}
                                        {service.urgent && (
                                            <span className="absolute -top-2 -right-2 bg-[var(--error-bg)] border border-[var(--error)]/30 text-[var(--error)] text-xs py-1 px-2 rounded-full font-medium">
                                                Urgente
                                            </span>
                                        )}

                                        <service.icon className={`w-8 h-8 mx-auto mb-3 ${service.urgent ? 'text-[var(--error)]' : 'text-[var(--sp-red)]'
                                            } group-hover:scale-110 transition-transform duration-300`} />
                                        <h4 className="font-semibold text-white mb-1">{service.title}</h4>
                                        <p className="text-sm text-[var(--text-muted)]">{service.description}</p>
                                    </div>
                                </Link>
                            ))}
                        </div>
                    </motion.div>
                </motion.div>
            </div>
        </section>
    )
}
