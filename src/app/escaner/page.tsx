'use client'

import { useState, useRef, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Camera, Upload, Loader2, Smartphone, Wrench, AlertTriangle, DollarSign, RefreshCw, X, Zap } from 'lucide-react'
import Header from '@/components/layout/header'
import { toast } from 'sonner'

interface DiagnosticoResultado {
    dispositivo: string
    daño: string
    gravedad: 'alta' | 'media' | 'baja'
    cotizacion?: {
        min: number
        max: number
    }
}

// Precios estimados por tipo de daño (UYU)
const PRECIOS_REPARACION: Record<string, { min: number; max: number }> = {
    'pantalla rota': { min: 3500, max: 12000 },
    'cristal trasero': { min: 2500, max: 6000 },
    'batería': { min: 1800, max: 4000 },
    'puerto de carga': { min: 1200, max: 3000 },
    'botones': { min: 800, max: 2000 },
    'cámara': { min: 2000, max: 8000 },
    'agua': { min: 2500, max: 6000 },
    'placa base': { min: 4000, max: 15000 },
    'otro': { min: 1500, max: 5000 },
}

export default function EscanerPage() {
    const [imagen, setImagen] = useState<string | null>(null)
    const [analizando, setAnalizando] = useState(false)
    const [resultado, setResultado] = useState<DiagnosticoResultado | null>(null)
    const [error, setError] = useState<string | null>(null)
    const fileInputRef = useRef<HTMLInputElement>(null)
    const videoRef = useRef<HTMLVideoElement>(null)
    const [usandoCamara, setUsandoCamara] = useState(false)
    const [streamActivo, setStreamActivo] = useState<MediaStream | null>(null)

    // Iniciar cámara
    const iniciarCamara = async () => {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({
                video: { facingMode: 'environment' }
            })
            if (videoRef.current) {
                videoRef.current.srcObject = stream
                setStreamActivo(stream)
                setUsandoCamara(true)
            }
        } catch (err) {
            toast.error('No se pudo acceder a la cámara')
        }
    }

    // Detener cámara
    const detenerCamara = () => {
        if (streamActivo) {
            streamActivo.getTracks().forEach(track => track.stop())
            setStreamActivo(null)
        }
        setUsandoCamara(false)
    }

    // Capturar foto desde cámara
    const capturarFoto = () => {
        if (!videoRef.current) return

        const canvas = document.createElement('canvas')
        canvas.width = videoRef.current.videoWidth
        canvas.height = videoRef.current.videoHeight
        const ctx = canvas.getContext('2d')
        if (ctx) {
            ctx.drawImage(videoRef.current, 0, 0)
            const dataUrl = canvas.toDataURL('image/jpeg', 0.8)
            setImagen(dataUrl)
            detenerCamara()
        }
    }

    // Subir imagen desde galería
    const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]
        if (file) {
            const reader = new FileReader()
            reader.onload = (e) => {
                setImagen(e.target?.result as string)
            }
            reader.readAsDataURL(file)
        }
    }

    // Analizar imagen con IA
    const analizarImagen = async () => {
        if (!imagen) return

        setAnalizando(true)
        setError(null)
        setResultado(null)

        try {
            const response = await fetch('/api/analyze-damage', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ image: imagen })
            })

            if (!response.ok) {
                throw new Error('Error al analizar la imagen')
            }

            const data = await response.json()

            // Agregar cotización basada en el daño
            const dañoLower = data.daño?.toLowerCase() || ''
            let cotizacion = PRECIOS_REPARACION['otro']

            for (const [tipo, precio] of Object.entries(PRECIOS_REPARACION)) {
                if (dañoLower.includes(tipo)) {
                    cotizacion = precio
                    break
                }
            }

            setResultado({
                ...data,
                cotizacion
            })

            toast.success('Análisis completado')
        } catch (err: any) {
            setError(err.message || 'Error al procesar la imagen')
            toast.error('No se pudo analizar la imagen')
        } finally {
            setAnalizando(false)
        }
    }

    // Reiniciar escáner
    const reiniciar = () => {
        setImagen(null)
        setResultado(null)
        setError(null)
        detenerCamara()
    }

    const getGravedadColor = (gravedad: string) => {
        switch (gravedad) {
            case 'alta': return 'text-red-400 bg-red-500/20 border-red-500/30'
            case 'media': return 'text-orange-400 bg-orange-500/20 border-orange-500/30'
            case 'baja': return 'text-green-400 bg-green-500/20 border-green-500/30'
            default: return 'text-white/60 bg-white/10 border-white/20'
        }
    }

    return (
        <>
            <Header />
            <main className="min-h-screen pt-28 pb-16 px-4">
                <div className="max-w-lg mx-auto">
                    {/* Header */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-center mb-8"
                    >
                        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[var(--sp-red)]/10 border border-[var(--sp-red)]/30 text-[var(--sp-red)] text-sm font-medium mb-4">
                            <Zap className="w-4 h-4" />
                            Diagnóstico con IA
                        </div>
                        <h1 className="text-3xl font-bold text-white mb-2">
                            Escáner SmartPoint
                        </h1>
                        <p className="text-white/60">
                            Sacá una foto de tu dispositivo y nuestra IA diagnosticará el daño
                        </p>
                    </motion.div>

                    {/* Área de captura */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        className="relative aspect-[4/3] rounded-2xl overflow-hidden bg-white/[0.02] border border-white/10 mb-6"
                    >
                        <AnimatePresence mode="wait">
                            {usandoCamara && !imagen ? (
                                <motion.div
                                    key="camera"
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    exit={{ opacity: 0 }}
                                    className="relative w-full h-full"
                                >
                                    <video
                                        ref={videoRef}
                                        autoPlay
                                        playsInline
                                        className="w-full h-full object-cover"
                                    />
                                    <div className="absolute inset-4 border-2 border-white/30 rounded-xl pointer-events-none" />
                                    <div className="absolute bottom-4 left-0 right-0 flex justify-center gap-4">
                                        <button
                                            onClick={detenerCamara}
                                            className="p-3 rounded-full bg-white/10 backdrop-blur text-white"
                                        >
                                            <X className="w-6 h-6" />
                                        </button>
                                        <button
                                            onClick={capturarFoto}
                                            className="p-4 rounded-full bg-[var(--sp-red)] text-white shadow-lg shadow-[var(--sp-red)]/30"
                                        >
                                            <Camera className="w-8 h-8" />
                                        </button>
                                    </div>
                                </motion.div>
                            ) : imagen ? (
                                <motion.div
                                    key="preview"
                                    initial={{ opacity: 0, scale: 0.9 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    exit={{ opacity: 0 }}
                                    className="relative w-full h-full"
                                >
                                    <img
                                        src={imagen}
                                        alt="Dispositivo a analizar"
                                        className="w-full h-full object-cover"
                                    />
                                    <button
                                        onClick={reiniciar}
                                        className="absolute top-3 right-3 p-2 rounded-full bg-black/50 backdrop-blur text-white hover:bg-black/70 transition-colors"
                                    >
                                        <X className="w-5 h-5" />
                                    </button>
                                </motion.div>
                            ) : (
                                <motion.div
                                    key="empty"
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    exit={{ opacity: 0 }}
                                    className="flex flex-col items-center justify-center h-full p-8 text-center"
                                >
                                    <Smartphone className="w-16 h-16 text-white/20 mb-4" />
                                    <p className="text-white/50 mb-6">
                                        Tomá una foto clara del dispositivo dañado
                                    </p>
                                    <div className="flex gap-3">
                                        <button
                                            onClick={iniciarCamara}
                                            className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[var(--sp-red)] text-white font-medium hover:bg-[var(--sp-red-dark)] transition-colors"
                                        >
                                            <Camera className="w-5 h-5" />
                                            Usar Cámara
                                        </button>
                                        <button
                                            onClick={() => fileInputRef.current?.click()}
                                            className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-white/10 text-white font-medium hover:bg-white/20 transition-colors"
                                        >
                                            <Upload className="w-5 h-5" />
                                            Subir Foto
                                        </button>
                                    </div>
                                    <input
                                        ref={fileInputRef}
                                        type="file"
                                        accept="image/*"
                                        onChange={handleFileSelect}
                                        className="hidden"
                                    />
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </motion.div>

                    {/* Botón de análisis */}
                    {imagen && !resultado && (
                        <motion.button
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            onClick={analizarImagen}
                            disabled={analizando}
                            className="w-full py-4 rounded-xl bg-gradient-to-r from-[var(--sp-red)] to-[var(--sp-red-dark)] text-white font-semibold text-lg flex items-center justify-center gap-3 disabled:opacity-50 shadow-lg shadow-[var(--sp-red)]/20"
                        >
                            {analizando ? (
                                <>
                                    <Loader2 className="w-5 h-5 animate-spin" />
                                    Analizando con IA...
                                </>
                            ) : (
                                <>
                                    <Zap className="w-5 h-5" />
                                    Diagnosticar Daño
                                </>
                            )}
                        </motion.button>
                    )}

                    {/* Resultado del análisis */}
                    <AnimatePresence>
                        {resultado && (
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -20 }}
                                className="space-y-4 mt-6"
                            >
                                {/* Dispositivo detectado */}
                                <div className="p-5 rounded-2xl bg-white/[0.03] border border-white/10">
                                    <div className="flex items-center gap-3 mb-3">
                                        <div className="w-10 h-10 rounded-xl bg-blue-500/20 flex items-center justify-center">
                                            <Smartphone className="w-5 h-5 text-blue-400" />
                                        </div>
                                        <div>
                                            <p className="text-xs text-white/50 uppercase tracking-wider">Dispositivo</p>
                                            <p className="text-white font-semibold">{resultado.dispositivo}</p>
                                        </div>
                                    </div>
                                </div>

                                {/* Daño detectado */}
                                <div className="p-5 rounded-2xl bg-white/[0.03] border border-white/10">
                                    <div className="flex items-center gap-3 mb-3">
                                        <div className="w-10 h-10 rounded-xl bg-orange-500/20 flex items-center justify-center">
                                            <Wrench className="w-5 h-5 text-orange-400" />
                                        </div>
                                        <div className="flex-1">
                                            <p className="text-xs text-white/50 uppercase tracking-wider">Problema Detectado</p>
                                            <p className="text-white font-semibold">{resultado.daño}</p>
                                        </div>
                                        <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase border ${getGravedadColor(resultado.gravedad)}`}>
                                            {resultado.gravedad}
                                        </span>
                                    </div>
                                </div>

                                {/* Cotización */}
                                {resultado.cotizacion && (
                                    <div className="p-5 rounded-2xl bg-gradient-to-br from-[var(--sp-red)]/20 to-[var(--sp-red)]/5 border border-[var(--sp-red)]/30">
                                        <div className="flex items-center gap-3 mb-3">
                                            <div className="w-10 h-10 rounded-xl bg-[var(--sp-red)]/30 flex items-center justify-center">
                                                <DollarSign className="w-5 h-5 text-[var(--sp-red)]" />
                                            </div>
                                            <div>
                                                <p className="text-xs text-white/50 uppercase tracking-wider">Cotización Estimada</p>
                                                <p className="text-2xl font-bold text-white">
                                                    ${resultado.cotizacion.min.toLocaleString()} - ${resultado.cotizacion.max.toLocaleString()}
                                                </p>
                                                <p className="text-xs text-white/40">Precio final sujeto a revisión presencial</p>
                                            </div>
                                        </div>
                                    </div>
                                )}

                                {/* CTA */}
                                <div className="flex gap-3 pt-2">
                                    <button
                                        onClick={reiniciar}
                                        className="flex-1 py-3 rounded-xl bg-white/10 text-white font-medium flex items-center justify-center gap-2 hover:bg-white/20 transition-colors"
                                    >
                                        <RefreshCw className="w-4 h-4" />
                                        Nuevo Escaneo
                                    </button>
                                    <a
                                        href="https://wa.me/59899123456?text=Hola!%20Acabo%20de%20usar%20el%20escáner%20y%20me%20gustaría%20agendar%20una%20revisión."
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="flex-1 py-3 rounded-xl bg-[var(--sp-red)] text-white font-medium flex items-center justify-center gap-2 hover:bg-[var(--sp-red-dark)] transition-colors"
                                    >
                                        Agendar Revisión
                                    </a>
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>

                    {/* Error */}
                    {error && (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className="mt-6 p-4 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 flex items-center gap-3"
                        >
                            <AlertTriangle className="w-5 h-5 flex-shrink-0" />
                            <p>{error}</p>
                        </motion.div>
                    )}
                </div>
            </main>
        </>
    )
}
