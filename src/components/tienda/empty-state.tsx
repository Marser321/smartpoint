'use client'

import { motion } from 'framer-motion'
import { Package } from 'lucide-react'

interface EmptyStateProps {
    title?: string
    description?: string
}

export default function EmptyState({
    title = "Estamos reponiendo stock premium",
    description = "Pronto tendremos nuevos productos disponibles"
}: EmptyStateProps) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="col-span-full flex flex-col items-center justify-center py-20 text-center"
        >
            {/* Ilustración SVG premium */}
            <div className="relative w-32 h-32 mb-6">
                {/* Círculo de fondo con gradiente */}
                <div className="absolute inset-0 rounded-full bg-gradient-to-br from-[var(--sp-red)]/20 to-transparent" />

                {/* Anillos decorativos */}
                <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
                    className="absolute inset-0 rounded-full border border-dashed border-[var(--sp-red)]/30"
                />
                <motion.div
                    animate={{ rotate: -360 }}
                    transition={{ duration: 30, repeat: Infinity, ease: 'linear' }}
                    className="absolute inset-2 rounded-full border border-dotted border-white/10"
                />

                {/* Icono central */}
                <div className="absolute inset-0 flex items-center justify-center">
                    <motion.div
                        animate={{ y: [0, -5, 0] }}
                        transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
                    >
                        <Package className="w-12 h-12 text-[var(--sp-red)]/60" />
                    </motion.div>
                </div>

                {/* Partículas decorativas */}
                {[...Array(3)].map((_, i) => (
                    <motion.div
                        key={i}
                        animate={{
                            y: [0, -20, 0],
                            opacity: [0, 1, 0],
                        }}
                        transition={{
                            duration: 2,
                            repeat: Infinity,
                            delay: i * 0.5,
                        }}
                        className="absolute w-1.5 h-1.5 rounded-full bg-[var(--sp-red)]/40"
                        style={{
                            left: `${30 + i * 20}%`,
                            top: '40%',
                        }}
                    />
                ))}
            </div>

            <h3 className="text-xl font-semibold text-white/80 mb-2">
                {title}
            </h3>
            <p className="text-white/40 max-w-sm">
                {description}
            </p>
        </motion.div>
    )
}
