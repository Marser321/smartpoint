'use client'

import { useState, useEffect, Suspense } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { Cpu, HardDrive, ArrowLeft, Loader2, CheckCircle, AlertTriangle, Zap, BarChart3, Database, Sparkles } from 'lucide-react'
import Header from '@/components/layout/header'
import { toast } from 'sonner'

interface SpecAnalysis {
    model_detected: string
    ram: {
        type: string
        max_capacity: string
        slots: number | string
        upgrade_recommendation: string
    }
    storage: {
        type: string
        max_capacity: string
        slots: string
        upgrade_recommendation: string
    }
    analysis: string
}

function UpgradeContent() {
    const searchParams = useSearchParams()
    const router = useRouter()
    const initialModel = searchParams.get('model') || ''

    const [loading, setLoading] = useState(true)
    const [data, setData] = useState<SpecAnalysis | null>(null)
    const [error, setError] = useState('')

    useEffect(() => {
        if (!initialModel) {
            router.push('/lab')
            return
        }

        const fetchSpecs = async () => {
            try {
                const res = await fetch('/api/analyze-specs', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ model: initialModel })
                })

                if (!res.ok) throw new Error('Error al analizar')

                const json = await res.json()
                setData(json)
            } catch (err) {
                setError('No pudimos identificar este modelo con certeza. Intentá ser más específico.')
                toast.error('Error de análisis')
            } finally {
                setLoading(false)
            }
        }

        fetchSpecs()
    }, [initialModel, router])

    if (loading) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center text-center px-4">
                <Loader2 className="w-12 h-12 text-blue-500 animate-spin mb-4" />
                <h2 className="text-2xl font-bold text-white mb-2">Analizando Arquitectura...</h2>
                <p className="text-white/50">Consultando base de conocimientos de hardware</p>
                <p className="text-blue-400 text-sm mt-4 font-mono">{initialModel}</p>
            </div>
        )
    }

    if (error || !data) {
        return (
            <div className="min-h-screen pt-32 px-4 max-w-md mx-auto text-center">
                <div className="p-6 rounded-2xl bg-red-500/10 border border-red-500/20 mb-6">
                    <AlertTriangle className="w-12 h-12 text-red-400 mx-auto mb-4" />
                    <h3 className="text-xl font-bold text-white mb-2">Modelo no encontrado</h3>
                    <p className="text-white/60">{error}</p>
                </div>
                <button
                    onClick={() => router.push('/lab')}
                    className="px-6 py-3 rounded-xl bg-white/10 text-white hover:bg-white/20 transition-colors"
                >
                    Volver al buscador
                </button>
            </div>
        )
    }

    return (
        <>
            <Header />
            <main className="pt-28 pb-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
                <button
                    onClick={() => router.back()}
                    className="flex items-center gap-2 text-white/50 hover:text-white transition-colors mb-8"
                >
                    <ArrowLeft className="w-4 h-4" />
                    Volver
                </button>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Main Info */}
                    <div className="lg:col-span-2 space-y-8">
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="bg-gradient-to-br from-gray-900 to-black border border-white/10 rounded-3xl p-8 overflow-hidden relative"
                        >
                            <div className="absolute top-0 right-0 p-32 bg-blue-500/10 blur-[100px] rounded-full" />

                            <h1 className="text-3xl font-bold text-white mb-2 relative z-10">
                                {data.model_detected}
                            </h1>
                            <p className="text-white/60 text-lg mb-6 relative z-10">
                                {data.analysis}
                            </p>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 relative z-10">
                                <SpecCard
                                    icon={<Cpu className="w-5 h-5 text-purple-400" />}
                                    title="Memoria RAM"
                                    value={data.ram.type}
                                    sub={`Máx: ${data.ram.max_capacity} (${data.ram.slots} slots)`}
                                />
                                <SpecCard
                                    icon={<Database className="w-5 h-5 text-blue-400" />}
                                    title="Almacenamiento"
                                    value={data.storage.type}
                                    sub={data.storage.slots}
                                />
                            </div>
                        </motion.div>

                        {/* Performance Charts */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <PerformanceChart
                                title="Velocidad Multitarea (RAM)"
                                before={40}
                                after={95}
                                color="bg-purple-500"
                            />
                            <PerformanceChart
                                title="Velocidad de Carga (SSD)"
                                before={30}
                                after={100}
                                color="bg-blue-500"
                            />
                        </div>
                    </div>

                    {/* Recommendations Sidebar */}
                    <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.2 }}
                        className="space-y-6"
                    >
                        <h3 className="text-xl font-bold text-white flex items-center gap-2">
                            <Sparkles className="w-5 h-5 text-yellow-400" />
                            Upgrades Recomendados
                        </h3>

                        <UpgradeOption
                            type="RAM"
                            product={data.ram.upgrade_recommendation}
                            benefit="Ideal para streaming y crome con muchas pestañas."
                            icon={<Cpu className="w-6 h-6" />}
                            color="purple"
                        />

                        <UpgradeOption
                            type="SSD"
                            product={data.storage.upgrade_recommendation}
                            benefit="Carga Windows en segundos y juegos instantáneos."
                            icon={<HardDrive className="w-6 h-6" />}
                            color="blue"
                        />

                        <div className="p-6 rounded-2xl bg-[var(--sp-red)]/10 border border-[var(--sp-red)]/30 text-center space-y-4">
                            <h4 className="text-white font-bold text-lg">¿Querés instalar esto?</h4>
                            <p className="text-white/60 text-sm">
                                Traé tu equipo y hacemos la instalación en el acto con garantía.
                            </p>
                            <a
                                href={`https://wa.me/59899123456?text=Hola,%20tengo%20una%20${encodeURIComponent(data.model_detected)}%20y%20quiero%20hacer%20el%20upgrade%20sugerido.`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="block w-full py-3 rounded-xl bg-[var(--sp-red)] text-white font-bold hover:bg-[var(--sp-red-dark)] transition-colors"
                            >
                                Agendar Turno
                            </a>
                        </div>
                    </motion.div>
                </div>
            </main>
        </>
    )
}

function SpecCard({ icon, title, value, sub }: any) {
    return (
        <div className="p-4 rounded-xl bg-white/5 border border-white/10">
            <div className="flex items-center gap-3 mb-2">
                <div className="p-2 rounded-lg bg-white/5">
                    {icon}
                </div>
                <span className="text-white/70 font-medium">{title}</span>
            </div>
            <div className="pl-12">
                <p className="text-white font-semibold">{value}</p>
                <p className="text-white/40 text-sm">{sub}</p>
            </div>
        </div>
    )
}

function PerformanceChart({ title, before, after, color }: any) {
    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="p-6 rounded-2xl bg-white/[0.02] border border-white/5"
        >
            <h4 className="text-white/80 font-medium mb-6 flex items-center gap-2">
                <BarChart3 className="w-4 h-4" />
                {title}
            </h4>

            <div className="space-y-4">
                <div>
                    <div className="flex justify-between text-xs text-white/40 mb-1">
                        <span>Actual (Estimado)</span>
                        <span>Lento</span>
                    </div>
                    <div className="h-3 bg-white/10 rounded-full overflow-hidden">
                        <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: `${before}%` }}
                            transition={{ duration: 1, delay: 0.5 }}
                            className="h-full bg-white/30 rounded-full"
                        />
                    </div>
                </div>

                <div>
                    <div className="flex justify-between text-xs text-white/40 mb-1">
                        <span className="text-white font-bold">Con Upgrade 🔥</span>
                        <span className="text-green-400">Rápido</span>
                    </div>
                    <div className="h-4 bg-white/10 rounded-full overflow-hidden shadow-[0_0_15px_rgba(0,0,0,0.5)]">
                        <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: `${after}%` }}
                            transition={{ duration: 1.5, delay: 0.8, type: "spring" }}
                            className={`h-full ${color} rounded-full relative`}
                        >
                            <div className="absolute inset-0 bg-white/20 animate-pulse" />
                        </motion.div>
                    </div>
                </div>
            </div>
        </motion.div>
    )
}

function UpgradeOption({ type, product, benefit, icon, color }: any) {
    const colorClasses = {
        purple: "bg-purple-500/10 border-purple-500/20 text-purple-400",
        blue: "bg-blue-500/10 border-blue-500/20 text-blue-400"
    }

    return (
        <div className={`p-5 rounded-2xl border ${colorClasses[color as keyof typeof colorClasses]} backdrop-blur-sm`}>
            <div className="flex justify-between items-start mb-3">
                <div className="flex items-center gap-3">
                    <div className={`p-2 rounded-lg bg-black/20 text-white`}>
                        {icon}
                    </div>
                    <div>
                        <span className="text-xs uppercase font-bold tracking-wider opacity-70">Recomendado</span>
                        <h4 className="text-white font-bold">{type}</h4>
                    </div>
                </div>
                <CheckCircle className="w-5 h-5 opacity-50" />
            </div>
            <p className="text-white font-medium mb-1">{product}</p>
            <p className="text-white/60 text-sm leading-relaxed">{benefit}</p>
        </div>
    )
}

export default function UpgradePage() {
    return (
        <Suspense fallback={<div className="min-h-screen bg-black" />}>
            <UpgradeContent />
        </Suspense>
    )
}
