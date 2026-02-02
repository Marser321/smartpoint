'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter, usePathname } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import {
    LayoutDashboard, Ticket, Package,
    Users, Settings, LogOut, Menu, X, BarChart3,
    TrendingUp, MessageCircle, ShoppingBag
} from 'lucide-react'
import { createClient } from '@/lib/supabase/client'

const navigation = [
    { name: 'Dashboard', href: '/admin/dashboard', icon: LayoutDashboard },
    { name: 'Analytics', href: '/admin/analytics', icon: TrendingUp },
    { name: 'Productos', href: '/admin/productos', icon: ShoppingBag },
    { name: 'Tickets', href: '/admin/tickets', icon: Ticket },
    { name: 'Inventario', href: '/admin/inventario', icon: Package },
    { name: 'Notificaciones', href: '/admin/notificaciones', icon: MessageCircle },
    { name: 'Clientes', href: '/admin/clientes', icon: Users },
    { name: 'Reportes', href: '/admin/reportes', icon: BarChart3 },
    { name: 'Configuración', href: '/admin/configuracion', icon: Settings },
]

// Apple easing
const appleEasing: [number, number, number, number] = [0.23, 1, 0.32, 1]

export default function AdminSidebar() {
    const router = useRouter()
    const pathname = usePathname()
    const [mobileOpen, setMobileOpen] = useState(false)

    const handleLogout = async () => {
        const supabase = createClient()
        await supabase.auth.signOut()
        router.push('/admin/login')
        router.refresh()
    }

    const SidebarContent = () => (
        <>
            {/* Logo */}
            <div className="p-6 border-b border-white/5">
                <Link href="/admin/dashboard" className="flex items-center gap-3 group">
                    <motion.div
                        className="relative"
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                    >
                        <img
                            src="/logo.png"
                            alt="Smart Point"
                            className="w-11 h-11 rounded-full object-cover"
                        />
                        <div
                            className="absolute inset-0 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                            style={{ boxShadow: 'var(--glow-red)' }}
                        />
                    </motion.div>
                    <div>
                        <p className="font-bold text-white tracking-tight">Smart Point</p>
                        <p className="text-xs text-[var(--sp-red)]">Panel Técnico</p>
                    </div>
                </Link>
            </div>

            {/* Navigation */}
            <nav className="flex-1 p-4 space-y-1">
                {navigation.map((item, i) => {
                    const isActive = pathname.startsWith(item.href)
                    return (
                        <motion.div
                            key={item.name}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: i * 0.05, duration: 0.3, ease: appleEasing }}
                        >
                            <Link
                                href={item.href}
                                onClick={() => setMobileOpen(false)}
                                className={`
                                    relative flex items-center gap-3 px-4 py-3 rounded-xl 
                                    transition-all duration-300 group
                                    ${isActive
                                        ? 'bg-[var(--sp-red)]/10 text-[var(--sp-red)]'
                                        : 'text-white/60 hover:text-white hover:bg-white/5'
                                    }
                                `}
                            >
                                {/* Active glow indicator */}
                                {isActive && (
                                    <motion.div
                                        layoutId="activeIndicator"
                                        className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-8 bg-[var(--sp-red)] rounded-r-full"
                                        style={{ boxShadow: 'var(--glow-red)' }}
                                        transition={{ type: "spring", stiffness: 400, damping: 30 }}
                                    />
                                )}
                                <item.icon className={`w-5 h-5 transition-transform duration-300 ${isActive ? '' : 'group-hover:scale-110'}`} />
                                <span className="font-medium">{item.name}</span>
                            </Link>
                        </motion.div>
                    )
                })}
            </nav>

            {/* Logout */}
            <div className="p-4 border-t border-white/5">
                <motion.button
                    onClick={handleLogout}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="
                        flex items-center gap-3 w-full px-4 py-3 
                        text-white/60 hover:text-[var(--sp-red)]
                        bg-white/0 hover:bg-[var(--sp-red)]/10
                        rounded-xl transition-all duration-300
                    "
                >
                    <LogOut className="w-5 h-5" />
                    <span className="font-medium">Cerrar Sesión</span>
                </motion.button>
            </div>
        </>
    )

    return (
        <>
            {/* Mobile Header - Glassmorphism */}
            <div className="
                lg:hidden fixed top-0 left-0 right-0 z-40 
                bg-white/[0.02] backdrop-blur-2xl 
                border-b border-white/5 
                px-4 py-3
            ">
                <div className="flex items-center justify-between">
                    <Link href="/admin/dashboard" className="flex items-center gap-2">
                        <img
                            src="/logo.png"
                            alt="Smart Point"
                            className="w-9 h-9 rounded-full object-cover"
                        />
                        <span className="font-bold text-white">Smart Point</span>
                    </Link>
                    <motion.button
                        onClick={() => setMobileOpen(!mobileOpen)}
                        whileTap={{ scale: 0.9 }}
                        className="
                            p-2 rounded-xl 
                            bg-white/5 backdrop-blur-xl 
                            border border-white/10 
                            hover:bg-white/10 
                            transition-colors duration-300
                        "
                    >
                        <AnimatePresence mode="wait">
                            {mobileOpen ? (
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
            </div>

            {/* Mobile Sidebar - Glassmorphism Overlay */}
            <AnimatePresence>
                {mobileOpen && (
                    <>
                        {/* Backdrop */}
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setMobileOpen(false)}
                            className="lg:hidden fixed inset-0 z-40 bg-black/60 backdrop-blur-sm"
                        />

                        {/* Sidebar */}
                        <motion.aside
                            initial={{ x: -280, opacity: 0 }}
                            animate={{ x: 0, opacity: 1 }}
                            exit={{ x: -280, opacity: 0 }}
                            transition={{ duration: 0.3, ease: appleEasing }}
                            className="
                                lg:hidden fixed top-14 left-0 bottom-0 z-50 
                                w-72 flex flex-col
                                bg-[var(--cod-gray-light)]/95 backdrop-blur-2xl
                                border-r border-white/5
                            "
                        >
                            <SidebarContent />
                        </motion.aside>
                    </>
                )}
            </AnimatePresence>

            {/* Desktop Sidebar - Premium Glass */}
            <aside className="
                hidden lg:flex lg:flex-col lg:fixed lg:inset-y-0 lg:left-0 
                lg:w-72 
                bg-[var(--cod-gray-light)]/80 backdrop-blur-2xl
                border-r border-white/5
            ">
                <SidebarContent />
            </aside>
        </>
    )
}
