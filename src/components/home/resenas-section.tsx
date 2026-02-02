'use client'

import { motion } from 'framer-motion'
import { Star, Quote, CheckCircle } from 'lucide-react'

// Apple easing
const appleEasing: [number, number, number, number] = [0.23, 1, 0.32, 1]

// Demo data - en producción viene de Supabase
const RESENAS = [
    {
        id: '1',
        nombre: 'Martín G.',
        rating: 5,
        comentario: 'Excelente servicio. Me cambiaron la pantalla del iPhone en menos de 1 hora. Quedó impecable.',
        servicio: 'Reparación de pantalla',
        fecha: 'Hace 2 días',
        verificada: true
    },
    {
        id: '2',
        nombre: 'Carolina S.',
        rating: 5,
        comentario: 'Muy profesionales. El diagnóstico con IA fue super útil para saber el precio antes de ir.',
        servicio: 'Diagnóstico IA',
        fecha: 'Hace 1 semana',
        verificada: true
    },
    {
        id: '3',
        nombre: 'Federico M.',
        rating: 4,
        comentario: 'Buenos precios y atención rápida. Recomiendo.',
        servicio: 'Cambio de batería',
        fecha: 'Hace 2 semanas',
        verificada: false
    },
    {
        id: '4',
        nombre: 'Lucía P.',
        rating: 5,
        comentario: 'Increíble la membresía Smart Shield. Ya usé el vidrio templado gratis y me ahorro siempre.',
        servicio: 'Club Smart Shield',
        fecha: 'Hace 3 semanas',
        verificada: true
    },
]

function StarRating({ rating }: { rating: number }) {
    return (
        <div className="flex gap-1">
            {[1, 2, 3, 4, 5].map((star) => (
                <Star
                    key={star}
                    className={`w-4 h-4 ${star <= rating
                            ? 'text-yellow-400 fill-yellow-400'
                            : 'text-white/20'
                        }`}
                />
            ))}
        </div>
    )
}

export default function ResenasSection() {
    const promedioRating = RESENAS.reduce((acc, r) => acc + r.rating, 0) / RESENAS.length
    const totalResenas = RESENAS.length

    return (
        <section className="py-20">
            <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Header */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6, ease: appleEasing }}
                    className="text-center mb-12"
                >
                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[var(--sp-red)]/10 border border-[var(--sp-red)]/30 text-[var(--sp-red)] text-sm font-medium mb-6">
                        <Star className="w-4 h-4 fill-current" />
                        Reseñas Verificadas
                    </div>

                    <h2 className="heading-1 text-white mb-4">
                        Lo que dicen nuestros clientes
                    </h2>

                    {/* Rating Summary */}
                    <div className="flex items-center justify-center gap-4">
                        <div className="flex items-center gap-2">
                            <span className="text-4xl font-bold text-white">
                                {promedioRating.toFixed(1)}
                            </span>
                            <div>
                                <StarRating rating={Math.round(promedioRating)} />
                                <p className="text-sm text-white/50 mt-1">{totalResenas} reseñas</p>
                            </div>
                        </div>
                    </div>
                </motion.div>

                {/* Reviews Grid */}
                <div className="grid md:grid-cols-2 gap-6">
                    {RESENAS.map((resena, i) => (
                        <motion.div
                            key={resena.id}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: i * 0.1, duration: 0.5, ease: appleEasing }}
                            className="
                                relative p-6 rounded-2xl
                                bg-white/[0.02] backdrop-blur-xl
                                border border-white/[0.05]
                                hover:bg-white/[0.04] hover:border-white/[0.08]
                                transition-all duration-300
                            "
                        >
                            {/* Quote Icon */}
                            <Quote className="absolute top-4 right-4 w-8 h-8 text-white/5" />

                            {/* Header */}
                            <div className="flex items-start gap-4 mb-4">
                                {/* Avatar */}
                                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[var(--sp-red)] to-[var(--sp-red-dark)] flex items-center justify-center text-white font-bold text-lg">
                                    {resena.nombre.charAt(0)}
                                </div>

                                <div className="flex-1">
                                    <div className="flex items-center gap-2">
                                        <h4 className="font-semibold text-white">{resena.nombre}</h4>
                                        {resena.verificada && (
                                            <span className="flex items-center gap-1 text-xs text-green-400">
                                                <CheckCircle className="w-3 h-3" />
                                                Verificado
                                            </span>
                                        )}
                                    </div>
                                    <StarRating rating={resena.rating} />
                                </div>
                            </div>

                            {/* Comment */}
                            <p className="text-white/70 mb-4 leading-relaxed">
                                "{resena.comentario}"
                            </p>

                            {/* Footer */}
                            <div className="flex items-center justify-between text-sm">
                                <span className="text-[var(--sp-red)]">{resena.servicio}</span>
                                <span className="text-white/40">{resena.fecha}</span>
                            </div>
                        </motion.div>
                    ))}
                </div>

                {/* CTA */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.5, duration: 0.5, ease: appleEasing }}
                    className="text-center mt-12"
                >
                    <a
                        href="https://g.page/r/smartpoint/review"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="
                            inline-flex items-center gap-2 px-6 py-3
                            bg-white/5 backdrop-blur-xl
                            border border-white/10
                            rounded-xl text-white font-medium
                            hover:bg-white/10 transition-all duration-300
                        "
                    >
                        <Star className="w-5 h-5" />
                        Dejá tu reseña en Google
                    </a>
                </motion.div>
            </div>
        </section>
    )
}
