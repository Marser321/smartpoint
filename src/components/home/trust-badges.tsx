'use client'

import { motion } from 'framer-motion'
import { Shield, Clock, Award, Truck, CreditCard, Headphones } from 'lucide-react'
import { staggerContainer, staggerItem, viewportOnce } from '@/lib/animations'

const features = [
    {
        icon: Shield,
        title: 'Garantía Extendida',
        description: '6 meses de garantía en todas las reparaciones',
    },
    {
        icon: Clock,
        title: 'Servicio Express',
        description: 'Reparaciones en 2-4 horas para casos urgentes',
    },
    {
        icon: Award,
        title: 'Repuestos Premium',
        description: 'Solo usamos repuestos de calidad certificada',
    },
    {
        icon: Truck,
        title: 'Envío Gratis',
        description: 'En compras mayores a $2.000 en Maldonado',
    },
    {
        icon: CreditCard,
        title: 'Múltiples Pagos',
        description: 'Tarjetas, transferencia o efectivo',
    },
    {
        icon: Headphones,
        title: 'Soporte Post-Venta',
        description: 'Te acompañamos después de la compra',
    },
]

export default function TrustBadges() {
    return (
        <section className="relative py-24 overflow-hidden">
            {/* Background */}
            <div className="absolute inset-0 bg-[var(--cod-gray)]" />

            {/* Decorative Elements */}
            <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[var(--sp-red)]/20 to-transparent" />
            <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[var(--sp-red)]/20 to-transparent" />

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
                            ¿Por qué elegir{' '}
                            <span className="text-gradient-red">Smart Point</span>?
                        </h2>
                        <p className="body-large max-w-2xl mx-auto">
                            Más de 5 años brindando servicio técnico de excelencia en la zona de
                            Punta del Este y Maldonado.
                        </p>
                    </motion.div>

                    {/* Features Grid */}
                    <motion.div
                        variants={staggerItem}
                        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
                    >
                        {features.map((feature, index) => (
                            <motion.div
                                key={feature.title}
                                variants={staggerItem}
                                className="group"
                            >
                                <div className="glass-card p-6 h-full flex items-start gap-4">
                                    <div className="w-12 h-12 rounded-xl bg-[var(--sp-red)]/10 border border-[var(--sp-red)]/30 flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform duration-300">
                                        <feature.icon className="w-6 h-6 text-[var(--sp-red)]" />
                                    </div>
                                    <div>
                                        <h3 className="font-semibold text-white mb-1">{feature.title}</h3>
                                        <p className="text-sm text-[var(--text-muted)]">{feature.description}</p>
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </motion.div>

                    {/* Stats Banner */}
                    <motion.div
                        variants={staggerItem}
                        className="mt-16 glass-card-elevated p-8 md:p-12"
                    >
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
                            {[
                                { value: '+5,000', label: 'Reparaciones exitosas' },
                                { value: '98%', label: 'Clientes satisfechos' },
                                { value: '+500', label: 'Productos en tienda' },
                                { value: '24hs', label: 'Tiempo de respuesta' },
                            ].map((stat) => (
                                <div key={stat.label}>
                                    <p className="text-3xl md:text-4xl font-bold text-gradient-red mb-2">
                                        {stat.value}
                                    </p>
                                    <p className="text-sm text-[var(--text-muted)]">{stat.label}</p>
                                </div>
                            ))}
                        </div>
                    </motion.div>
                </motion.div>
            </div>
        </section>
    )
}
