'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import { MapPin, Phone, Mail, Clock, Instagram, Facebook, MessageCircle, Wrench, ArrowRight } from 'lucide-react'

// Apple easing
const appleEasing: [number, number, number, number] = [0.23, 1, 0.32, 1]

export default function Footer() {
    const currentYear = new Date().getFullYear()

    return (
        <footer className="relative">
            {/* CTA Banner - Glassmorphism */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, ease: appleEasing }}
                className="relative overflow-hidden"
            >
                <div className="mx-4 sm:mx-6 lg:mx-8 -mb-8 relative z-10">
                    <div className="max-w-7xl mx-auto">
                        <div className="
                            relative p-8 rounded-2xl 
                            bg-gradient-to-r from-[var(--sp-red)]/20 via-[var(--sp-red)]/10 to-[var(--sp-red)]/20
                            backdrop-blur-xl
                            border border-[var(--sp-red)]/30
                            shadow-[0_8px_32px_rgba(196,30,58,0.15)]
                        ">
                            {/* Glow effect */}
                            <div className="absolute inset-0 rounded-2xl opacity-50" style={{ boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.1)' }} />

                            <div className="relative flex flex-col md:flex-row items-center justify-between gap-6">
                                <div>
                                    <h3 className="text-2xl font-bold text-white mb-2 tracking-tight">
                                        ¿Tu celular necesita atención?
                                    </h3>
                                    <p className="text-white/70">
                                        Diagnóstico gratuito en el momento. Sin compromiso.
                                    </p>
                                </div>
                                <motion.div
                                    whileHover={{ scale: 1.02, y: -2 }}
                                    whileTap={{ scale: 0.98 }}
                                >
                                    <Link
                                        href="/reparacion"
                                        className="
                                            flex items-center gap-2 px-6 py-3
                                            bg-white text-[var(--sp-red)]
                                            font-semibold rounded-xl
                                            shadow-lg shadow-white/20
                                            hover:shadow-[0_0_30px_rgba(255,255,255,0.3)]
                                            transition-all duration-300
                                        "
                                    >
                                        <Wrench className="w-5 h-5" />
                                        Solicitar Turno
                                        <ArrowRight className="w-4 h-4" />
                                    </Link>
                                </motion.div>
                            </div>
                        </div>
                    </div>
                </div>
            </motion.div>

            {/* Main Footer - Glass Background */}
            <div className="bg-[var(--cod-gray-light)] pt-20 pb-8">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">
                        {/* Brand */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.5, ease: appleEasing }}
                        >
                            <Link href="/" className="flex items-center gap-3 mb-4 group">
                                <div className="relative">
                                    <img
                                        src="/logo.png"
                                        alt="Smart Point"
                                        className="w-12 h-12 rounded-full object-cover transition-transform duration-300 group-hover:scale-105"
                                    />
                                    <div className="absolute inset-0 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-500" style={{ boxShadow: 'var(--glow-red)' }} />
                                </div>
                                <div>
                                    <span className="text-xl font-bold text-white">Smart </span>
                                    <span className="text-xl font-bold bg-gradient-to-r from-[var(--sp-red)] to-[var(--sp-red-light)] bg-clip-text text-transparent">Point</span>
                                </div>
                            </Link>
                            <p className="text-white/60 mb-6 leading-relaxed">
                                Servicio técnico premium y accesorios de calidad para tus dispositivos.
                            </p>
                            <div className="flex gap-3">
                                {[
                                    { href: 'https://instagram.com/smartpoint.uy', icon: Instagram, label: 'Instagram' },
                                    { href: 'https://facebook.com/smartpoint.uy', icon: Facebook, label: 'Facebook' },
                                    { href: 'https://wa.me/59899123456', icon: MessageCircle, label: 'WhatsApp' },
                                ].map((social) => (
                                    <motion.a
                                        key={social.label}
                                        href={social.href}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        whileHover={{ scale: 1.1, y: -2 }}
                                        whileTap={{ scale: 0.95 }}
                                        className="
                                            w-10 h-10 rounded-xl 
                                            bg-white/5 backdrop-blur-xl
                                            border border-white/10 
                                            flex items-center justify-center 
                                            hover:bg-[var(--sp-red)]/20 hover:border-[var(--sp-red)]/30
                                            hover:shadow-[var(--glow-red)]
                                            transition-all duration-300
                                        "
                                        aria-label={social.label}
                                    >
                                        <social.icon className="w-5 h-5 text-white" />
                                    </motion.a>
                                ))}
                            </div>
                        </motion.div>

                        {/* Servicios */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.5, delay: 0.1, ease: appleEasing }}
                        >
                            <h4 className="font-semibold text-white mb-4 tracking-tight">Servicios</h4>
                            <ul className="space-y-3">
                                {[
                                    { href: '/reparacion', label: 'Reparación de Celulares' },
                                    { href: '/reparacion', label: 'Reparación de Tablets' },
                                    { href: '/reparacion', label: 'Reparación de Notebooks' },
                                    { href: '/reparacion/emergencia', label: 'Recuperación por Agua' },
                                    { href: '/reparacion/estado', label: 'Consultar Estado' },
                                ].map((link) => (
                                    <li key={link.label}>
                                        <Link
                                            href={link.href}
                                            className="text-white/60 hover:text-[var(--sp-red)] transition-colors duration-300 inline-flex items-center gap-1 group"
                                        >
                                            <span>{link.label}</span>
                                            <ArrowRight className="w-3 h-3 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300" />
                                        </Link>
                                    </li>
                                ))}
                            </ul>
                        </motion.div>

                        {/* Tienda */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.5, delay: 0.2, ease: appleEasing }}
                        >
                            <h4 className="font-semibold text-white mb-4 tracking-tight">Tienda</h4>
                            <ul className="space-y-3">
                                {[
                                    { label: 'Fundas', href: '/tienda?categoria=funda' },
                                    { label: 'Vidrios Templados', href: '/tienda?categoria=vidrio' },
                                    { label: 'Cargadores', href: '/tienda?categoria=cargador' },
                                    { label: 'Auriculares', href: '/tienda?categoria=auricular' },
                                    { label: 'Cables', href: '/tienda?categoria=cable' },
                                ].map((item) => (
                                    <li key={item.label}>
                                        <Link
                                            href={item.href}
                                            className="text-white/60 hover:text-[var(--sp-red)] transition-colors duration-300 inline-flex items-center gap-1 group"
                                        >
                                            <span>{item.label}</span>
                                            <ArrowRight className="w-3 h-3 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300" />
                                        </Link>
                                    </li>
                                ))}
                            </ul>
                        </motion.div>

                        {/* Contacto */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.5, delay: 0.3, ease: appleEasing }}
                        >
                            <h4 className="font-semibold text-white mb-4 tracking-tight">Contacto</h4>
                            <ul className="space-y-4">
                                {[
                                    { icon: MapPin, content: <>Av. Roosevelt, Parada 10<br />Punta del Este, Maldonado</>, href: null },
                                    { icon: Phone, content: '+598 99 123 456', href: 'tel:+59899123456' },
                                    { icon: Mail, content: 'info@smartpoint.uy', href: 'mailto:info@smartpoint.uy' },
                                    { icon: Clock, content: <>Lun - Sáb: 10:00 - 20:00<br />Dom: Cerrado</>, href: null },
                                ].map((item, i) => (
                                    <li key={i} className="flex items-start gap-3 group">
                                        <div className="w-8 h-8 rounded-lg bg-[var(--sp-red)]/10 flex items-center justify-center flex-shrink-0">
                                            <item.icon className="w-4 h-4 text-[var(--sp-red)]" />
                                        </div>
                                        {item.href ? (
                                            <a href={item.href} className="text-white/60 hover:text-[var(--sp-red)] transition-colors duration-300">
                                                {item.content}
                                            </a>
                                        ) : (
                                            <span className="text-white/60">{item.content}</span>
                                        )}
                                    </li>
                                ))}
                            </ul>
                        </motion.div>
                    </div>

                    {/* Bottom Bar */}
                    <div className="pt-8 border-t border-white/5">
                        <div className="flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-white/40">
                            <p>© {currentYear} Smart Point. Todos los derechos reservados.</p>
                            <div className="flex items-center gap-6">
                                <Link href="/privacidad" className="hover:text-[var(--sp-red)] transition-colors duration-300">
                                    Privacidad
                                </Link>
                                <Link href="/terminos" className="hover:text-[var(--sp-red)] transition-colors duration-300">
                                    Términos
                                </Link>
                                <Link href="/admin/login" className="hover:text-[var(--sp-red)] transition-colors duration-300 opacity-50">
                                    Admin
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </footer>
    )
}
