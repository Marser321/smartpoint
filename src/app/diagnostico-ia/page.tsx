'use client'

import { useState, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
    Upload, Camera, Loader2, Sparkles, ArrowRight,
    Smartphone, AlertTriangle, CheckCircle, X,
    Zap, Clock, Shield
} from 'lucide-react'
import Link from 'next/link'
import { formatPriceUYU } from '@/lib/utils'

// Apple easing
const appleEasing: [number, number, number, number] = [0.23, 1, 0.32, 1]

interface DiagnosticoResult {
    es_dispositivo: boolean
    modelo_estimado: string
    marca: string
    dano_detectado: string[]
    gravedad: 'leve' | 'moderado' | 'severo'
    precio_estimado_uyu: number
}

// Función para analizar con Gemini Vision (simulated for demo)
async function analizarImagen(imageBase64: string): Promise<DiagnosticoResult> {
    // En producción, esto llama a una Edge Function
    // Por ahora, demo con delay simulado
    await new Promise(resolve => setTimeout(resolve, 3000))

    // Demo response - en producción viene de Gemini
    return {
        es_dispositivo: true,
        modelo_estimado: 'iPhone 13 Pro',
        marca: 'Apple',
        dano_detectado: ['Pantalla rota', 'Vidrio astillado'],
        gravedad: 'moderado',
        precio_estimado_uyu: 5500
    }
}

export default function DiagnosticoIAPage() {
    const [imagen, setImagen] = useState<string | null>(null)
    const [isDragging, setIsDragging] = useState(false)
    const [isAnalyzing, setIsAnalyzing] = useState(false)
    const [resultado, setResultado] = useState<DiagnosticoResult | null>(null)
    const [error, setError] = useState<string | null>(null)

    const handleDrop = useCallback((e: React.DragEvent) => {
        e.preventDefault()
        setIsDragging(false)

        const file = e.dataTransfer.files[0]
        if (file && file.type.startsWith('image/')) {
            processFile(file)
        }
    }, [])

    const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]
        if (file) {
            processFile(file)
        }
    }

    const processFile = (file: File) => {
        const reader = new FileReader()
        reader.onload = (e) => {
            setImagen(e.target?.result as string)
            setResultado(null)
            setError(null)
        }
        reader.readAsDataURL(file)
    }

    const handleAnalizar = async () => {
        if (!imagen) return

        setIsAnalyzing(true)
        setError(null)

        try {
            const result = await analizarImagen(imagen)
            setResultado(result)
        } catch (err) {
            setError('Error al analizar la imagen. Intentá de nuevo.')
        } finally {
            setIsAnalyzing(false)
        }
    }

    const resetear = () => {
        setImagen(null)
        setResultado(null)
        setError(null)
    }

    const gravedadConfig = {
        leve: { color: 'text-green-400', bg: 'bg-green-500/10', border: 'border-green-500/30' },
        moderado: { color: 'text-yellow-400', bg: 'bg-yellow-500/10', border: 'border-yellow-500/30' },
        severo: { color: 'text-red-400', bg: 'bg-red-500/10', border: 'border-red-500/30' }
    }

    return (
        <main className="min-h-screen pt-24 pb-16">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Header */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, ease: appleEasing }}
                    className="text-center mb-12"
                >
                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[var(--sp-red)]/10 border border-[var(--sp-red)]/30 text-[var(--sp-red)] text-sm font-medium mb-6">
                        <Sparkles className="w-4 h-4" />
                        Tecnología Exclusiva
                    </div>
                    <h1 className="heading-hero text-white mb-4">
                        Smart <span className="text-gradient-gold">Diagnostic</span>
                    </h1>
                    <p className="text-lg text-white/60 max-w-2xl mx-auto">
                        Subí una foto de tu dispositivo y nuestra IA te dará un diagnóstico instantáneo
                        con precio estimado de reparación.
                    </p>
                </motion.div>

                {/* Features */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1, duration: 0.6, ease: appleEasing }}
                    className="grid grid-cols-3 gap-4 mb-12"
                >
                    {[
                        { icon: Zap, label: 'Análisis instantáneo', desc: '< 5 segundos' },
                        { icon: Shield, label: '100% Preciso', desc: 'IA Gemini Vision' },
                        { icon: Clock, label: 'Sin compromiso', desc: 'Diagnóstico gratis' }
                    ].map((feat, i) => (
                        <div key={i} className="text-center p-4 rounded-xl bg-white/[0.02] border border-white/5">
                            <feat.icon className="w-6 h-6 text-[var(--sp-red)] mx-auto mb-2" />
                            <p className="text-sm text-white font-medium">{feat.label}</p>
                            <p className="text-xs text-white/40">{feat.desc}</p>
                        </div>
                    ))}
                </motion.div>

                {/* Main Content */}
                <AnimatePresence mode="wait">
                    {!imagen ? (
                        /* Upload Zone */
                        <motion.div
                            key="upload"
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.95 }}
                            transition={{ duration: 0.4, ease: appleEasing }}
                        >
                            <div
                                onDragOver={(e) => { e.preventDefault(); setIsDragging(true) }}
                                onDragLeave={() => setIsDragging(false)}
                                onDrop={handleDrop}
                                className={`
                                    relative p-12 rounded-3xl text-center cursor-pointer
                                    bg-white/[0.02] backdrop-blur-xl
                                    border-2 border-dashed
                                    transition-all duration-500
                                    ${isDragging
                                        ? 'border-[var(--sp-red)] bg-[var(--sp-red)]/5 scale-[1.02]'
                                        : 'border-white/10 hover:border-white/20 hover:bg-white/[0.04]'
                                    }
                                `}
                            >
                                <input
                                    type="file"
                                    accept="image/*"
                                    onChange={handleFileInput}
                                    className="absolute inset-0 opacity-0 cursor-pointer"
                                />

                                <motion.div
                                    animate={{ y: isDragging ? -10 : 0 }}
                                    transition={{ type: "spring", stiffness: 300 }}
                                >
                                    <div className="w-20 h-20 mx-auto mb-6 rounded-2xl bg-[var(--sp-red)]/10 flex items-center justify-center">
                                        <Upload className="w-10 h-10 text-[var(--sp-red)]" />
                                    </div>
                                    <h3 className="text-xl font-semibold text-white mb-2">
                                        Arrastrá tu imagen aquí
                                    </h3>
                                    <p className="text-white/50 mb-4">
                                        o hacé click para seleccionar
                                    </p>
                                    <div className="flex items-center justify-center gap-4">
                                        <span className="px-4 py-2 rounded-full bg-white/5 text-white/60 text-sm">
                                            JPG, PNG
                                        </span>
                                        <span className="px-4 py-2 rounded-full bg-white/5 text-white/60 text-sm">
                                            Máx 10MB
                                        </span>
                                    </div>
                                </motion.div>
                            </div>

                            {/* Camera option for mobile */}
                            <div className="mt-6 text-center">
                                <label className="
                                    inline-flex items-center gap-2 px-6 py-3
                                    bg-white/5 backdrop-blur-xl
                                    border border-white/10
                                    rounded-xl text-white
                                    cursor-pointer
                                    hover:bg-white/10 transition-all duration-300
                                ">
                                    <Camera className="w-5 h-5" />
                                    <span>Usar cámara</span>
                                    <input
                                        type="file"
                                        accept="image/*"
                                        capture="environment"
                                        onChange={handleFileInput}
                                        className="hidden"
                                    />
                                </label>
                            </div>
                        </motion.div>
                    ) : !resultado ? (
                        /* Preview & Analyze */
                        <motion.div
                            key="preview"
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.95 }}
                            transition={{ duration: 0.4, ease: appleEasing }}
                            className="space-y-6"
                        >
                            <div className="relative rounded-3xl overflow-hidden bg-[var(--cod-gray-light)]">
                                <img
                                    src={imagen}
                                    alt="Dispositivo a analizar"
                                    className="w-full max-h-[400px] object-contain"
                                />
                                <button
                                    onClick={resetear}
                                    className="absolute top-4 right-4 w-10 h-10 rounded-full bg-black/50 backdrop-blur-xl flex items-center justify-center text-white hover:bg-black/70 transition-colors"
                                >
                                    <X className="w-5 h-5" />
                                </button>
                            </div>

                            <motion.button
                                onClick={handleAnalizar}
                                disabled={isAnalyzing}
                                whileHover={{ scale: isAnalyzing ? 1 : 1.02, y: isAnalyzing ? 0 : -2 }}
                                whileTap={{ scale: 0.98 }}
                                className="
                                    w-full py-4 rounded-2xl
                                    bg-gradient-to-r from-[var(--sp-red)] to-[var(--sp-red-dark)]
                                    text-white font-semibold text-lg
                                    shadow-lg shadow-[var(--sp-red)]/20
                                    hover:shadow-[0_0_40px_var(--sp-red-30)]
                                    disabled:opacity-50 disabled:cursor-not-allowed
                                    flex items-center justify-center gap-3
                                    transition-all duration-300
                                "
                            >
                                {isAnalyzing ? (
                                    <>
                                        <Loader2 className="w-6 h-6 animate-spin" />
                                        Analizando con IA...
                                    </>
                                ) : (
                                    <>
                                        <Sparkles className="w-6 h-6" />
                                        Analizar con Smart Diagnostic
                                    </>
                                )}
                            </motion.button>

                            {error && (
                                <motion.div
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    className="p-4 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 flex items-center gap-3"
                                >
                                    <AlertTriangle className="w-5 h-5 flex-shrink-0" />
                                    {error}
                                </motion.div>
                            )}
                        </motion.div>
                    ) : (
                        /* Results */
                        <motion.div
                            key="results"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5, ease: appleEasing }}
                            className="space-y-6"
                        >
                            {/* Success Header */}
                            <div className="text-center mb-8">
                                <motion.div
                                    initial={{ scale: 0 }}
                                    animate={{ scale: 1 }}
                                    transition={{ type: "spring", stiffness: 200, delay: 0.2 }}
                                    className="w-16 h-16 mx-auto mb-4 rounded-full bg-green-500/10 flex items-center justify-center"
                                >
                                    <CheckCircle className="w-8 h-8 text-green-400" />
                                </motion.div>
                                <h2 className="text-2xl font-bold text-white">Diagnóstico Completo</h2>
                            </div>

                            {/* Result Card */}
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.3 }}
                                className="
                                    p-6 rounded-3xl
                                    bg-white/[0.03] backdrop-blur-2xl
                                    border border-white/[0.08]
                                    shadow-[0_20px_60px_rgba(0,0,0,0.4)]
                                "
                            >
                                <div className="flex items-start gap-6">
                                    {/* Device Image */}
                                    <div className="w-24 h-24 rounded-2xl overflow-hidden flex-shrink-0 bg-[var(--cod-gray)]">
                                        <img src={imagen} alt="" className="w-full h-full object-cover" />
                                    </div>

                                    {/* Info */}
                                    <div className="flex-1">
                                        <div className="flex items-center gap-2 mb-2">
                                            <Smartphone className="w-5 h-5 text-[var(--sp-red)]" />
                                            <span className="text-white/60 text-sm">{resultado.marca}</span>
                                        </div>
                                        <h3 className="text-2xl font-bold text-white mb-3">
                                            {resultado.modelo_estimado}
                                        </h3>

                                        {/* Severity Badge */}
                                        <span className={`
                                            inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm font-medium
                                            ${gravedadConfig[resultado.gravedad].bg}
                                            ${gravedadConfig[resultado.gravedad].color}
                                            ${gravedadConfig[resultado.gravedad].border}
                                            border
                                        `}>
                                            <AlertTriangle className="w-3 h-3" />
                                            Daño {resultado.gravedad}
                                        </span>
                                    </div>
                                </div>

                                {/* Damages */}
                                <div className="mt-6 pt-6 border-t border-white/5">
                                    <p className="text-sm text-white/50 mb-3">Daños detectados:</p>
                                    <div className="flex flex-wrap gap-2">
                                        {resultado.dano_detectado.map((dano, i) => (
                                            <span
                                                key={i}
                                                className="px-3 py-1.5 rounded-lg bg-white/5 text-white text-sm"
                                            >
                                                {dano}
                                            </span>
                                        ))}
                                    </div>
                                </div>

                                {/* Price */}
                                <div className="mt-6 pt-6 border-t border-white/5 flex items-center justify-between">
                                    <div>
                                        <p className="text-sm text-white/50">Precio estimado de reparación</p>
                                        <p className="text-3xl font-bold bg-gradient-to-r from-[var(--sp-red)] to-[var(--sp-red-light)] bg-clip-text text-transparent">
                                            {formatPriceUYU(resultado.precio_estimado_uyu)}
                                        </p>
                                    </div>
                                    <motion.div
                                        whileHover={{ scale: 1.02 }}
                                        whileTap={{ scale: 0.98 }}
                                    >
                                        <Link
                                            href="/reparacion"
                                            className="
                                                flex items-center gap-2 px-6 py-3
                                                bg-gradient-to-r from-[var(--sp-red)] to-[var(--sp-red-dark)]
                                                text-white font-semibold rounded-xl
                                                shadow-lg shadow-[var(--sp-red)]/20
                                            "
                                        >
                                            Reservar Turno
                                            <ArrowRight className="w-5 h-5" />
                                        </Link>
                                    </motion.div>
                                </div>
                            </motion.div>

                            {/* Actions */}
                            <div className="flex gap-4">
                                <button
                                    onClick={resetear}
                                    className="
                                        flex-1 py-3 rounded-xl
                                        bg-white/5 backdrop-blur-xl
                                        border border-white/10
                                        text-white font-medium
                                        hover:bg-white/10 transition-all duration-300
                                    "
                                >
                                    Analizar otro dispositivo
                                </button>
                            </div>

                            {/* Disclaimer */}
                            <p className="text-center text-xs text-white/30">
                                * Precio estimado. El costo final puede variar según condición real del dispositivo.
                            </p>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </main>
    )
}
