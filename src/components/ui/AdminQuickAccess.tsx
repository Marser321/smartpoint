'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import { Settings, ChevronRight } from 'lucide-react'
import { useState } from 'react'

export default function AdminQuickAccess() {
    const isDemoMode = process.env.NEXT_PUBLIC_DEMO_MODE === 'true'
    const [isHovered, setIsHovered] = useState(false)

    // Solo mostrar en modo demo
    if (!isDemoMode) return null

    return (
        <div className="fixed bottom-6 left-6 z-[150]">
            <Link href="/admin/dashboard">
                <motion.div
                    onMouseEnter={() => setIsHovered(true)}
                    onMouseLeave={() => setIsHovered(false)}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="relative group flex items-center"
                >
                    {/* Botón principal */}
                    <motion.div
                        className={`
                            relative w-14 h-14 rounded-full flex items-center justify-center cursor-pointer
                            bg-gradient-to-br from-[var(--sp-red)] via-[var(--sp-red)] to-[var(--sp-red-dark)]
                            shadow-[0_4px_20px_rgba(196,30,58,0.4)]
                            border border-white/20
                            transition-all duration-300 z-10
                            ${isHovered ? 'shadow-[0_8px_40px_rgba(196,30,58,0.6)]' : ''}
                        `}
                    >
                        {/* Glow animado */}
                        <motion.div
                            className="absolute inset-0 rounded-full"
                            animate={{
                                boxShadow: isHovered
                                    ? '0 0 30px rgba(196, 30, 58, 0.5), 0 0 60px rgba(196, 30, 58, 0.3)'
                                    : '0 0 15px rgba(196, 30, 58, 0.3)'
                            }}
                            transition={{ duration: 0.3 }}
                        />

                        {/* Icono con rotación en hover */}
                        <motion.div
                            animate={{ rotate: isHovered ? 90 : 0 }}
                            transition={{ duration: 0.4, ease: [0.23, 1, 0.32, 1] }}
                        >
                            <Settings className="w-6 h-6 text-white relative z-10" />
                        </motion.div>

                        {/* Ring pulsante */}
                        <motion.div
                            className="absolute inset-0 rounded-full border-2 border-white/30"
                            animate={{
                                scale: [1, 1.15, 1],
                                opacity: [0.5, 0, 0.5]
                            }}
                            transition={{
                                duration: 2,
                                repeat: Infinity,
                                ease: "easeInOut"
                            }}
                        />
                    </motion.div>

                    {/* Tooltip expandible hacia la DERECHA */}
                    <motion.div
                        initial={false}
                        animate={{
                            width: isHovered ? 'auto' : 0,
                            opacity: isHovered ? 1 : 0,
                            marginLeft: isHovered ? '-0.5rem' : 0,
                            paddingLeft: isHovered ? '1.5rem' : 0,
                            paddingRight: isHovered ? '1rem' : 0,
                        }}
                        transition={{ duration: 0.3, ease: [0.23, 1, 0.32, 1] }}
                        className="h-10 flex items-center rounded-r-full
                            bg-gradient-to-r from-[var(--sp-red)]/90 to-[var(--sp-red-dark)]/90
                            backdrop-blur-xl border border-white/20 border-l-0
                            shadow-[0_8px_32px_rgba(196,30,58,0.4)] overflow-hidden whitespace-nowrap"
                    >
                        <span className="text-white font-semibold text-sm flex items-center gap-2">
                            Panel Admin
                            <ChevronRight className="w-4 h-4" />
                        </span>
                    </motion.div>
                </motion.div>
            </Link>
        </div>
    )
}
