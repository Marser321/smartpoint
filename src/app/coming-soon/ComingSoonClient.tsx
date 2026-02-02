'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import { Clock, Sparkles, ArrowLeft } from 'lucide-react'

interface ComingSoonClientProps {
    feature?: string
}

export default function ComingSoonClient({ feature }: ComingSoonClientProps) {
    return (
        <div className="min-h-screen bg-[var(--cod-gray)] flex items-center justify-center px-4 relative overflow-hidden">
            {/* Background Grid */}
            <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff05_1px,transparent_1px),linear-gradient(to_bottom,#ffffff05_1px,transparent_1px)] bg-[size:4rem_4rem]" />

            {/* Gradiente central */}
            <div className="absolute inset-0 bg-gradient-to-b from-transparent via-yellow-500/5 to-transparent pointer-events-none" />

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="relative z-10 text-center max-w-lg"
            >
                {/* Icono animado */}
                <motion.div
                    animate={{
                        rotate: [0, 10, -10, 0],
                        scale: [1, 1.05, 1]
                    }}
                    transition={{
                        duration: 4,
                        repeat: Infinity,
                        ease: "easeInOut"
                    }}
                    className="inline-block mb-8"
                >
                    <div className="w-24 h-24 rounded-3xl bg-gradient-to-br from-yellow-500/20 to-amber-600/20 border border-yellow-500/30 flex items-center justify-center backdrop-blur-sm">
                        <Clock className="w-12 h-12 text-yellow-400" />
                    </div>
                </motion.div>

                {/* Título */}
                <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
                    Próximamente
                </h1>

                {/* Subtítulo */}
                <p className="text-white/60 text-lg mb-2">
                    {feature ? (
                        <>La sección <span className="text-yellow-400 font-semibold">{feature}</span> está en desarrollo.</>
                    ) : (
                        'Esta sección está en desarrollo.'
                    )}
                </p>
                <p className="text-white/40 text-sm mb-8">
                    Estamos trabajando para traerte algo increíble muy pronto.
                </p>

                {/* CTA */}
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                    <Link
                        href="/"
                        className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-white/5 border border-white/10 text-white hover:bg-white/10 transition-colors"
                    >
                        <ArrowLeft className="w-4 h-4" />
                        Volver al Inicio
                    </Link>
                    <Link
                        href="/pc-builder"
                        className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-yellow-500 to-amber-500 text-black font-semibold hover:from-yellow-400 hover:to-amber-400 transition-colors"
                    >
                        <Sparkles className="w-4 h-4" />
                        Probar PC Studio
                    </Link>
                </div>
            </motion.div>
        </div>
    )
}
