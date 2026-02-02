'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'
import { Menu, X, Phone, ShoppingBag, Sparkles } from 'lucide-react'
import { useCart } from '@/context/cart-context'

const navigation = [
    { name: 'Inicio', href: '/' },
    { name: 'PC Studio', href: '/pc-builder', highlight: true },
    { name: 'Lab Notebooks', href: '/lab' },
    { name: 'Escáner AI', href: '/escaner' },
    { name: 'Tienda', href: '/tienda' },
]

// Apple easing curve
const appleEasing: [number, number, number, number] = [0.23, 1, 0.32, 1]

export default function Header() {
    const [isScrolled, setIsScrolled] = useState(false)
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
    const { openCart, itemCount } = useCart()

    // Detectar modo demo para aplicar offset
    const isDemoMode = process.env.NEXT_PUBLIC_DEMO_MODE === 'true'

    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 20)
        }
        window.addEventListener('scroll', handleScroll)
        return () => window.removeEventListener('scroll', handleScroll)
    }, [])

    return (
        <motion.header
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: appleEasing }}
            className={`fixed left-0 right-0 z-50 transition-all duration-500 ${isScrolled
                ? 'py-2'
                : 'py-4'
                }`}
            style={{ top: isDemoMode ? '40px' : '0px' }}
        >
            {/* Glassmorphism Container */}
            <div className={`mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 transition-all duration-500 ${isScrolled ? 'transform-none' : ''
                }`}>
                <nav className={`
                    relative rounded-2xl transition-all duration-500
                    ${isScrolled
                        ? 'bg-white/[0.03] backdrop-blur-2xl border border-white/[0.08] shadow-[0_8px_32px_rgba(0,0,0,0.4)]'
                        : 'bg-transparent'
                    }
                `}>
                    <div className="flex h-16 items-center justify-between px-4 sm:px-6">
                        {/* Logo con Glow */}
                        <Link href="/" className="flex items-center gap-3 group">
                            <motion.div
                                className="relative"
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                transition={{ type: "spring", stiffness: 400, damping: 17 }}
                            >
                                <img
                                    src="/logo.png"
                                    alt="Smart Point"
                                    className="w-11 h-11 rounded-full object-cover"
                                />
                                {/* Glow on hover */}
                                <div
                                    className="absolute inset-0 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                                    style={{ boxShadow: 'var(--glow-red)' }}
                                />
                            </motion.div>
                            <div className="hidden sm:block">
                                <span className="text-lg font-bold text-white tracking-tight">Smart</span>
                                <span className="text-lg font-bold bg-gradient-to-r from-[var(--sp-red)] to-[var(--sp-red-light)] bg-clip-text text-transparent"> Point</span>
                            </div>
                        </Link>

                        {/* Desktop Navigation */}
                        <div className="hidden lg:flex items-center gap-1">
                            {navigation.map((item, i) => (
                                <motion.div
                                    key={item.name}
                                    initial={{ opacity: 0, y: -10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: i * 0.05, duration: 0.4, ease: appleEasing }}
                                >
                                    <Link
                                        href={item.href}
                                        className="relative px-4 py-2 text-sm text-white/70 hover:text-white transition-colors duration-300 rounded-xl group"
                                    >
                                        <span className="relative z-10">{item.name}</span>
                                        {/* Hover background */}
                                        <span className="absolute inset-0 rounded-xl bg-white/0 group-hover:bg-white/5 transition-colors duration-300" />
                                    </Link>
                                </motion.div>
                            ))}
                        </div>

                        {/* CTA Buttons */}
                        <div className="hidden lg:flex items-center gap-3">
                            <motion.a
                                href="tel:+59899123456"
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                                className="
                                    flex items-center gap-2 px-4 py-2.5
                                    bg-white/5 backdrop-blur-xl
                                    border border-white/10
                                    text-white text-sm font-medium
                                    rounded-xl
                                    hover:bg-white/10 hover:border-white/20
                                    transition-all duration-300
                                "
                            >
                                <Phone className="w-4 h-4" />
                                <span>Llamar</span>
                            </motion.a>

                            {/* Tienda CTA Restored */}
                            <motion.div
                                whileHover={{ scale: 1.02, y: -2 }}
                                whileTap={{ scale: 0.98 }}
                                transition={{ type: "spring", stiffness: 400, damping: 17 }}
                            >
                                <Link
                                    href="/tienda"
                                    className="
                                        flex items-center gap-2 px-5 py-2.5
                                        bg-gradient-to-r from-[var(--sp-red)] to-[var(--sp-red-dark)]
                                        text-white text-sm font-semibold
                                        rounded-xl
                                        shadow-lg shadow-[var(--sp-red-30)]
                                        hover:shadow-[0_0_30px_var(--sp-red-30)]
                                        transition-all duration-300
                                    "
                                >
                                    <ShoppingBag className="w-4 h-4" />
                                    <span>Tienda</span>
                                </Link>
                            </motion.div>

                            {/* Cart Trigger Icon */}
                            <motion.button
                                onClick={openCart}
                                whileHover={{ scale: 1.1 }}
                                whileTap={{ scale: 0.9 }}
                                className="
                                    relative p-2.5
                                    bg-white/5 backdrop-blur-xl
                                    border border-white/10
                                    text-white
                                    rounded-xl
                                    hover:bg-white/10 hover:border-white/20
                                    transition-all duration-300
                                "
                                aria-label="Abrir carrito"
                            >
                                <ShoppingBag className="w-5 h-5" />
                                {itemCount > 0 && (
                                    <span className="absolute -top-1 -right-1 w-4 h-4 flex items-center justify-center bg-[var(--sp-red)] text-white text-[10px] font-bold rounded-full shadow-md">
                                        {itemCount}
                                    </span>
                                )}
                            </motion.button>
                        </div>

                        {/* Mobile Menu Button */}
                        <motion.button
                            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                            whileTap={{ scale: 0.9 }}
                            className="lg:hidden p-2 rounded-xl bg-white/5 backdrop-blur-xl border border-white/10 hover:bg-white/10 transition-colors duration-300"
                            aria-label="Toggle menu"
                        >
                            <AnimatePresence mode="wait">
                                {mobileMenuOpen ? (
                                    <motion.div
                                        key="close"
                                        initial={{ rotate: -90, opacity: 0 }}
                                        animate={{ rotate: 0, opacity: 1 }}
                                        exit={{ rotate: 90, opacity: 0 }}
                                        transition={{ duration: 0.2 }}
                                    >
                                        <X className="w-5 h-5 text-white" />
                                    </motion.div>
                                ) : (
                                    <motion.div
                                        key="menu"
                                        initial={{ rotate: 90, opacity: 0 }}
                                        animate={{ rotate: 0, opacity: 1 }}
                                        exit={{ rotate: -90, opacity: 0 }}
                                        transition={{ duration: 0.2 }}
                                    >
                                        <Menu className="w-5 h-5 text-white" />
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </motion.button>
                    </div>
                </nav>
            </div>

            {/* Mobile Menu - Glassmorphism */}
            <AnimatePresence>
                {mobileMenuOpen && (
                    <motion.div
                        initial={{ opacity: 0, height: 0, y: -10 }}
                        animate={{ opacity: 1, height: 'auto', y: 0 }}
                        exit={{ opacity: 0, height: 0, y: -10 }}
                        transition={{ duration: 0.4, ease: appleEasing }}
                        className="lg:hidden overflow-hidden"
                    >
                        <div className="mx-4 mt-2 p-4 rounded-2xl bg-white/[0.03] backdrop-blur-2xl border border-white/[0.08] shadow-[0_8px_32px_rgba(0,0,0,0.5)]">
                            <div className="space-y-1">
                                {navigation.map((item, i) => (
                                    <motion.div
                                        key={item.name}
                                        initial={{ opacity: 0, x: -20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{ delay: i * 0.05, duration: 0.3, ease: appleEasing }}
                                    >
                                        <Link
                                            href={item.href}
                                            onClick={() => setMobileMenuOpen(false)}
                                            className="block px-4 py-3 text-white/80 hover:text-white hover:bg-white/5 rounded-xl transition-all duration-300"
                                        >
                                            {item.name}
                                        </Link>
                                    </motion.div>
                                ))}
                            </div>

                            <div className="mt-4 pt-4 border-t border-white/5 flex flex-col gap-3">
                                <a
                                    href="tel:+59899123456"
                                    className="flex items-center justify-center gap-2 py-3 bg-white/5 backdrop-blur-xl border border-white/10 rounded-xl text-white hover:bg-white/10 transition-all duration-300"
                                >
                                    <Phone className="w-4 h-4" />
                                    <span>Llamar Ahora</span>
                                </a>
                                <Link
                                    href="/tienda"
                                    onClick={() => setMobileMenuOpen(false)}
                                    className="flex items-center justify-center gap-2 py-3 bg-gradient-to-r from-[var(--sp-red)] to-[var(--sp-red-dark)] rounded-xl text-white font-semibold shadow-lg shadow-[var(--sp-red-30)] transition-all duration-300"
                                >
                                    <ShoppingBag className="w-4 h-4" />
                                    <span>Ver Tienda</span>
                                </Link>
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </motion.header>
    )
}
